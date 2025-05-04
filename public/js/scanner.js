/**
 * CyberSafe Security Scanner Module
 * Simulates comprehensive device security scanning with detailed reporting
 */

class SecurityScanner {
  constructor() {
    this.init();
    this.threatDatabase = this.loadThreatDatabase();
  }

  init() {
    // DOM Elements
    this.dom = {
      startScan: document.getElementById('startScan'),
      scanResults: document.getElementById('scanResults'),
      progressBar: document.querySelector('.progress-bar')
    };

    // Scan State
    this.state = {
      isScanning: false,
      scanProgress: 0,
      currentScanId: null,
      threatResults: []
    };

    // Event Listeners
    this.addEventListeners();

    // Initialize threat database
    this.initializeThreatDatabase();
  }

  addEventListeners() {
    this.dom.startScan?.addEventListener('click', this.startScan.bind(this));
  }

  initializeThreatDatabase() {
    this.threatDatabase = {
      os: {
        title: "Operating System",
        checks: [
          {
            id: "os-001",
            name: "Outdated OS Version",
            description: "Your operating system might be missing critical security updates",
            severity: "high",
            detection: () => Math.random() < 0.3
          },
          {
            id: "os-002",
            name: "Unsupported OS",
            description: "Your OS version is no longer receiving security patches",
            severity: "critical",
            detection: () => Math.random() < 0.1
          }
        ]
      },
      browser: {
        title: "Browser Security",
        checks: [
          {
            id: "br-001",
            name: "Weak Privacy Settings",
            description: "Your browser privacy settings may expose you to tracking",
            severity: "medium",
            detection: () => Math.random() < 0.7
          },
          {
            id: "br-002",
            name: "Outdated Browser",
            description: "Using an outdated browser version with known vulnerabilities",
            severity: "high",
            detection: () => Math.random() < 0.4
          }
        ]
      },
      network: {
        title: "Network Security",
        checks: [
          {
            id: "nw-001",
            name: "Unsecured WiFi",
            description: "You might be connected to an unsecured network",
            severity: "high",
            detection: () => Math.random() < 0.5
          },
          {
            id: "nw-002",
            name: "DNS Leak Potential",
            description: "Your DNS queries might be exposed",
            severity: "medium",
            detection: () => Math.random() < 0.2
          }
        ]
      },
      privacy: {
        title: "Privacy Settings",
        checks: [
          {
            id: "pr-001",
            name: "Location Services Enabled",
            description: "Your device may be sharing location data with websites",
            severity: "low",
            detection: () => Math.random() < 0.8
          },
          {
            id: "pr-002",
            name: "Camera/Microphone Access",
            description: "Multiple websites have permission to access your camera/microphone",
            severity: "medium",
            detection: () => Math.random() < 0.3
          }
        ]
      }
    };
  }

  async startScan() {
    if (this.state.isScanning) return;

    // Reset state
    this.state = {
      isScanning: true,
      scanProgress: 0,
      currentScanId: 'scan-' + Date.now(),
      threatResults: []
    };

    // UI Updates
    this.updateScanUI();
    this.dom.startScan.disabled = true;
    this.dom.startScan.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scanning...';
    this.dom.scanResults.innerHTML = `
      <div class="scan-status">
        <h3><i class="fas fa-shield-alt"></i> CyberSafe Security Scan</h3>
        <p>Scan ID: ${this.state.currentScanId}</p>
        <p>Started: ${new Date().toLocaleString()}</p>
      </div>
      <div class="scan-progress-details">
        <p>Initializing scan modules...</p>
      </div>
    `;

    // Simulate scan process
    try {
      await this.runScanChecks();
      this.completeScan();
    } catch (error) {
      this.scanError(error);
    }
  }

