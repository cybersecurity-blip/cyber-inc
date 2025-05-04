/**
 * CyberSafe - Main Application Controller
 * Handles core functionality, UI interactions, and event delegation
 */

class CyberSafeApp {
  constructor() {
    this.init();
    this.registerServiceWorker();
    this.setupIntersectionObserver();
    this.handleScrollEvents();
  }

  init() {
    // DOM Elements
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

    // State
    this.state = {
      currentUser: null,
      darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      scrollPosition: 0,
      serviceWorkerRegistered: false
    };

    // Event Listeners
    this.addEventListeners();
    this.initializeAnimations();
  }

  addEventListeners() {
    // Modal Interactions
    this.dom.loginBtn?.addEventListener('click', () => this.toggleModal('login'));
    this.dom.registerBtn?.addEventListener('click', () => this.toggleModal('register'));
    this.dom.closeModal?.addEventListener('click', () => this.toggleModal());
    window.addEventListener('click', (e) => {
      if (e.target === this.dom.authModal) this.toggleModal();
    });

    // Tab Switching
    this.dom.tabBtns?.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        this.switchTab(tabName);
      });
    });

    // Smooth Scrolling
    this.dom.navLinks?.forEach(link => {
      link.addEventListener('click', this.smoothScroll.bind(this));
    });

    // Dark Mode Toggle
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      this.state.darkMode = e.matches;
      this.toggleDarkModeClasses();
    });

    // Performance Tracking
    window.addEventListener('load', this.trackPerformance.bind(this));
  }

  toggleModal(action = null) {
    if (!this.dom.authModal) return;

    if (action === null) {
      // Toggle modal visibility
      this.dom.authModal.style.display = 
        this.dom.authModal.style.display === 'block' ? 'none' : 'block';
    } else {
      // Show modal with specific tab
      this.dom.authModal.style.display = 'block';
      this.switchTab(action);
    }

    // Accessibility focus management
    if (this.dom.authModal.style.display === 'block') {
      this.dom.authModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      this.dom.authModal.querySelector('button').focus();
    } else {
      this.dom.authModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  switchTab(tabName) {
    // Update active tab button
    this.dom.tabBtns?.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });
    
    // Update active form
    this.dom.authForms?.forEach(form => {
      form.classList.toggle('active', form.id === tabName);
    });

    // Track analytics event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'tab_switch', {
        'event_category': 'engagement',
        'event_label': tabName
      });
    }
  }

  smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#' || !targetId.startsWith('#')) return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });

      // Update URL without page reload
      history.pushState(null, null, targetId);
    }
  }

  handleScrollEvents() {
    let lastScroll = 0;
    const scrollThreshold = 100;
    const header = this.dom.header;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      // Header scroll effects
      if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    });
  }

  initializeAnimations() {
    const animateOnScroll = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(animateOnScroll, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    document.querySelectorAll('.feature-card, .scanner-container').forEach(el => {
      observer.observe(el);
    });
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            this.state.serviceWorkerRegistered = true;
            console.log('ServiceWorker registration successful');
          })
          .catch(err => {
            console.log('ServiceWorker registration failed: ', err);
          });
      });
    }
  }

  trackPerformance() {
    if (window.performance) {
      const [navigation] = performance.getEntriesByType("navigation");
      const data = {
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        connect: navigation.connectEnd - navigation.connectStart,
        ttfb: navigation.responseStart - navigation.requestStart,
        load: navigation.loadEventEnd - navigation.loadEventStart,
        total: navigation.loadEventEnd - navigation.startTime
      };

      // Send to analytics or store in IndexedDB
      console.log('Performance metrics:', data);
    }
  }

  toggleDarkModeClasses() {
    document.body.classList.toggle('dark-mode', this.state.darkMode);
  }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  const app = new CyberSafeApp();
  
  // Make available globally for debugging
  window.CyberSafeApp = app;
});
