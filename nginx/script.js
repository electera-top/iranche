// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000/api';
        this.shops = [];
        this.currentProgress = 0;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadShops();
        this.updateStats();
    }

    bindEvents() {
        // Create shop button
        document.getElementById('create-shop-btn').addEventListener('click', () => {
            this.showCreateModal();
        });

        // Modal close buttons
        document.getElementById('close-modal').addEventListener('click', () => {
            this.hideCreateModal();
        });

        document.getElementById('cancel-create').addEventListener('click', () => {
            this.hideCreateModal();
        });

        // Create shop form
        document.getElementById('create-shop-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createShop();
        });

        // Close modal on outside click
        document.getElementById('create-shop-modal').addEventListener('click', (e) => {
            if (e.target.id === 'create-shop-modal') {
                this.hideCreateModal();
            }
        });

        // Subdomain validation
        document.getElementById('subdomain').addEventListener('input', (e) => {
            this.validateSubdomain(e.target.value);
        });
    }

    showCreateModal() {
        document.getElementById('create-shop-modal').classList.remove('hidden');
        document.getElementById('shop-name').focus();
    }

    hideCreateModal() {
        document.getElementById('create-shop-modal').classList.add('hidden');
        document.getElementById('create-shop-form').reset();
        this.clearValidationErrors();
    }

    validateSubdomain(value) {
        const input = document.getElementById('subdomain');
        const isValid = /^[a-z0-9-]+$/.test(value) && value.length >= 3;
        
        if (isValid) {
            input.classList.remove('input-error');
            input.classList.add('input-success');
        } else {
            input.classList.remove('input-success');
            input.classList.add('input-error');
        }
        
        return isValid;
    }

    clearValidationErrors() {
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.classList.remove('input-error', 'input-success');
        });
    }

    async createShop() {
        const formData = new FormData(document.getElementById('create-shop-form'));
        const shopData = {
            shop_name: formData.get('shop_name'),
            subdomain: formData.get('subdomain'),
            owner_name: formData.get('owner_name'),
            owner_email: formData.get('owner_email'),
            plan_type: formData.get('plan_type')
        };

        // Validate subdomain
        if (!this.validateSubdomain(shopData.subdomain)) {
            this.showToast('زیردامنه باید حداقل 3 کاراکتر و فقط شامل حروف کوچک، اعداد و خط تیره باشد', 'error');
            return;
        }

        // Check if subdomain already exists
        if (this.shops.some(shop => shop.subdomain === shopData.subdomain)) {
            this.showToast('این زیردامنه قبلاً استفاده شده است', 'error');
            return;
        }

        this.hideCreateModal();
        this.showProgressModal();
        this.startProgressAnimation();

        try {
            const response = await fetch(`${this.apiBaseUrl}/tenants`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(shopData)
            });

            const result = await response.json();

            if (result.success) {
                this.updateProgress('فروشگاه با موفقیت ایجاد شد', 100);
                this.showToast('فروشگاه با موفقیت ایجاد شد!', 'success');
                
                // Add new shop to list
                const newShop = {
                    id: result.tenant.id,
                    shop_name: result.tenant.shop_name,
                    subdomain: result.tenant.subdomain,
                    owner_name: shopData.owner_name,
                    owner_email: result.tenant.owner_email,
                    status: 'active',
                    created_at: new Date().toISOString()
                };
                
                this.shops.unshift(newShop);
                this.renderShops();
                this.updateStats();
                
                setTimeout(() => {
                    this.hideProgressModal();
                }, 2000);
            } else {
                throw new Error(result.error || 'خطا در ایجاد فروشگاه');
            }
        } catch (error) {
            console.error('Error creating shop:', error);
            this.updateProgress('خطا در ایجاد فروشگاه: ' + error.message, 0);
            this.showToast('خطا در ایجاد فروشگاه: ' + error.message, 'error');
            
            setTimeout(() => {
                this.hideProgressModal();
            }, 3000);
        }
    }

    showProgressModal() {
        document.getElementById('progress-modal').classList.remove('hidden');
        this.updateProgress('در حال ایجاد فروشگاه...', 0);
    }

    hideProgressModal() {
        document.getElementById('progress-modal').classList.add('hidden');
        this.currentProgress = 0;
    }

    startProgressAnimation() {
        const steps = [
            'بررسی اطلاعات فروشگاه',
            'ایجاد دیتابیس',
            'ایجاد ساختار WordPress',
            'نصب WordPress',
            'تنظیم مجوزها',
            'تکمیل نصب'
        ];

        const progressSteps = document.getElementById('progress-steps');
        progressSteps.innerHTML = '';

        steps.forEach((step, index) => {
            const stepElement = document.createElement('div');
            stepElement.className = 'flex items-center space-x-2';
            stepElement.innerHTML = `
                <i class="fas fa-circle text-gray-300 text-xs"></i>
                <span class="text-gray-600">${step}</span>
            `;
            progressSteps.appendChild(stepElement);
        });

        // Simulate progress
        let currentStep = 0;
        const progressInterval = setInterval(() => {
            if (this.currentProgress >= 100) {
                clearInterval(progressInterval);
                return;
            }

            currentStep = Math.floor((this.currentProgress / 100) * steps.length);
            this.updateProgressSteps(currentStep);
            this.currentProgress += 10;
        }, 500);
    }

    updateProgressSteps(currentStep) {
        const stepElements = document.querySelectorAll('#progress-steps .flex');
        stepElements.forEach((element, index) => {
            const icon = element.querySelector('i');
            const text = element.querySelector('span');
            
            if (index < currentStep) {
                icon.className = 'fas fa-check-circle text-green-500 text-xs';
                text.className = 'text-green-600';
            } else if (index === currentStep) {
                icon.className = 'fas fa-spinner fa-spin text-blue-500 text-xs';
                text.className = 'text-blue-600';
            } else {
                icon.className = 'fas fa-circle text-gray-300 text-xs';
                text.className = 'text-gray-600';
            }
        });
    }

    updateProgress(text, percentage) {
        document.getElementById('progress-text').textContent = text;
        document.getElementById('progress-bar').style.width = percentage + '%';
        this.currentProgress = percentage;
    }

    async loadShops() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/tenants`);
            const result = await response.json();

            if (result.success) {
                this.shops = result.tenants || [];
                this.renderShops();
                this.updateStats();
            } else {
                console.error('Error loading shops:', result.error);
            }
        } catch (error) {
            console.error('Error loading shops:', error);
            this.showToast('خطا در بارگذاری فروشگاه‌ها', 'error');
        }
    }

    renderShops() {
        const tbody = document.getElementById('shops-table-body');
        tbody.innerHTML = '';

        if (this.shops.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                        هیچ فروشگاهی یافت نشد
                    </td>
                </tr>
            `;
            return;
        }

        this.shops.forEach(shop => {
            const row = document.createElement('tr');
            row.className = 'table-row-hover';
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <i class="fas fa-store text-blue-600"></i>
                            </div>
                        </div>
                        <div class="mr-4">
                            <div class="text-sm font-medium text-gray-900">${shop.shop_name}</div>
                            <div class="text-sm text-gray-500">ID: ${shop.id}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${shop.subdomain}</div>
                    <div class="text-sm text-gray-500">${shop.subdomain}.localhost</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${shop.owner_name}</div>
                    <div class="text-sm text-gray-500">${shop.owner_email}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="status-badge status-${shop.status}">
                        ${this.getStatusText(shop.status)}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                        <button onclick="dashboard.openShop('${shop.subdomain}')" 
                                class="text-blue-600 hover:text-blue-900 btn-hover">
                            <i class="fas fa-external-link-alt ml-1"></i>
                            باز کردن
                        </button>
                        <button onclick="dashboard.openAdmin('${shop.subdomain}')" 
                                class="text-green-600 hover:text-green-900 btn-hover">
                            <i class="fas fa-cog ml-1"></i>
                            مدیریت
                        </button>
                        <button onclick="dashboard.deleteShop('${shop.id}')" 
                                class="text-red-600 hover:text-red-900 btn-hover">
                            <i class="fas fa-trash ml-1"></i>
                            حذف
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    getStatusText(status) {
        const statusMap = {
            'active': 'فعال',
            'installing': 'در حال نصب',
            'error': 'خطا',
            'inactive': 'غیرفعال'
        };
        return statusMap[status] || status;
    }

    updateStats() {
        const total = this.shops.length;
        const active = this.shops.filter(shop => shop.status === 'active').length;
        const installing = this.shops.filter(shop => shop.status === 'installing').length;
        const error = this.shops.filter(shop => shop.status === 'error').length;

        document.getElementById('total-shops').textContent = total;
        document.getElementById('active-shops').textContent = active;
        document.getElementById('installing-shops').textContent = installing;
        document.getElementById('error-shops').textContent = error;
    }

    openShop(subdomain) {
        const url = `http://${subdomain}.localhost`;
        window.open(url, '_blank');
    }

    openAdmin(subdomain) {
        const url = `http://${subdomain}.localhost/admin`;
        window.open(url, '_blank');
    }

    async deleteShop(shopId) {
        if (!confirm('آیا مطمئن هستید که می‌خواهید این فروشگاه را حذف کنید؟')) {
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/tenants/${shopId}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                this.shops = this.shops.filter(shop => shop.id !== shopId);
                this.renderShops();
                this.updateStats();
                this.showToast('فروشگاه با موفقیت حذف شد', 'success');
            } else {
                throw new Error(result.error || 'خطا در حذف فروشگاه');
            }
        } catch (error) {
            console.error('Error deleting shop:', error);
            this.showToast('خطا در حذف فروشگاه: ' + error.message, 'error');
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${this.getToastIcon(type)} ml-2"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(toast);

        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Hide toast after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 5000);
    }

    getToastIcon(type) {
        const iconMap = {
            'success': 'check-circle',
            'error': 'exclamation-triangle',
            'warning': 'exclamation-circle',
            'info': 'info-circle'
        };
        return iconMap[type] || 'info-circle';
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new AdminDashboard();
});
