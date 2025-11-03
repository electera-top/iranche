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
        if (overlay) overlay.classList.add('active'); 
    }
    function hideModal() { 
        const overlay = $('#modalOverlay'); 
        if (overlay) overlay.classList.remove('active'); 
    }
    window.closeModal = hideModal;

    async function loadPlans() {
        try {
            const res = await fetch(`${API_BASE}/plans?is_active=true`, { headers: authHeaders() });
            if (!res.ok) return [];
            const json = await res.json();
            return json.data || [];
        } catch (e) {
            console.error('Failed to load plans:', e);
            return [];
        }
    }

    async function loadThemes() {
        try {
            const res = await fetch(`${API_BASE}/themes?status=active`, { headers: authHeaders() });
            if (!res.ok) return [];
            const json = await res.json();
            return json.data || [];
        } catch (e) {
            console.error('Failed to load themes:', e);
            return [];
        }
    }

    async function loadTenants() {
        const tbody = $('#tenantsTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '<tr><td colspan="8"><div class="loading-spinner"></div></td></tr>';
        
        try {
            const status = $('#statusFilter')?.value || '';
            const search = $('#searchTenants')?.value || '';
            
            let url = `${API_BASE}/tenants?page=1&limit=50`;
            if (status) url += `&status=${status}`;
            if (search) url += `&search=${encodeURIComponent(search)}`;
            
            const res = await fetch(url, { headers: authHeaders() });
            if (!res.ok) throw new Error('Failed to load tenants');
            
            const json = await res.json();
            const tenants = json.data?.tenants || [];
            
            if (!tenants.length) {
                tbody.innerHTML = `<tr class="no-data"><td colspan="8"><i class="fas fa-store"></i><p>هنوز فروشگاهی ثبت نشده است</p></td></tr>`;
                return;
            }
            
            tbody.innerHTML = '';
            tenants.forEach(function(tenant) {
                const tr = document.createElement('tr');
                const statusClass = tenant.status === 'active' ? 'status-active' : 
                                  tenant.status === 'suspended' ? 'status-suspended' :
                                  tenant.status === 'pending' ? 'status-pending' : 'status-inactive';
                const statusText = tenant.status === 'active' ? 'فعال' :
                                 tenant.status === 'suspended' ? 'مسدود' :
                                 tenant.status === 'pending' ? 'در انتظار' : 'غیرفعال';
                
                const planName = tenant.plan_name || tenant.plan_type || '-';
                const storageUsed = tenant.storage_used ? (tenant.storage_used / 1024 / 1024 / 1024).toFixed(2) : '0';
                const storageLimit = tenant.storage_limit ? (tenant.storage_limit / 1024 / 1024 / 1024).toFixed(2) : tenant.plan_storage_gb || '0';
                
                tr.innerHTML = `
                    <td>${tenant.shop_name || '-'}</td>
                    <td>${tenant.subdomain}.localhost</td>
                    <td>${tenant.owner_name || '-'}</td>
                    <td>${tenant.owner_email || '-'}</td>
                    <td>${planName} ${tenant.plan_duration ? '(' + getDurationText(tenant.plan_duration) + ')' : ''}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>${new Date(tenant.created_at || Date.now()).toLocaleDateString('fa-IR')}</td>
                    <td class="action-buttons">
                        <button class="btn-icon btn-edit-tenant" data-id="${tenant.id}" title="ویرایش"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon btn-delete-tenant" data-id="${tenant.id}" title="حذف"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            
            // Bind actions
            $all('.btn-edit-tenant').forEach(function(btn) {
                btn.onclick = async function() {
                    const id = btn.getAttribute('data-id');
                    await openEditTenant(id);
                };
            });
            
            $all('.btn-delete-tenant').forEach(function(btn) {
                btn.onclick = async function() {
                    const id = btn.getAttribute('data-id');
                    if (!confirm('حذف این فروشگاه قطعی است؟')) return;
                    try {
                        const res = await fetch(`${API_BASE}/tenants/${id}`, { method: 'DELETE', headers: authHeaders() });
                        if (!res.ok) throw 0;
                        await loadTenants();
                        if (window.showNotification) window.showNotification('فروشگاه حذف شد', 'success');
                    } catch (e) {
                        if (window.showNotification) window.showNotification('خطا در حذف فروشگاه', 'error');
                    }
                };
            });
        } catch (e) {
            console.error('Error loading tenants:', e);
            tbody.innerHTML = `<tr class="no-data"><td colspan="8"><p>خطا در بارگذاری فروشگاه‌ها</p></td></tr>`;
        }
    }
    
    async function openEditTenant(id) {
        try {
            const res = await fetch(`${API_BASE}/tenants/${id}`, { headers: authHeaders() });
            if (!res.ok) throw new Error('Failed to load tenant');
            const json = await res.json();
            const tenant = json.data;
            
            showModal();
            
            // Wait a bit and then set values
            setTimeout(async () => {
                try {
                    const modalTitle = document.getElementById('modalTitle');
                    const tenantId = document.getElementById('tenantId');
                    const tenantShopName = document.getElementById('tenantShopName');
                    const tenantSubdomain = document.getElementById('tenantSubdomain');
                    const tenantDescription = document.getElementById('tenantDescription');
                    const tenantOwnerName = document.getElementById('tenantOwnerName');
                    const tenantOwnerEmail = document.getElementById('tenantOwnerEmail');
                    const tenantOwnerPhone = document.getElementById('tenantOwnerPhone');
                    const tenantPlanId = document.getElementById('tenantPlanId');
                    const tenantThemeId = document.getElementById('tenantThemeId');
                    const tenantAdminPassword = document.getElementById('tenantAdminPassword');
                    
                    if (modalTitle) modalTitle.textContent = 'ویرایش فروشگاه';
                    if (tenantId) tenantId.value = tenant.id;
                    if (tenantShopName) tenantShopName.value = tenant.shop_name || '';
                    if (tenantSubdomain) tenantSubdomain.value = tenant.subdomain || '';
                    if (tenantDescription) tenantDescription.value = tenant.shop_description || '';
                    if (tenantOwnerName) tenantOwnerName.value = tenant.owner_name || '';
                    if (tenantOwnerEmail) tenantOwnerEmail.value = tenant.owner_email || '';
                    if (tenantOwnerPhone) tenantOwnerPhone.value = tenant.owner_phone || '';
                    
                    // Load plans and themes first, then set selected values
                    await Promise.all([loadPlansIntoSelect(), loadThemesIntoSelect()]);
                    
                    if (tenantPlanId) {
                        setTimeout(() => {
                            tenantPlanId.value = tenant.plan_id || '';
                        }, 50);
                    }
                    
                    if (tenantThemeId) {
                        setTimeout(async () => {
                            // tenant.theme contains theme ID (as string) or 'default'
                            if (tenant.theme && tenant.theme !== 'default') {
                                const themeId = Number(tenant.theme);
                                if (!isNaN(themeId)) {
                                    // Check if theme exists
                                    const themes = await loadThemes();
                                    const matchingTheme = themes.find(t => t.id === themeId);
                                    if (matchingTheme) {
                                        tenantThemeId.value = themeId;
                                    }
                                }
                            }
                        }, 100);
                    }
                    
                    if (tenantAdminPassword) {
                        tenantAdminPassword.required = false;
                        tenantAdminPassword.value = '';
                    }
                } catch (err) {
                    console.error('Error setting form values:', err);
                }
            }, 100);
        } catch (e) {
            console.error('Error loading tenant:', e);
            if (window.showNotification) window.showNotification('خطا در بارگذاری اطلاعات فروشگاه', 'error');
        }
    }

    async function loadPlansIntoSelect() {
        const select = document.getElementById('tenantPlanId');
        if (!select) {
            console.warn('tenantPlanId select not found');
            return;
        }
        
        try {
            const plans = await loadPlans();
            select.innerHTML = '<option value="">بدون پلن</option>';
            
            if (plans && plans.length > 0) {
                plans.forEach(function(plan) {
                    const option = document.createElement('option');
                    option.value = plan.id;
                    const metersText = plan.meters ? `${plan.meters} متر مربع` : '';
                    const durationText = getDurationText(plan.duration || 'monthly');
                    option.textContent = `${plan.name} - ${durationText}${metersText ? ' - ' + metersText : ''} - ${formatPrice(plan.price)}`;
                    select.appendChild(option);
                });
            } else {
                console.warn('No plans found');
            }
        } catch (err) {
            console.error('Error loading plans into select:', err);
        }
    }

    async function loadThemesIntoSelect() {
        const select = document.getElementById('tenantThemeId');
        if (!select) {
            console.warn('tenantThemeId select not found');
            return;
        }
        
        try {
            const themes = await loadThemes();
            select.innerHTML = '<option value="">انتخاب قالب</option>';
            
            if (themes && themes.length > 0) {
                themes.forEach(function(theme) {
                    const option = document.createElement('option');
                    option.value = theme.id;
                    option.textContent = `${theme.name}${theme.version ? ' (v' + theme.version + ')' : ''}${theme.is_free ? ' - رایگان' : ' - ' + formatPrice(theme.price)}`;
                    select.appendChild(option);
                });
            } else {
                console.warn('No themes found');
            }
        } catch (err) {
            console.error('Error loading themes into select:', err);
        }
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
    
    function formatPrice(price) {
        if (!price || Number(price) === 0) return 'رایگان';
        try {
            return new Intl.NumberFormat('fa-IR').format(Number(price)) + ' تومان';
        } catch (e) {
            return price + ' تومان';
        }
    }

    function bindEvents() {
        const openBtn = document.getElementById('openAddTenantModal');
        if (openBtn) {
            openBtn.onclick = async function() {
                const modalTitle = document.getElementById('modalTitle');
                const addTenantForm = document.getElementById('addTenantForm');
                const tenantId = document.getElementById('tenantId');
                const tenantAdminPassword = document.getElementById('tenantAdminPassword');
                
                if (modalTitle) modalTitle.textContent = 'افزودن فروشگاه جدید';
                if (addTenantForm) addTenantForm.reset();
                if (tenantId) tenantId.value = '';
                if (tenantAdminPassword) {
                    tenantAdminPassword.required = true;
                    tenantAdminPassword.value = '';
                }
                
                showModal();
                
                // Load plans and themes after modal is shown
                setTimeout(async () => {
                    await Promise.all([loadPlansIntoSelect(), loadThemesIntoSelect()]);
                }, 100);
            };
        }

        const form = $('#addTenantForm');
        if (form) {
            form.onsubmit = async function(e) {
                e.preventDefault();
                const id = $('#tenantId').value;
                const isEdit = !!id;
                
                const planId = $('#tenantPlanId').value ? Number($('#tenantPlanId').value) : null;
                const themeId = $('#tenantThemeId').value ? Number($('#tenantThemeId').value) : null;
                
                // Store theme ID as string in theme field (as requested by user)
                const payload = {
                    shop_name: $('#tenantShopName').value.trim(),
                    subdomain: $('#tenantSubdomain').value.trim(),
                    shop_description: $('#tenantDescription').value.trim(),
                    owner_name: $('#tenantOwnerName').value.trim(),
                    owner_email: $('#tenantOwnerEmail').value.trim(),
                    owner_phone: $('#tenantOwnerPhone').value.trim(),
                    plan_id: planId,
                    theme: themeId ? String(themeId) : 'default'
                };
                
                if (!isEdit) {
                    payload.admin_password = $('#tenantAdminPassword').value;
                }
                
                if (!payload.shop_name || !payload.subdomain || !payload.owner_name || !payload.owner_email) {
                    if (window.showNotification) window.showNotification('لطفاً فیلدهای الزامی را پر کنید', 'error');
                    return;
                }
                
                try {
                    const url = isEdit ? `${API_BASE}/tenants/${id}` : `${API_BASE}/tenants`;
                    const method = isEdit ? 'PUT' : 'POST';
                    
                    const res = await fetch(url, {
                        method: method,
                        headers: authHeaders(),
                        body: JSON.stringify(payload)
                    });
                    
                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({}));
                        throw new Error(errorData.error || errorData.message || 'خطا در ذخیره فروشگاه');
                    }
                    
                    const json = await res.json();
                    hideModal();
                    await loadTenants();
                    if (window.showNotification) {
                        window.showNotification(
                            isEdit ? 'فروشگاه به‌روزرسانی شد' : 'فروشگاه با موفقیت ایجاد شد',
                            'success'
                        );
                    }
                } catch (e) {
                    if (window.showNotification) {
                        window.showNotification(
                            e.message || 'خطا در ذخیره فروشگاه',
                            'error'
                        );
                    }
                }
            };
        }

        const searchInput = $('#searchTenants');
        if (searchInput) {
            let searchTimeout;
            searchInput.oninput = function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    loadTenants();
                }, 500);
            };
        }

        const applyFilters = $('#applyFilters');
        if (applyFilters) {
            applyFilters.onclick = function() {
                loadTenants();
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
    loadTenants();
})();

