// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.apiBaseUrl = 'http://localhost:8000/api';
        this.productApiUrl = 'http://localhost:8000/api';
        this.contentApiUrl = 'http://localhost:8000/api';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        this.loadInitialData();
    }

    setupEventListeners() {
        // Sidebar navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // Sidebar toggle
        document.getElementById('sidebarToggle').addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Mobile menu toggle
        document.getElementById('mobileMenuToggle').addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Global search
        document.getElementById('globalSearch').addEventListener('input', (e) => {
            this.handleGlobalSearch(e.target.value);
        });

        // Order filter buttons
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterOrders(e.target.getAttribute('data-filter'));
            });
        });

        // Content tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.getAttribute('data-tab'));
            });
        });

        // Modal close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
        });

        // Settings form submission
        document.querySelectorAll('.settings-form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSettingsSubmit(form);
            });
        });
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        document.getElementById(sectionName).classList.add('active');

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update page title
        const titles = {
            dashboard: 'داشبورد',
            tenants: 'مدیریت مستاجرین',
            floors: 'مدیریت طبقات',
            stores: 'مدیریت فروشگاه‌ها',
            products: 'مدیریت محصولات',
            users: 'مدیریت کاربران',
            orders: 'مدیریت سفارشات',
            analytics: 'آمار و گزارشات',
            content: 'مدیریت محتوا',
            settings: 'تنظیمات'
        };
        document.getElementById('pageTitle').textContent = titles[sectionName];

        // Load section data
        this.loadSectionData(sectionName);
    }

    toggleSidebar() {
        document.querySelector('.sidebar').classList.toggle('collapsed');
    }

    toggleMobileMenu() {
        document.querySelector('.sidebar').classList.toggle('active');
    }

    async loadSectionData(sectionName) {
        switch (sectionName) {
            case 'dashboard':
                await this.loadDashboardData();
                break;
            case 'tenants':
                await this.loadTenantsData();
                break;
            case 'floors':
                await this.loadFloorsData();
                break;
            case 'stores':
                await this.loadStoresData();
                break;
            case 'products':
                await this.loadProductsData();
                break;
            case 'users':
                await this.loadUsersData();
                break;
            case 'orders':
                await this.loadOrdersData();
                break;
            case 'analytics':
                await this.loadAnalyticsData();
                break;
            case 'content':
                await this.loadContentData();
                break;
        }
    }

    async loadInitialData() {
        try {
            // Load basic statistics
            const stats = await this.fetchData(`${this.apiBaseUrl}/stats`);
            this.updateStats(stats);
        } catch (error) {
            console.error('Error loading initial data:', error);
            this.showError('خطا در بارگذاری داده‌ها');
        }
    }

    async loadDashboardData() {
        this.showLoading();
        try {
            const [stats, activities] = await Promise.all([
                this.fetchData(`${this.apiBaseUrl}/stats`),
                this.fetchData(`${this.apiBaseUrl}/recent-activities`)
            ]);

            this.updateStats(stats);
            this.updateRecentActivities(activities);
            this.initCharts();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showError('خطا در بارگذاری داشبورد');
        } finally {
            this.hideLoading();
        }
    }

    async loadTenantsData() {
        this.showLoading();
        try {
            const tenants = await this.fetchData(`${this.apiBaseUrl}/tenants`);
            this.updateTenantsTable(tenants);
        } catch (error) {
            console.error('Error loading tenants data:', error);
            this.showError('خطا در بارگذاری مستاجرین');
        } finally {
            this.hideLoading();
        }
    }

    async loadFloorsData() {
        this.showLoading();
        try {
            const floors = await this.fetchData(`${this.apiBaseUrl}/floors`);
            this.updateFloorsGrid(floors);
        } catch (error) {
            console.error('Error loading floors data:', error);
            this.showError('خطا در بارگذاری طبقات');
        } finally {
            this.hideLoading();
        }
    }

    async loadStoresData() {
        this.showLoading();
        try {
            const stores = await this.fetchData(`${this.apiBaseUrl}/stores`);
            this.updateStoresTable(stores);
        } catch (error) {
            console.error('Error loading stores data:', error);
            this.showError('خطا در بارگذاری فروشگاه‌ها');
        } finally {
            this.hideLoading();
        }
    }

    async loadProductsData() {
        this.showLoading();
        try {
            const products = await this.fetchData(`${this.apiBaseUrl}/products`);
            this.updateProductsTable(products);
        } catch (error) {
            console.error('Error loading products data:', error);
            this.showError('خطا در بارگذاری محصولات');
        } finally {
            this.hideLoading();
        }
    }

    async loadUsersData() {
        this.showLoading();
        try {
            const users = await this.fetchData(`${this.apiBaseUrl}/users`);
            this.updateUsersTable(users);
        } catch (error) {
            console.error('Error loading users data:', error);
            this.showError('خطا در بارگذاری کاربران');
        } finally {
            this.hideLoading();
        }
    }

    async loadOrdersData() {
        this.showLoading();
        try {
            const orders = await this.fetchData(`${this.apiBaseUrl}/orders`);
            this.updateOrdersTable(orders);
        } catch (error) {
            console.error('Error loading orders data:', error);
            this.showError('خطا در بارگذاری سفارشات');
        } finally {
            this.hideLoading();
        }
    }

    async loadAnalyticsData() {
        this.showLoading();
        try {
            const analytics = await this.fetchData(`${this.apiBaseUrl}/analytics`);
            this.updateAnalyticsCharts(analytics);
        } catch (error) {
            console.error('Error loading analytics data:', error);
            this.showError('خطا در بارگذاری آمار');
        } finally {
            this.hideLoading();
        }
    }

    async loadContentData() {
        this.showLoading();
        try {
            const content = await this.fetchData(`${this.apiBaseUrl}/content`);
            this.updateContentData(content);
        } catch (error) {
            console.error('Error loading content data:', error);
            this.showError('خطا در بارگذاری محتوا');
        } finally {
            this.hideLoading();
        }
    }

    async fetchData(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    updateStats(stats) {
        if (stats) {
            document.getElementById('totalTenants').textContent = stats.tenants || 0;
            document.getElementById('activeStores').textContent = stats.stores || 0;
            document.getElementById('totalProducts').textContent = stats.products || 0;
            document.getElementById('activeUsers').textContent = stats.users || 0;
        }
    }

    updateRecentActivities(activities) {
        const container = document.getElementById('recentActivities');
        if (!activities || !Array.isArray(activities)) {
            container.innerHTML = '<p class="text-center text-gray-400">هیچ فعالیتی یافت نشد</p>';
            return;
        }

        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas ${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description} - ${activity.time}</p>
                </div>
            </div>
        `).join('');
    }

    getActivityIcon(type) {
        const icons = {
            'tenant': 'fa-building',
            'store': 'fa-store',
            'product': 'fa-box',
            'order': 'fa-shopping-cart',
            'user': 'fa-user',
            'system': 'fa-cog'
        };
        return icons[type] || 'fa-info-circle';
    }

    updateTenantsTable(tenants) {
        const tbody = document.getElementById('tenantsTableBody');
        if (!tenants || !Array.isArray(tenants)) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">هیچ مستاجری یافت نشد</td></tr>';
            return;
        }

        tbody.innerHTML = tenants.map(tenant => `
            <tr>
                <td>${tenant.name}</td>
                <td>${tenant.domain}</td>
                <td><span class="status-badge ${tenant.status === 'active' ? 'status-active' : 'status-inactive'}">${tenant.status === 'active' ? 'فعال' : 'غیرفعال'}</span></td>
                <td>${this.formatDate(tenant.createdAt)}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="editTenant('${tenant.id}')">ویرایش</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTenant('${tenant.id}')">حذف</button>
                </td>
            </tr>
        `).join('');
    }

    updateFloorsGrid(floors) {
        const container = document.getElementById('floorsGrid');
        if (!floors || !Array.isArray(floors)) {
            container.innerHTML = '<p class="text-center text-gray-400">هیچ طبقه‌ای یافت نشد</p>';
            return;
        }

        container.innerHTML = floors.map(floor => `
            <div class="floor-card">
                <div class="floor-header">
                    <h3 class="floor-title">${floor.title}</h3>
                    ${floor.isVIP ? '<span class="floor-vip">VIP</span>' : ''}
                </div>
                <p class="floor-description">${floor.description}</p>
                <div class="floor-stats">
                    <span class="floor-store-count">${floor.storeCount} فروشگاه</span>
                    <div class="floor-actions">
                        <button class="btn btn-sm btn-secondary" onclick="editFloor('${floor.id}')">ویرایش</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteFloor('${floor.id}')">حذف</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateStoresTable(stores) {
        const tbody = document.getElementById('storesTableBody');
        if (!stores || !Array.isArray(stores)) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">هیچ فروشگاهی یافت نشد</td></tr>';
            return;
        }

        tbody.innerHTML = stores.map(store => `
            <tr>
                <td>${store.name}</td>
                <td>${store.floor}</td>
                <td><span class="status-badge ${store.status === 'active' ? 'status-active' : 'status-inactive'}">${store.status === 'active' ? 'فعال' : 'غیرفعال'}</span></td>
                <td>${store.rating}/5</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="editStore('${store.id}')">ویرایش</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteStore('${store.id}')">حذف</button>
                </td>
            </tr>
        `).join('');
    }

    updateProductsTable(products) {
        const tbody = document.getElementById('productsTableBody');
        if (!products || !Array.isArray(products)) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">هیچ محصولی یافت نشد</td></tr>';
            return;
        }

        tbody.innerHTML = products.map(product => `
            <tr>
                <td>${product.name}</td>
                <td>${product.store}</td>
                <td>${this.formatPrice(product.price)}</td>
                <td><span class="status-badge ${product.stock > 0 ? 'status-active' : 'status-inactive'}">${product.stock > 0 ? 'موجود' : 'ناموجود'}</span></td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="editProduct('${product.id}')">ویرایش</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product.id}')">حذف</button>
                </td>
            </tr>
        `).join('');
    }

    updateUsersTable(users) {
        const tbody = document.getElementById('usersTableBody');
        if (!users || !Array.isArray(users)) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">هیچ کاربری یافت نشد</td></tr>';
            return;
        }

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td><span class="status-badge ${user.status === 'active' ? 'status-active' : 'status-inactive'}">${user.status === 'active' ? 'فعال' : 'غیرفعال'}</span></td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="editUser('${user.id}')">ویرایش</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')">حذف</button>
                </td>
            </tr>
        `).join('');
    }

    updateOrdersTable(orders) {
        const tbody = document.getElementById('ordersTableBody');
        if (!orders || !Array.isArray(orders)) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">هیچ سفارشی یافت نشد</td></tr>';
            return;
        }

        tbody.innerHTML = orders.map(order => `
            <tr>
                <td>#${order.id}</td>
                <td>${order.customer}</td>
                <td>${this.formatPrice(order.total)}</td>
                <td><span class="status-badge ${this.getOrderStatusClass(order.status)}">${this.getOrderStatusText(order.status)}</span></td>
                <td>${this.formatDate(order.createdAt)}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="viewOrder('${order.id}')">مشاهده</button>
                    <button class="btn btn-sm btn-primary" onclick="updateOrderStatus('${order.id}')">تغییر وضعیت</button>
                </td>
            </tr>
        `).join('');
    }

    getOrderStatusClass(status) {
        const classes = {
            'pending': 'status-pending',
            'processing': 'status-pending',
            'completed': 'status-active',
            'cancelled': 'status-inactive'
        };
        return classes[status] || 'status-pending';
    }

    getOrderStatusText(status) {
        const texts = {
            'pending': 'در انتظار',
            'processing': 'در حال پردازش',
            'completed': 'تکمیل شده',
            'cancelled': 'لغو شده'
        };
        return texts[status] || 'نامشخص';
    }

    updateAnalyticsCharts(analytics) {
        // Initialize charts with analytics data
        this.initCharts(analytics);
    }

    updateContentData(content) {
        // Update content management data
        console.log('Content data updated:', content);
    }

    initCharts(data = null) {
        // Initialize Chart.js charts
        const ctx1 = document.getElementById('salesChart');
        const ctx2 = document.getElementById('dailySalesChart');
        const ctx3 = document.getElementById('popularProductsChart');
        const ctx4 = document.getElementById('usersChart');
        const ctx5 = document.getElementById('floorsSalesChart');

        // Sample chart data
        const sampleData = {
            sales: [120, 190, 300, 500, 200, 300, 450],
            products: ['محصول 1', 'محصول 2', 'محصول 3', 'محصول 4', 'محصول 5'],
            users: [100, 150, 200, 180, 220, 250, 300],
            floors: ['طبقه 1', 'طبقه 2', 'طبقه 3', 'طبقه 4', 'طبقه 5']
        };

        // Create charts (simplified version without Chart.js)
        this.createSimpleChart(ctx1, sampleData.sales, 'فروش ماهانه');
        this.createSimpleChart(ctx2, sampleData.sales, 'فروش روزانه');
        this.createSimpleChart(ctx3, [30, 25, 20, 15, 10], 'محبوب‌ترین محصولات');
        this.createSimpleChart(ctx4, sampleData.users, 'آمار کاربران');
        this.createSimpleChart(ctx5, [40, 35, 30, 25, 20], 'فروش بر اساس طبقه');
    }

    createSimpleChart(canvas, data, title) {
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw simple bar chart
        const barWidth = width / data.length;
        const maxValue = Math.max(...data);
        
        data.forEach((value, index) => {
            const barHeight = (value / maxValue) * (height - 40);
            const x = index * barWidth;
            const y = height - barHeight - 20;
            
            ctx.fillStyle = '#ffd700';
            ctx.fillRect(x + 10, y, barWidth - 20, barHeight);
        });
        
        // Draw title
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Vazirmatn';
        ctx.textAlign = 'center';
        ctx.fillText(title, width / 2, 15);
    }

    filterOrders(filter) {
        // Update filter buttons
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        // Filter orders (simplified)
        console.log('Filtering orders by:', filter);
        // In real implementation, this would filter the orders table
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Show tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
    }

    handleGlobalSearch(query) {
        console.log('Global search:', query);
        // Implement global search functionality
    }

    handleSettingsSubmit(form) {
        const formData = new FormData(form);
        console.log('Settings form submitted:', formData);
        // Implement settings save functionality
    }

    showModal(title, content) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = content;
        document.getElementById('modalOverlay').classList.add('active');
    }

    closeModal() {
        document.getElementById('modalOverlay').classList.remove('active');
    }

    showLoading() {
        document.getElementById('loadingOverlay').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('active');
    }

    showError(message) {
        // Simple error notification
        alert(message);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fa-IR');
    }

    formatPrice(price) {
        return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
    }
}

// Global functions for modal operations
function showAddTenantModal() {
    const content = `
        <form id="addTenantForm">
            <div class="form-group">
                <label>نام مستاجر</label>
                <input type="text" name="name" required>
            </div>
            <div class="form-group">
                <label>دامنه</label>
                <input type="text" name="domain" required>
            </div>
            <div class="form-group">
                <label>ایمیل</label>
                <input type="email" name="email" required>
            </div>
            <div class="form-group">
                <label>رمز عبور</label>
                <input type="password" name="password" required>
            </div>
            <button type="submit" class="btn btn-primary">افزودن مستاجر</button>
        </form>
    `;
    adminPanel.showModal('افزودن مستاجر جدید', content);
}

function showAddFloorModal() {
    const content = `
        <form id="addFloorForm">
            <div class="form-group">
                <label>عنوان طبقه</label>
                <input type="text" name="title" required>
            </div>
            <div class="form-group">
                <label>توضیحات</label>
                <textarea name="description" required></textarea>
            </div>
            <div class="form-group">
                <label>رنگ</label>
                <select name="color" required>
                    <option value="blue">آبی</option>
                    <option value="green">سبز</option>
                    <option value="red">قرمز</option>
                    <option value="yellow">زرد</option>
                    <option value="purple">بنفش</option>
                </select>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" name="isVIP"> طبقه VIP
                </label>
            </div>
            <button type="submit" class="btn btn-primary">افزودن طبقه</button>
        </form>
    `;
    adminPanel.showModal('افزودن طبقه جدید', content);
}

function showAddStoreModal() {
    const content = `
        <form id="addStoreForm">
            <div class="form-group">
                <label>نام فروشگاه</label>
                <input type="text" name="name" required>
            </div>
            <div class="form-group">
                <label>طبقه</label>
                <select name="floor" required>
                    <option value="1">طبقه 1</option>
                    <option value="2">طبقه 2</option>
                    <option value="3">طبقه 3</option>
                </select>
            </div>
            <div class="form-group">
                <label>توضیحات</label>
                <textarea name="description"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">افزودن فروشگاه</button>
        </form>
    `;
    adminPanel.showModal('افزودن فروشگاه جدید', content);
}

function showAddProductModal() {
    const content = `
        <form id="addProductForm">
            <div class="form-group">
                <label>نام محصول</label>
                <input type="text" name="name" required>
            </div>
            <div class="form-group">
                <label>فروشگاه</label>
                <select name="store" required>
                    <option value="1">فروشگاه 1</option>
                    <option value="2">فروشگاه 2</option>
                </select>
            </div>
            <div class="form-group">
                <label>قیمت</label>
                <input type="number" name="price" required>
            </div>
            <div class="form-group">
                <label>موجودی</label>
                <input type="number" name="stock" required>
            </div>
            <button type="submit" class="btn btn-primary">افزودن محصول</button>
        </form>
    `;
    adminPanel.showModal('افزودن محصول جدید', content);
}

function showAddUserModal() {
    const content = `
        <form id="addUserForm">
            <div class="form-group">
                <label>نام کاربری</label>
                <input type="text" name="username" required>
            </div>
            <div class="form-group">
                <label>ایمیل</label>
                <input type="email" name="email" required>
            </div>
            <div class="form-group">
                <label>نقش</label>
                <select name="role" required>
                    <option value="user">کاربر</option>
                    <option value="admin">مدیر</option>
                    <option value="moderator">ناظر</option>
                </select>
            </div>
            <div class="form-group">
                <label>رمز عبور</label>
                <input type="password" name="password" required>
            </div>
            <button type="submit" class="btn btn-primary">افزودن کاربر</button>
        </form>
    `;
    adminPanel.showModal('افزودن کاربر جدید', content);
}

function showAddContentModal() {
    const content = `
        <form id="addContentForm">
            <div class="form-group">
                <label>عنوان</label>
                <input type="text" name="title" required>
            </div>
            <div class="form-group">
                <label>نوع محتوا</label>
                <select name="type" required>
                    <option value="banner">بنر</option>
                    <option value="page">صفحه</option>
                    <option value="notification">اطلاعیه</option>
                </select>
            </div>
            <div class="form-group">
                <label>محتوا</label>
                <textarea name="content" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">افزودن محتوا</button>
        </form>
    `;
    adminPanel.showModal('افزودن محتوا جدید', content);
}

function closeModal() {
    adminPanel.closeModal();
}

// CRUD operations
function editTenant(id) {
    console.log('Edit tenant:', id);
    // Implement edit functionality
}

function deleteTenant(id) {
    if (confirm('آیا از حذف این مستاجر اطمینان دارید؟')) {
        console.log('Delete tenant:', id);
        // Implement delete functionality
    }
}

function editFloor(id) {
    console.log('Edit floor:', id);
    // Implement edit functionality
}

function deleteFloor(id) {
    if (confirm('آیا از حذف این طبقه اطمینان دارید؟')) {
        console.log('Delete floor:', id);
        // Implement delete functionality
    }
}

function editStore(id) {
    console.log('Edit store:', id);
    // Implement edit functionality
}

function deleteStore(id) {
    if (confirm('آیا از حذف این فروشگاه اطمینان دارید؟')) {
        console.log('Delete store:', id);
        // Implement delete functionality
    }
}

function editProduct(id) {
    console.log('Edit product:', id);
    // Implement edit functionality
}

function deleteProduct(id) {
    if (confirm('آیا از حذف این محصول اطمینان دارید؟')) {
        console.log('Delete product:', id);
        // Implement delete functionality
    }
}

function editUser(id) {
    console.log('Edit user:', id);
    // Implement edit functionality
}

function deleteUser(id) {
    if (confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
        console.log('Delete user:', id);
        // Implement delete functionality
    }
}

function viewOrder(id) {
    console.log('View order:', id);
    // Implement view order functionality
}

function updateOrderStatus(id) {
    console.log('Update order status:', id);
    // Implement update order status functionality
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});
