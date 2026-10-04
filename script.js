// CHART - only runs if canvas exists
document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('earningsChart');
    if (ctx) {
        new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Monthly Growth ($)',
                    data: [1000, 1400, 1960, 2744, 3840, 5376, 7526, 10536, 14750, 20650, 28910, 40474],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#fff',
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#cbd5e1', font: { size: 14 } }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: '#1e293b' }
                    },
                    y: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: '#1e293b' }
                    }
                }
            }
        });
    }
});

// LANGUAGE SIDEBAR + TRANSLATION
const langBtn = document.getElementById('langBtn');
const langSidebar = document.getElementById('langSidebar');
const langOverlay = document.getElementById('langOverlay');
const langClose = document.getElementById('langClose');
const langList = document.getElementById('langList');
const langSearch = document.getElementById('langSearch');

// ALL 100+ LANGUAGES
const languages = [
    { code: 'af', name: 'Afrikaans' }, { code: 'sq', name: 'Albanian' }, { code: 'am', name: 'Amharic' },
    { code: 'ar', name: 'Arabic' }, { code: 'hy', name: 'Armenian' }, { code: 'az', name: 'Azerbaijani' },
    { code: 'eu', name: 'Basque' }, { code: 'be', name: 'Belarusian' }, { code: 'bn', name: 'Bengali' },
    { code: 'bs', name: 'Bosnian' }, { code: 'bg', name: 'Bulgarian' }, { code: 'ca', name: 'Catalan' },
    { code: 'zh', name: 'Chinese' }, { code: 'hr', name: 'Croatian' }, { code: 'cs', name: 'Czech' },
    { code: 'da', name: 'Danish' }, { code: 'nl', name: 'Dutch' }, { code: 'en', name: 'English' },
    { code: 'et', name: 'Estonian' }, { code: 'fi', name: 'Finnish' }, { code: 'fr', name: 'French' },
    { code: 'gl', name: 'Galician' }, { code: 'ka', name: 'Georgian' }, { code: 'de', name: 'German' },
    { code: 'el', name: 'Greek' }, { code: 'gu', name: 'Gujarati' }, { code: 'ht', name: 'Haitian Creole' },
    { code: 'ha', name: 'Hausa' }, { code: 'he', name: 'Hebrew' }, { code: 'hi', name: 'Hindi' },
    { code: 'hu', name: 'Hungarian' }, { code: 'is', name: 'Icelandic' }, { code: 'id', name: 'Indonesian' },
    { code: 'ga', name: 'Irish' }, { code: 'it', name: 'Italian' }, { code: 'ja', name: 'Japanese' },
    { code: 'kn', name: 'Kannada' }, { code: 'kk', name: 'Kazakh' }, { code: 'ko', name: 'Korean' },
    { code: 'ky', name: 'Kyrgyz' }, { code: 'lo', name: 'Lao' }, { code: 'lv', name: 'Latvian' },
    { code: 'lt', name: 'Lithuanian' }, { code: 'mk', name: 'Macedonian' }, { code: 'ms', name: 'Malay' },
    { code: 'ml', name: 'Malayalam' }, { code: 'mt', name: 'Maltese' }, { code: 'mi', name: 'Maori' },
    { code: 'mr', name: 'Marathi' }, { code: 'mn', name: 'Mongolian' }, { code: 'ne', name: 'Nepali' },
    { code: 'no', name: 'Norwegian' }, { code: 'fa', name: 'Persian' }, { code: 'pl', name: 'Polish' },
    { code: 'pt', name: 'Portuguese' }, { code: 'pa', name: 'Punjabi' }, { code: 'ro', name: 'Romanian' },
    { code: 'ru', name: 'Russian' }, { code: 'sr', name: 'Serbian' }, { code: 'si', name: 'Sinhala' },
    { code: 'sk', name: 'Slovak' }, { code: 'sl', name: 'Slovenian' }, { code: 'es', name: 'Spanish' },
    { code: 'sw', name: 'Swahili' }, { code: 'sv', name: 'Swedish' }, { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' }, { code: 'th', name: 'Thai' }, { code: 'tr', name: 'Turkish' },
    { code: 'uk', name: 'Ukrainian' }, { code: 'ur', name: 'Urdu' }, { code: 'uz', name: 'Uzbek' },
    { code: 'vi', name: 'Vietnamese' }, { code: 'cy', name: 'Welsh' }, { code: 'xh', name: 'Xhosa' },
    { code: 'yi', name: 'Yiddish' }, { code: 'yo', name: 'Yoruba' }, { code: 'zu', name: 'Zulu' }
];

// TRANSLATIONS - only English, Spanish, French for now
const translations = {
    en: {
        select_language: "Select Language",
        nav_home: "Home",
        nav_services: "Services",
        nav_plans: "Investment Plans",
        nav_earnings: "Earnings",
        nav_reviews: "Reviews",
        nav_contact: "Contact Us",
        language: "Language",
        hero_welcome: "Welcome to Tals Investment",
        hero_title: "Invest in the <span>Digital Economy</span>",
        hero_subtitle: "Your financial future starts here. Let us help you grow your wealth with our expert investment strategies.",
        hero_register: "REGISTER",
        hero_login: "LOGIN",
        services_title: "Our <span>Services</span>",
        services_subtitle: "We provide tailored investment solutions for your financial growth",
        service_1_title: "Investment Planning",
        service_1_desc: "Strategic portfolio management designed to maximize returns while minimizing risk for long-term wealth.",
        service_2_title: "Digital Assets",
        service_2_desc: "Secure crypto and digital economy investments with real-time market analysis and expert guidance.",
        service_3_title: "Wealth Management",
        service_3_desc: "Comprehensive financial advisory services to protect and grow your assets across all markets.",
        plans_title: "Our <span>Investment Plans</span>",
        plans_subtitle: "Choose the perfect plan that matches your investment goals and start earning today",
        plan_badge_1: "Stock Market",
        plan_badge_2: "Silver",
        plan_badge_3: "Gold",
        plan_1_title: "Starter Plan",
        plan_2_title: "Pro Plan",
        plan_3_title: "VIP Plan",
        plan_min: "Minimum Investment",
        plan_roi: "Weekly ROI",
        plan_duration: "Duration",
        plan_no_limit: "No Limit",
        plan_deposit: "Deposit Now",
        chart_title: "Earnings <span>Overview</span>",
        chart_subtitle: "See how your investment grows over time with our proven strategy",
        chart_heading: "Monthly Growth Chart",
        reviews_title: "What Our <span>Investors Say</span>",
        reviews_subtitle: "Join thousands of satisfied investors growing their wealth with us",
        review_1: '"Tals Investment changed my financial game. The dashboard makes tracking easy and customer support is responsive. Highly recommended!"',
        review_2: '"Professional platform with excellent service. The interface is clean and I can monitor my investments in real-time without any issues."',
        review_3: '"Transparent and secure platform. I feel confident using it and the support team is always available when I need help."',
        contact_title: "Contact <span>Us</span>",
        contact_subtitle: "Have questions? Our support team is here to help you 24/7",
        contact_heading: "Get in Touch",
        contact_desc: "Reach out to our company manager directly on WhatsApp for deposits, account support, or investment inquiries. We typically respond within 24 hours.",
        deposit_title: "Deposit Now",
        deposit_text: "Contact our manager on WhatsApp to complete your deposit and start earning.",
        deposit_btn: "Contact on WhatsApp"
    },
    es: {
        select_language: "Seleccionar Idioma",
        nav_home: "Inicio",
        nav_services: "Servicios",
        nav_plans: "Planes de Inversión",
        nav_earnings: "Ganancias",
        nav_reviews: "Reseñas",
        nav_contact: "Contáctenos",
        language: "Idioma",
        hero_welcome: "Bienvenido a Tals Investment",
        hero_title: "Invierte en la <span>Economía Digital</span>",
        hero_subtitle: "Tu futuro financiero comienza aquí. Permítenos ayudarte a hacer crecer tu patrimonio con nuestras estrategias expertas de inversión.",
        hero_register: "REGISTRARSE",
        hero_login: "INICIAR SESIÓN"
    },
    fr: {
        select_language: "Sélectionner la Langue",
        nav_home: "Accueil",
        nav_services: "Services",
        nav_plans: "Plans d'Investissement",
        nav_earnings: "Gains",
        nav_reviews: "Avis",
        nav_contact: "Contactez-nous",
        language: "Langue",
        hero_welcome: "Bienvenue chez Tals Investment",
        hero_title: "Investissez dans l'<span>Économie Numérique</span>",
        hero_subtitle: "Votre avenir financier commence ici. Laissez-nous vous aider à faire croître votre richesse avec nos stratégies d'investissement expertes.",
        hero_register: "S'INSCRIRE",
        hero_login: "SE CONNECTER"
    }
};

function renderLanguages(filter = '') {
    if (!langList) return;
    langList.innerHTML = '';
    languages.filter(lang => lang.name.toLowerCase().includes(filter.toLowerCase()))
        .forEach(lang => {
            const li = document.createElement('li');
            li.textContent = lang.name;
            li.onclick = () => {
                document.querySelectorAll('.lang-list li').forEach(item => item.classList.remove('active'));
                li.classList.add('active');
                changeLanguage(lang.code);
                langSidebar.classList.remove('active');
                langOverlay.classList.remove('active');
            };
            langList.appendChild(li);
        });
}
renderLanguages();

function changeLanguage(langCode) {
    const langData = translations[langCode];

    // If translation doesn't exist yet, show alert and keep English
    if (!langData) {
        alert('Translation for this language is coming soon. Showing English for now.');
        return;
    }

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (langData[key]) {
            element.innerHTML = langData[key];
        }
    });
    document.documentElement.lang = langCode;
    localStorage.setItem('selectedLanguage', langCode);
}

window.addEventListener('load', () => {
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    changeLanguage(savedLang);
});

if (langBtn) langBtn.addEventListener('click', () => {
    langSidebar.classList.add('active');
    langOverlay.classList.add('active');
});

if (langClose) langClose.addEventListener('click', () => {
    langSidebar.classList.remove('active');
    langOverlay.classList.remove('active');
});

if (langOverlay) langOverlay.addEventListener('click', () => {
    langSidebar.classList.remove('active');
    langOverlay.classList.remove('active');
});

if (langSearch) langSearch.addEventListener('input', (e) => {
    renderLanguages(e.target.value);
});

function openDepositModal() {
    document.getElementById('depositModal')?.classList.add('active');
}
function closeDepositModal() {
    document.getElementById('depositModal')?.classList.remove('active');
}