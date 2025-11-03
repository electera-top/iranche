// Load Sidebar Component
class SidebarLoader {
    constructor() {
        this.sidebarContainer = document.getElementById('sidebar-container');
        this.init();
    }

    init() {
        if (this.sidebarContainer) {
            this.createSidebar();
        }
    }

    createSidebar() {
        if (this.sidebarContainer) {
            const sidebarHTML = `
                <aside class="sidebar" id="sidebar">
                    <div class="sidebar-header">
                        <div class="logo">
                            <i class="fas fa-store"></i>
                            <span>ایرانچه</span>
                        </div>
                        <button class="sidebar-toggle" id="sidebarToggle">
                            <i class="fas fa-bars"></i>
                        </button>
                    </div>
                    
                    <nav class="sidebar-nav">
                        <ul class="nav-list">
                            <li class="nav-item">
                                <a href="index.html" class="nav-link">
                                    <i class="fas fa-tachometer-alt"></i>
                                    <span>داشبورد</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="index.html#tenants" class="nav-link">
                                    <i class="fas fa-building"></i>
                                    <span>مدیریت مستاجرین</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="index.html#floors" class="nav-link">
                                    <i class="fas fa-layer-group"></i>
                                    <span>مدیریت طبقات</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="tenants.html" class="nav-link">
                                    <i class="fas fa-store"></i>
                                    <span>مدیریت فروشگاه‌ها</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="plans.html" class="nav-link">
                                    <i class="fas fa-tag"></i>
                                    <span>مدیریت پلن‌ها</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="categories.html" class="nav-link">
                                    <i class="fas fa-tags"></i>
                                    <span>دسته‌بندی فروشگاه‌ها</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="files.html" class="nav-link">
                                    <i class="fas fa-folder"></i>
                                    <span>مدیریت فایل‌ها</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="themes.html" class="nav-link">
                                    <i class="fas fa-palette"></i>
                                    <span>مدیریت قالب‌ها</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="plugins.html" class="nav-link">
                                    <i class="fas fa-plug"></i>
                                    <span>مدیریت افزونه‌ها</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="index.html#products" class="nav-link">
                                    <i class="fas fa-box"></i>
                                    <span>مدیریت محصولات</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="users.html" class="nav-link">
                                    <i class="fas fa-users"></i>
                                    <span>مدیریت کاربران</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="staff.html" class="nav-link">
                                    <i class="fas fa-users-gear"></i>
                                    <span>کارمندان</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="index.html#orders" class="nav-link">
                                    <i class="fas fa-shopping-cart"></i>
                                    <span>مدیریت سفارشات</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="index.html#analytics" class="nav-link">
                                    <i class="fas fa-chart-bar"></i>
                                    <span>آمار و گزارشات</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="index.html#content" class="nav-link">
                                    <i class="fas fa-edit"></i>
                                    <span>مدیریت محتوا</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="index.html#settings" class="nav-link">
                                    <i class="fas fa-cog"></i>
                                    <span>تنظیمات</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </aside>
            `;
            
            this.sidebarContainer.innerHTML = sidebarHTML;
            
            // Set active state based on current page
            this.setActiveMenuItem();
            
                // Initialize sidebar after loading
                if (typeof SidebarManager !== 'undefined') {
                    // Wait a bit for DOM to be ready
                    setTimeout(() => {
                        new SidebarManager();
                    }, 100);
                }
        }
    }

    setActiveMenuItem() {
        const currentPage = this.getCurrentPage();
        
        // Remove active class from all items
        const navItems = this.sidebarContainer.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to current page
        const currentLink = this.sidebarContainer.querySelector(`a[href*="${currentPage}"]`);
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
}

// Initialize sidebar loader when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new SidebarLoader();
});
