const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'talsinvestmentsecretkey123';
const ADMIN_KEY = 'tals-admin-2026';

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// MONGODB CONNECTION
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/talsinvestment')
    .then(() => console.log('MongoDB Connected successfully'))
    .catch((err) => {
        console.error('MongoDB Connection Error:', err.message);
    });

// USER SCHEMA
const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    country: { type: String, required: true },
    balance: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
    withdrawal: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// TRANSACTION SCHEMA
const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['Deposit', 'Withdrawal', 'Deduction'], required: true },
    plan: { type: String, default: null },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Paid', 'Pending'], default: 'Paid' },
    date: { type: Date, default: Date.now }
});
const Transaction = mongoose.model('Transaction', transactionSchema);

// MIDDLEWARE: Verify JWT Token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// ROUTE: REGISTER USER
app.post('/api/register', async (req, res) => {
    try {
        const { fullname, email, password, country } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullname, email, password: hashedPassword, country });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// ROUTE: LOGIN USER
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({
            message: 'Login successful',
            token,
            fullname: user.fullname,
            email: user.email,
            userId: user._id
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login' });
    }
});

// ROUTE: GET USER STATS
app.get('/api/user/stats', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('balance profit withdrawal');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user stats' });
    }
});

// ROUTE: CREATE DEPOSIT
app.post('/api/deposit', verifyToken, async (req, res) => {
    try {
        const { plan, amount } = req.body;
        if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

        const transaction = new Transaction({
            userId: req.user.userId,
            type: 'Deposit',
            plan: plan,
            amount: amount,
            status: 'Paid'
        });
        await transaction.save();

        await User.findByIdAndUpdate(req.userId, {
            $inc: { balance: amount, profit: amount }
        });

        res.status(201).json({ message: 'Deposit successful', transaction });
    } catch (error) {
        res.status(500).json({ message: 'Deposit failed: ' + error.message });
    }
});

// ROUTE: GET USER TRANSACTIONS
app.get('/api/transactions', verifyToken, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.userId })
            .sort({ date: -1 })
            .limit(10);
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch transactions' });
    }
});

// ===== ADMIN ROUTES =====

// GET ALL USERS FOR ADMIN PANEL
app.get('/api/admin/users', async (req, res) => {
    try {
        const { adminKey } = req.query;
        if (adminKey !== ADMIN_KEY) return res.status(401).json({ message: 'Unauthorized' });

        const users = await User.find({})
            .select('fullname email balance profit withdrawal createdAt')
            .sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

// GET SINGLE USER BY ID
app.get('/api/admin/user/:id', async (req, res) => {
    try {
        const { adminKey } = req.query;
        if (adminKey !== ADMIN_KEY) return res.status(401).json({ message: 'Unauthorized' });

        const user = await User.findById(req.params.id).select('fullname email balance profit withdrawal');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user' });
    }
});

// ADMIN - UPDATE USER FIELD - BALANCE, PROFIT, WITHDRAWAL
app.post('/api/admin/update-field', async (req, res) => {
    try {
        const { adminKey, userId, field, amount, type } = req.body;

        if (adminKey !== ADMIN_KEY) return res.status(401).json({ message: 'Unauthorized' });
        if (!userId || !field || !amount || amount <= 0) return res.status(400).json({ message: 'Invalid data' });

        const allowedFields = ['balance', 'profit', 'withdrawal'];
        if (!allowedFields.includes(field)) return res.status(400).json({ message: 'Invalid field. Use balance, profit, or withdrawal' });

        let updateQuery = {};

        if (type === 'add') {
            updateQuery.$inc = { [field]: amount };
        } else if (type === 'deduct') {
            const currentUser = await User.findById(userId).select(field);
            if (!currentUser) return res.status(404).json({ message: 'User not found' });
            const newValue = Math.max(0, currentUser[field] - amount);
            updateQuery.$set = { [field]: newValue };
        } else {
            return res.status(400).json({ message: 'Type must be add or deduct' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateQuery,
            { new: true, runValidators: false } // skips country validation
        ).select('fullname email balance profit withdrawal');

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        // Only create transaction for balance changes
        if (field === 'balance') {
            await Transaction.create({
                userId: userId,
                type: type === 'add' ? 'Deposit' : 'Deduction',
                amount: amount,
                status: 'Paid'
            });
        }

        res.status(200).json({ message: `${field} ${type}ed successfully`, user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update field: ' + error.message });
    }
});

// ROUTE: SERVE PAGES
app.get('/dashboard.html', (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));
app.get('/login.html', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/register.html', (req, res) => res.sendFile(path.join(__dirname, 'register.html')));
app.get('/admin.html', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, 'index.html'))); // FIXED: Home button now works
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// For Vercel deployment - do not use app.listen on Vercel
if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;