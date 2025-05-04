// Login form submission
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        // Simulate login request
        console.log('Login attempt with:', email);
        alert('Login simulation successful! In a real app, this would redirect to dashboard.');
        toggleModal();
    } catch (err) {
        console.error('Login error:', err);
        alert('An error occurred during login.');
    }
});

// Register form submission
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    try {
        // Simulate registration
        console.log('Registration attempt:', { name, email });
        alert('Registration simulation successful! In a real app, this would create an account.');
        switchTab('login');
    } catch (err) {
        console.error('Registration error:', err);
        alert('An error occurred during registration.');
    }
});

// Google login simulation
document.getElementById('googleLogin')?.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Google login initiated');
    alert('Google login simulation! In a real app, this would redirect to Google OAuth.');
});

document.getElementById('googleRegister')?.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Google registration initiated');
    alert('Google registration simulation!');
});

// Helper function to toggle modal (from main.js)
function toggleModal() {
    const authModal = document.getElementById('authModal');
    authModal.style.display = authModal.style.display === 'block' ? 'none' : 'block';
}

// Helper function to switch tabs (from main.js)
function switchTab(tabName) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });
    
    authForms.forEach(form => {
        form.classList.toggle('active', form.id === tabName);
    });
}
