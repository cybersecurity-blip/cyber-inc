class CyberSafeApp {
  constructor() {
    this.init();
    this.handleScrollEvents();
  }

  init() {
    this.dom = {
      loginBtn: document.getElementById('loginBtn'),
      registerBtn: document.getElementById('registerBtn'),
      authModal: document.getElementById('authModal'),
      closeModal: document.querySelector('.close-modal'),
      tabBtns: document.querySelectorAll('.tab-btn'),
      authForms: document.querySelectorAll('.auth-form'),
      navLinks: document.querySelectorAll('nav a'),
      header: document.querySelector('header')
    };

    this.addEventListeners();
  }

  addEventListeners() {
    if (this.dom.loginBtn) {
      this.dom.loginBtn.addEventListener('click', () => this.toggleModal('login'));
    }
    if (this.dom.registerBtn) {
      this.dom.registerBtn.addEventListener('click', () => this.toggleModal('register'));
    }
    if (this.dom.closeModal) {
      this.dom.closeModal.addEventListener('click', () => this.toggleModal());
    }

    window.addEventListener('click', (e) => {
      if (e.target === this.dom.authModal) this.toggleModal();
    });

    this.dom.navLinks?.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  toggleModal(action = null) {
    if (!this.dom.authModal) return;
    
    if (action === null) {
      this.dom.authModal.style.display = 
        this.dom.authModal.style.display === 'block' ? 'none' : 'block';
    } else {
      this.dom.authModal.style.display = 'block';
      this.switchTab(action);
    }
  }

  switchTab(tabName) {
    this.dom.tabBtns?.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });
    
    this.dom.authForms?.forEach(form => {
      form.classList.toggle('active', form.id === tabName);
    });
  }

  handleScrollEvents() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        this.dom.header?.classList.add('scrolled');
      } else {
        this.dom.header?.classList.remove('scrolled');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CyberSafeApp();
});
  const app = new CyberSafeApp();
  
  // Make available globally for debugging
  window.CyberSafeApp = app;
});
