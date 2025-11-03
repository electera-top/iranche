// Common Admin Panel Functions
class AdminCommon {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000/api';
    }

    // API Helper
    async apiCall(endpoint, options = {}) {
        const url = `${this.apiBaseUrl}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        const token = localStorage.getItem('ADMIN_TOKEN');
        if (token) {
            defaultOptions.headers['Authorization'] = 'Bearer ' + token;
        }

        const config = { ...defaultOptions, ...options };
        
        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || `HTTP ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    ensureAuth() {
        const token = localStorage.getItem('ADMIN_TOKEN');
        if (!token) {
            window.location.href = 'login.html';
        }
    }

    // Loading Helper
    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    // Date Formatter
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // File Size Formatter
    formatFileSize(bytes) {
        if (bytes === 0) return '0 بایت';
        const k = 1024;
        const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Number Formatter
    formatNumber(num) {
        return new Intl.NumberFormat('fa-IR').format(num);
    }

    // Debounce Function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Modal Helpers
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Form Validation
    validateForm(formElement) {
        const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
        });

        return isValid;
    }

    // Clear Form
    clearForm(formElement) {
        const inputs = formElement.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.value = '';
            input.classList.remove('error');
        });
    }

    // Copy to Clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            showNotification('کپی شد', 'success');
        } catch (err) {
            console.error('Failed to copy: ', err);
            showNotification('خطا در کپی', 'error');
        }
    }

    // Download File
    downloadFile(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Generate Random ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Local Storage Helpers
    setStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Storage error:', error);
        }
    }

    getStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage error:', error);
            return defaultValue;
        }
    }

    removeStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Storage error:', error);
        }
    }
}

// Global instance
const adminCommon = new AdminCommon();

// Global helper functions
function showLoading() {
    adminCommon.showLoading();
}

function hideLoading() {
    adminCommon.hideLoading();
}

function formatDate(dateString) {
    return adminCommon.formatDate(dateString);
}

function formatFileSize(bytes) {
    return adminCommon.formatFileSize(bytes);
}

function formatNumber(num) {
    return adminCommon.formatNumber(num);
}

// Global auth guard for all admin pages except login
document.addEventListener('DOMContentLoaded', function() {
    try {
        const path = (window.location.pathname || '').toLowerCase();
        if (!path.endsWith('/login.html') && !path.endsWith('login.html')) {
            adminCommon.ensureAuth();
        }
    } catch (e) {
        // no-op
    }
});
