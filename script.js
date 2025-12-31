// Data
const currencies = [
    { pair: 'USD/TRY', value: 34.42, trend: 'up' },
    { pair: 'EUR/TRY', value: 37.85, trend: 'up' },
    { pair: 'GBP/TRY', value: 43.12, trend: 'down' },
    { pair: 'BTC/USD', value: 98450, trend: 'up' },
    { pair: 'ETH/USD', value: 3210, trend: 'down' },
    { pair: 'SOL/USD', value: 145, trend: 'up' },
    { pair: 'XRP/USD', value: 2.45, trend: 'up' },
    { pair: 'USD/EUR', value: 0.92, trend: 'down' },
    { pair: 'GOLD', value: 2650, trend: 'up' },
];

const transactions = [
    { title: 'Netflix Subscription', date: 'Today, 10:45 AM', amount: -15.99, icon: 'film-outline' },
    { title: 'Salary Deposit', date: 'Yesterday, 09:00 AM', amount: 4500.00, icon: 'briefcase-outline' },
    { title: 'Starbucks Coffee', date: 'Yesterday, 08:30 AM', amount: -5.40, icon: 'cafe-outline' },
    { title: 'Grocery Store', date: '2 days ago', amount: -120.50, icon: 'cart-outline' },
    { title: 'Transfer from Jane', date: '3 days ago', amount: 50.00, icon: 'cash-outline' },
];

// Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const tickerContainer = document.getElementById('currency-ticker');
const transactionListPosition = document.getElementById('transaction-list');
const balanceDisplay = document.getElementById('balance-display');
const logoutBtn = document.getElementById('logout-btn');

// --- LOGIN LOGIC ---
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'user' && pass === '1234') {
        // Success
        loginError.textContent = '';
        loginSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        // Trigger animations/data load
        initDashboard();
    } else {
        // Fail
        loginError.textContent = 'Invalid username or password (Try: user / 1234)';
        shakeForm();
    }
});

function shakeForm() {
    loginSection.querySelector('.login-card').animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(10px)' },
        { transform: 'translateX(0)' }
    ], {
        duration: 300
    });
}


logoutBtn.addEventListener('click', () => {
    dashboardSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
});

// --- DASHBOARD LOGIC ---

function initDashboard() {
    renderTransactions();
    startTickerSimulation();
    animateNumbers(12450.00, balanceDisplay);
}

function renderTransactions() {
    transactionListPosition.innerHTML = '';
    transactions.forEach(t => {
        const isPositive = t.amount > 0;
        const colorClass = isPositive ? 'positive' : 'negative';
        const sign = isPositive ? '+' : '';

        const html = `
            <li class="transaction-item">
                <div style="display:flex; align-items:center;">
                    <div class="t-icon">
                        <ion-icon name="${t.icon}"></ion-icon>
                    </div>
                    <div class="t-info">
                        <span class="t-title">${t.title}</span>
                        <span class="t-date">${t.date}</span>
                    </div>
                </div>
                <div class="t-amount ${colorClass}">${sign}$${Math.abs(t.amount).toFixed(2)}</div>
            </li>
        `;
        transactionListPosition.insertAdjacentHTML('beforeend', html);
    });
}

function startTickerSimulation() {
    // Initial Render
    renderTickerItems();

    // Update prices randomly every 3 seconds
    setInterval(() => {
        currencies.forEach(c => {
            const change = (Math.random() - 0.5) * 0.5; // Random small flucuation
            c.value = Math.max(0, c.value + change);
            c.trend = change >= 0 ? 'up' : 'down';
        });
        renderTickerItems();
    }, 3000);
}

function renderTickerItems() {
    // We need to duplicate items to create a seamless infinite scroll effect visually
    // or just update existing DOM nodes.
    // For simplicity in this demo, let's just rebuild the inner HTML. 
    // Note: Rebuilding HTML might reset CSS animation if not careful, 
    // but since the animation is on the container and content flows, it might be jittery.
    // Better approach: Update the numbers in place if they exist, or just just let it flow.
    // Given the requirement "dolar kurları falan aksın", a simple CSS marquee is best.
    // Let's just generate the HTML string once and update values? 
    // Actually, constantly updating innerHTML kills the CSS animation state.
    // So distinct strategy: Create elements once, update text content.

    if (tickerContainer.children.length === 0) {
        // Create initial elements (doubled for scrolling smoothness)
        [...currencies, ...currencies].forEach((c, index) => {
            const item = document.createElement('div');
            item.className = 'ticker-item';
            item.dataset.index = index % currencies.length; // Keep track of real data index
            item.innerHTML = `${c.pair} <span class="ticker-val">...</span>`;
            tickerContainer.appendChild(item);
        });
    }

    // Update values
    const items = tickerContainer.querySelectorAll('.ticker-item');
    items.forEach(item => {
        const index = item.dataset.index;
        const data = currencies[index];
        const valSpan = item.querySelector('.ticker-val');

        valSpan.textContent = data.value.toFixed(2);
        valSpan.className = data.trend === 'up' ? 'positive' : 'down';
        valSpan.style.color = data.trend === 'up' ? 'var(--success)' : 'var(--danger)';
    });
}

function animateNumbers(target, element) {
    let current = 0;
    const increment = target / 50;
    const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        element.textContent = current.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }, 20);
}
