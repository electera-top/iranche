(function() {
    function $(selector) { return document.querySelector(selector); }
    function $all(selector) { return document.querySelectorAll(selector); }
    const API_BASE = 'http://localhost:3000/api';

    function authHeaders() {
        const t = localStorage.getItem('ADMIN_TOKEN');
        const h = { 'Content-Type': 'application/json' };
        if (t) h['Authorization'] = 'Bearer ' + t;
        return h;
    }

    function showModal() { 
        const overlay = $('#modalOverlay'); 
        if (overlay) {
            // Force display to ensure visibility
            overlay.style.display = 'flex';
            overlay.style.visibility = 'visible';
            overlay.style.opacity = '1';
            // Add active class for styling
            setTimeout(() => {
                overlay.classList.add('active');
            }, 10);
        }
    }
    function hideModal() { 
        const overlay = $('#modalOverlay'); 
        if (overlay) {
            overlay.classList.remove('active');
            overlay.style.display = 'none';
            overlay.style.visibility = 'hidden';
            overlay.style.opacity = '0';
        }
    }
    window.closeModal = hideModal;

    function formatPrice(price) {
        if (!price || Number(price) === 0) return 'رایگان';
        try {
            return new Intl.NumberFormat('fa-IR').format(Number(price)) + ' تومان';
        } catch (e) {
            return price + ' تومان';
        }
    }

    function getTypeText(type) {
        return type === 'special' ? 'ویژه' : 'معمولی';
    }

    function getDurationText(duration) {
        const map = {
            'monthly': 'ماهانه',
            'quarterly': 'سه‌ماهه',
            'semiannual': 'شش‌ماهه',
            'yearly': 'سالانه'
        };
        return map[duration] || duration;
    }

    async function loadPlans() {
        const tbody = $('#plansTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '<tr><td colspan="9"><div class="loading-spinner"></div></td></tr>';
        
        try {
            const type = $('#typeFilter')?.value || '';
            const duration = $('#durationFilter')?.value || '';
            
            let url = `${API_BASE}/plans`;
            const params = [];
            if (type) params.push(`type=${type}`);
            if (duration) params.push(`duration=${duration}`);
            if (params.length) url += '?' + params.join('&');
            
            const res = await fetch(url, { headers: authHeaders() });
            if (!res.ok) throw new Error('Failed to load plans');
            
            const json = await res.json();
            const plans = json.data || [];
            
            if (!plans.length) {
                tbody.innerHTML = `<tr class="no-data"><td colspan="9"><i class="fas fa-tags"></i><p>هنوز پلنی ثبت نشده است</p></td></tr>`;
                return;
            }
            
            tbody.innerHTML = '';
            plans.forEach(function(plan) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${plan.name || '-'}</td>
                    <td><span class="badge ${plan.type === 'special' ? 'badge-special' : 'badge-normal'}">${getTypeText(plan.type)}</span></td>
                    <td>${getDurationText(plan.duration)}</td>
                    <td>${plan.storage_gb || '0'} GB</td>
                    <td>${formatPrice(plan.price)}</td>
                    <td>${plan.meters ? Number(plan.meters).toFixed(1) : '0'} متر مربع</td>
                    <td>${plan.max_users === 0 ? 'نامحدود' : plan.max_users}</td>
                    <td><span class="status-badge ${plan.is_active ? 'status-active' : 'status-inactive'}">${plan.is_active ? 'فعال' : 'غیرفعال'}</span></td>
                    <td class="action-buttons">
                        <button class="btn-icon btn-edit-plan" data-id="${plan.id}" title="ویرایش"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon btn-delete-plan" data-id="${plan.id}" title="حذف"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            
            // Bind actions
            $all('.btn-edit-plan').forEach(function(btn) {
                btn.onclick = async function() {
                    const id = btn.getAttribute('data-id');
                    await openEditPlan(id);
                };
            });
            
            $all('.btn-delete-plan').forEach(function(btn) {
                btn.onclick = async function() {
                    const id = btn.getAttribute('data-id');
                    if (!confirm('حذف این پلن قطعی است؟')) return;
                    try {
                        const res = await fetch(`${API_BASE}/plans/${id}`, { method: 'DELETE', headers: authHeaders() });
                        if (!res.ok) {
                            const errorData = await res.json().catch(() => ({}));
                            throw new Error(errorData.error || 'خطا در حذف پلن');
                        }
                        await loadPlans();
                        if (window.showNotification) window.showNotification('پلن حذف شد', 'success');
                    } catch (e) {
                        if (window.showNotification) {
                            window.showNotification(
                                e.message || 'خطا در حذف پلن',
                                'error'
                            );
                        }
                    }
                };
            });
        } catch (e) {
            console.error('Error loading plans:', e);
            tbody.innerHTML = `<tr class="no-data"><td colspan="9"><p>خطا در بارگذاری پلن‌ها</p></td></tr>`;
        }
    }

    async function openEditPlan(id) {
        try {
            const res = await fetch(`${API_BASE}/plans/${id}`, { headers: authHeaders() });
            if (!res.ok) throw new Error('Failed to load plan');
            const json = await res.json();
            const plan = json.data;
            
            // Show modal first so elements are in DOM
            showModal();
            
            // Wait a bit and then set values using getElementById for reliability
            setTimeout(function() {
                try {
                    const modalTitle = document.getElementById('modalTitle');
                    const planId = document.getElementById('planId');
                    const planName = document.getElementById('planName');
                    const planType = document.getElementById('planType');
                    const planDuration = document.getElementById('planDuration');
                    const planStorageGb = document.getElementById('planStorageGb');
                    const planPrice = document.getElementById('planPrice');
                    const planDescription = document.getElementById('planDescription');
                    const planShopArea = document.getElementById('planShopArea');
                    const planMaxUsers = document.getElementById('planMaxUsers');
                    const planIsActive = document.getElementById('planIsActive');
                    const planSortOrder = document.getElementById('planSortOrder');
                    
                    if (modalTitle) modalTitle.textContent = 'ویرایش پلن';
                    if (planId) planId.value = plan.id;
                    if (planName) planName.value = plan.name || '';
                    if (planType) planType.value = plan.type || 'normal';
                    if (planDuration) planDuration.value = plan.duration || 'monthly';
                    if (planStorageGb) planStorageGb.value = plan.storage_gb || '';
                    if (planPrice) planPrice.value = plan.price || '';
                    if (planDescription) planDescription.value = plan.description || '';
                    
                    // Get meters directly from plan
                    const shopArea = plan.meters ? Number(plan.meters) : 0;
                    
                    if (planShopArea) planShopArea.value = shopArea;
                    if (planMaxUsers) planMaxUsers.value = plan.max_users || 0;
                    if (planIsActive) planIsActive.value = plan.is_active ? 'true' : 'false';
                    if (planSortOrder) planSortOrder.value = plan.sort_order || 0;
                } catch (err) {
                    console.error('Error setting form values:', err);
                }
            }, 200);
        } catch (e) {
            console.error('Error loading plan:', e);
            if (window.showNotification) window.showNotification('خطا در بارگذاری اطلاعات پلن', 'error');
        }
    }

    function bindEvents() {
        const openBtn = $('#openAddPlanModal');
        if (openBtn) {
            openBtn.onclick = function() {
                try {
                    // Show modal first so elements are in DOM
                    showModal();
                    
                    // Wait a bit and then set values
                    setTimeout(function() {
                        try {
                            const modalTitle = document.getElementById('modalTitle');
                            const addPlanForm = document.getElementById('addPlanForm');
                            const planId = document.getElementById('planId');
                            const planIsActive = document.getElementById('planIsActive');
                            const planSortOrder = document.getElementById('planSortOrder');
                            const planShopArea = document.getElementById('planShopArea');
                            const planMaxUsers = document.getElementById('planMaxUsers');
                            
                            if (modalTitle) modalTitle.textContent = 'افزودن پلن جدید';
                            if (addPlanForm) addPlanForm.reset();
                            if (planId) planId.value = '';
                            if (planIsActive) planIsActive.value = 'true';
                            if (planSortOrder) planSortOrder.value = '0';
                            if (planShopArea) planShopArea.value = '0';
                            if (planMaxUsers) planMaxUsers.value = '0';
                        } catch (err) {
                            console.error('Error setting form values:', err);
                        }
                    }, 200);
                } catch (err) {
                    console.error('Error opening modal:', err);
                }
            };
        }

        const form = $('#addPlanForm');
        if (form) {
            form.onsubmit = async function(e) {
                e.preventDefault();
                const id = $('#planId').value;
                const isEdit = !!id;
                
                // Get meters directly from form
                const planShopArea = $('#planShopArea');
                if (!planShopArea) {
                    if (window.showNotification) window.showNotification('فیلد متراژ فروشگاه یافت نشد', 'error');
                    return;
                }
                const shopArea = Number(planShopArea.value) || 0;
                
                const payload = {
                    name: $('#planName').value.trim(),
                    type: $('#planType').value,
                    duration: $('#planDuration').value,
                    storage_gb: Number($('#planStorageGb').value),
                    price: Number($('#planPrice').value),
                    description: $('#planDescription').value.trim(),
                    meters: shopArea,
                    max_users: Number($('#planMaxUsers').value) || 0,
                    max_domains: 1, // Default value, not shown in form
                    is_active: $('#planIsActive').value === 'true',
                    sort_order: Number($('#planSortOrder').value) || 0
                };
                
                if (!payload.name || !payload.type || !payload.duration || !payload.storage_gb || payload.price === undefined || shopArea <= 0) {
                    if (window.showNotification) window.showNotification('لطفاً فیلدهای الزامی را پر کنید (متراژ فروشگاه باید بیشتر از 0 باشد)', 'error');
                    return;
                }
                
                try {
                    const url = isEdit ? `${API_BASE}/plans/${id}` : `${API_BASE}/plans`;
                    const method = isEdit ? 'PUT' : 'POST';
                    
                    const res = await fetch(url, {
                        method: method,
                        headers: authHeaders(),
                        body: JSON.stringify(payload)
                    });
                    
                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({}));
                        throw new Error(errorData.error || errorData.details || 'خطا در ذخیره پلن');
                    }
                    
                    hideModal();
                    await loadPlans();
                    if (window.showNotification) {
                        window.showNotification(
                            isEdit ? 'پلن به‌روزرسانی شد' : 'پلن با موفقیت ایجاد شد',
                            'success'
                        );
                    }
                } catch (e) {
                    if (window.showNotification) {
                        window.showNotification(
                            e.message || 'خطا در ذخیره پلن',
                            'error'
                        );
                    }
                }
            };
        }

        const applyFilters = $('#applyFilters');
        if (applyFilters) {
            applyFilters.onclick = function() {
                loadPlans();
            };
        }
    }

    // Guard: Check authentication
    (function() {
        const token = localStorage.getItem('ADMIN_TOKEN');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }
    })();

    // Initialize
    bindEvents();
    loadPlans();
})();

