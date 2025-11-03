// Shared Sidebar JavaScript
class SidebarManager {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.sidebarToggle = document.getElementById('sidebarToggle');
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.currentPage = this.getCurrentPage();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setActiveMenuItem();
        this.handleResponsive();
    }

    setupEventListeners() {
        // Sidebar toggle
        if (this.sidebarToggle) {
            this.sidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        // Mobile menu toggle
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                const section = link.getAttribute('data-section');
                
                // Check if it's an external link (like categories.html, files.html)
                if (href && href.includes('.html')) {
                    // Let the browser handle the navigation
                    return;
                }
                
                // Handle internal sections
                if (section) {
                    e.preventDefault();
                    this.showSection(section);
                }
            });
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!this.sidebar.contains(e.target) && !e.target.closest('.mobile-menu-toggle')) {
                    this.closeSidebar();
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResponsive();
        });
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('collapsed');
        this.updateToggleIcon();
    }

    closeSidebar() {
        this.sidebar.classList.remove('collapsed');
        this.updateToggleIcon();
    }

    updateToggleIcon() {
        if (this.sidebarToggle) {
            const icon = this.sidebarToggle.querySelector('i');
            if (this.sidebar.classList.contains('collapsed')) {
                icon.className = 'fas fa-bars';
            } else {
                icon.className = 'fas fa-times';
            }
        }
    }

    handleResponsive() {
        if (!this.sidebar) {
            console.warn('Sidebar element not found');
            return;
        }
        
        if (window.innerWidth <= 768) {
            this.sidebar.classList.add('mobile');
            this.sidebar.classList.add('collapsed');
        } else {
            this.sidebar.classList.remove('mobile');
            this.sidebar.classList.remove('collapsed');
        }
    }

    setActiveMenuItem() {
        // Remove active class from all items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to current page
        const currentLink = document.querySelector(`a[href*="${this.currentPage}"]`);
        if (currentLink) {
            currentLink.closest('.nav-item').classList.add('active');
        }
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        if (filename === 'index.html' || filename === '' || filename === 'admin-panel/') {
            return 'index.html';
        }
        
        return filename;
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update page title
        this.updatePageTitle(sectionId);

        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 768) {
            this.closeSidebar();
        }
    }

    updatePageTitle(sectionId) {
        const titles = {
            'dashboard': 'داشبورد',
            'tenants': 'مدیریت مستاجرین',
            'stores': 'مدیریت فروشگاه‌ها',
            'products': 'مدیریت محصولات',
            'users': 'مدیریت کاربران',
            'settings': 'تنظیمات'
        };

        const title = titles[sectionId] || 'پنل مدیریت';
        const pageTitle = document.querySelector('.page-title');
        if (pageTitle) {
            pageTitle.textContent = title;
        }
    }
}

// Initialize sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new SidebarManager();
});