  async runScanChecks() {
    // Simulate scan initialization
    await this.updateProgress(10, "Loading threat database...");
    
    // Run each scan module
    const modules = Object.keys(this.threatDatabase);
    for (const module of modules) {
      await this.scanModule(module);
    }
    
    // Finalize scan
    await this.updateProgress(100, "Compiling final report...");
  }

  async scanModule(moduleName) {
    const module = this.threatDatabase[moduleName];
    await this.updateProgress(
      this.state.scanProgress + 5,
      `Scanning ${module.title.toLowerCase()}...`
    );

    // Run each check in the module
    for (const check of module.checks) {
      if (!this.state.isScanning) break; // Allow cancellation
      
      // Simulate check execution
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
      
      // Run detection
      const isDetected = check.detection();
      if (isDetected) {
        this.state.threatResults.push({
          module: moduleName,
          ...check
        });
      }
      
      // Update progress
      const increment = 70 / (modules.length * module.checks.length);
      await this.updateProgress(
        this.state.scanProgress + increment,
        `Checking ${check.name.toLowerCase()}...`
      );
    }
  }

  async updateProgress(progress, message = "") {
    progress = Math.min(100, Math.max(0, Math.round(progress)));
    this.state.scanProgress = progress;
    
    // Update progress bar
    this.dom.progressBar.style.width = `${progress}%`;
    
    // Update progress details
    const progressDetails = this.dom.scanResults.querySelector('.scan-progress-details');
    if (progressDetails && message) {
      progressDetails.innerHTML += `<p>${message}</p>`;
      progressDetails.scrollTop = progressDetails.scrollHeight;
    }
    
    // Small delay for smooth animation
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  completeScan() {
    this.state.isScanning = false;
    
    // UI Updates
    this.dom.startScan.disabled = false;
    this.dom.startScan.textContent = 'Scan Again';
    
    // Show results
    this.displayResults();
    
    // Analytics
    this.trackScanEvent('scan_completed', {
      scan_id: this.state.currentScanId,
      threats_found: this.state.threatResults.length
    });
  }

  scanError(error) {
    this.state.isScanning = false;
    
    // UI Updates
    this.dom.startScan.disabled = false;
    this.dom.startScan.textContent = 'Try Again';
    this.dom.scanResults.innerHTML = `
      <div class="scan-error">
        <h3><i class="fas fa-exclamation-triangle"></i> Scan Failed</h3>
        <p>${error.message || 'An unexpected error occurred'}</p>
        <button class="btn btn-outline" onclick="window.Scanner.startScan()">
          <i class="fas fa-redo"></i> Retry Scan
        </button>
      </div>
    `;
    
    // Analytics
    this.trackScanEvent('scan_failed', {
      scan_id: this.state.currentScanId,
      error: error.message
    });
  }

  displayResults() {
    const { threatResults } = this.state;
    const threatCount = threatResults.length;
    
    let resultsHTML = `
      <div class="scan-summary">
        <h3><i class="fas fa-clipboard-check"></i> Scan Complete</h3>
        <p>Scanned on: ${new Date().toLocaleString()}</p>
        <div class="threat-summary ${threatCount > 0 ? 'has-threats' : ''}">
          <p>Total threats detected: <strong>${threatCount}</strong></p>
          ${threatCount > 0 ? 
            '<p class="warning"><i class="fas fa-exclamation-triangle"></i> Your device may be at risk</p>' : 
            '<p class="success"><i class="fas fa-check-circle"></i> No critical threats found</p>'}
        </div>
      </div>
    `;
    
    if (threatCount > 0) {
      resultsHTML += `
        <div class="threat-list">
          <h4><i class="fas fa-bug"></i> Detected Issues</h4>
          <div class="threat-severity-key">
            <span class="critical"><i class="fas fa-circle"></i> Critical</span>
            <span class="high"><i class="fas fa-circle"></i> High</span>
            <span class="medium"><i class="fas fa-circle"></i> Medium</span>
            <span class="low"><i class="fas fa-circle"></i> Low</span>
          </div>
      `;
      
      // Group by module
      const groupedResults = {};
      threatResults.forEach(threat => {
        if (!groupedResults[threat.module]) {
          groupedResults[threat.module] = [];
        }
        groupedResults[threat.module].push(threat);
      });
      
      // Add results by module
      Object.entries(groupedResults).forEach(([module, threats]) => {
        const moduleTitle = this.threatDatabase[module].title;
        resultsHTML += `
          <div class="threat-module">
            <h5>${moduleTitle}</h5>
            <div class="threat-items">
        `;
        
        threats.forEach(threat => {
          resultsHTML += `
            <div class="threat-item ${threat.severity}">
              <div class="threat-severity">
                <i class="fas fa-${this.getSeverityIcon(threat.severity)}"></i>
                ${threat.severity.charAt(0).toUpperCase() + threat.severity.slice(1)}
              </div>
              <div class="threat-info">
                <h6>${threat.name}</h6>
                <p>${threat.description}</p>
                <div class="threat-solution">
                  <p><strong>Recommendation:</strong> ${this.getSolution(threat)}</p>
                </div>
              </div>
            </div>
          `;
        });
        
        resultsHTML += `
            </div>
          </div>
        `;
      });
      
      resultsHTML += `</div>`; // Close threat-list
    }
    
    // Add educational content
    resultsHTML += `
      <div class="scan-education">
        <h4><i class="fas fa-graduation-cap"></i> Security Best Practices</h4>
        <div class="tips-grid">
          <div class="tip-card">
            <i class="fas fa-shield-alt"></i>
            <h5>Keep Software Updated</h5>
            <p>Regularly update your OS and applications to patch security vulnerabilities.</p>
          </div>
          <div class="tip-card">
            <i class="fas fa-lock"></i>
            <h5>Use Strong Passwords</h5>
            <p>Create complex passwords and use a password manager to store them securely.</p>
          </div>
          <div class="tip-card">
            <i class="fas fa-wifi"></i>
            <h5>Secure Your Network</h5>
            <p>Use VPNs on public WiFi and ensure your home network is properly secured.</p>
          </div>
        </div>
        <div class="disclaimer">
          <p><strong>Note:</strong> This is a simulated scan for educational purposes. For real security scanning, use professional antivirus software.</p>
        </div>
      </div>
    `;
    
    this.dom.scanResults.innerHTML = resultsHTML;
  }

  getSeverityIcon(severity) {
    switch (severity) {
      case 'critical': return 'skull-crossbones';
      case 'high': return 'exclamation-triangle';
      case 'medium': return 'exclamation-circle';
      case 'low': return 'info-circle';
      default: return 'question-circle';
    }
  }

  getSolution(threat) {
    const solutions = {
      'os-001': 'Install the latest OS updates immediately from your system settings.',
      'os-002': 'Consider upgrading to a supported OS version to receive security patches.',
      'br-001': 'Adjust your browser privacy settings to limit tracking and data collection.',
      'br-002': 'Update your browser to the latest version available.',
      'nw-001': 'Avoid transmitting sensitive data on public networks. Use a VPN for added security.',
      'nw-002': 'Configure your network to use secure DNS servers like Cloudflare (1.1.1.1) or Google (8.8.8.8).',
      'pr-001': 'Review website permissions and disable location access for unnecessary sites.',
      'pr-002': 'Audit and revoke camera/microphone permissions for websites that don\'t need them.'
    };
    
    return solutions[threat.id] || 'Review your security settings and consult with IT professionals if needed.';
  }

  trackScanEvent(action, metadata = {}) {
    console.log('Scan event:', action, metadata);
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        'event_category': 'security_scan',
        ...metadata
      });
    }
  }
}

// Initialize scanner
document.addEventListener('DOMContentLoaded', () => {
  const scanner = new SecurityScanner();
  
  // Make available globally for debugging
  window.Scanner = scanner;
});
