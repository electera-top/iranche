(function() {
    function $(selector) { return document.querySelector(selector); }
    function $all(selector) { return document.querySelectorAll(selector); }
    const API_BASE = 'http://localhost:3000/api';

    function showModal() { const overlay = $('#modalOverlay'); if (overlay) overlay.classList.add('active'); }
    function hideModal() { const overlay = $('#modalOverlay'); if (overlay) overlay.classList.remove('active'); }

    window.closeModal = hideModal;

    function authHeaders() {
        const t = localStorage.getItem('ADMIN_TOKEN');
        const h = { 'Content-Type': 'application/json' };
        if (t) h['Authorization'] = 'Bearer ' + t;
        return h;
    }

    function formatPrice(value, isFree) {
        if (isFree || Number(value) === 0) return 'رایگان';
        try { return new Intl.NumberFormat('fa-IR').format(Number(value)) + ' تومان'; } catch (e) { return value + ' تومان'; }
    }

    function renderList(items) {
        const tbody = $('#themesTableBody');
        if (!tbody) return;
        if (!items || !items.length) {
            tbody.innerHTML = `<tr class="no-data"><td colspan="6"><i class=\"fas fa-palette\"></i><p>هنوز قالبی ثبت نشده است</p></td></tr>`;
            return;
        }
        tbody.innerHTML = '';
        items.forEach(function(theme) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${theme.name}</td>
                <td>${theme.category_name || '-'}</td>
                <td>${theme.version || '-'}</td>
                <td>${formatPrice(theme.price || 0, theme.is_free)}</td>
                <td><span class="status-badge ${theme.status === 'active' ? 'status-active' : 'status-inactive'}">${theme.status === 'active' ? 'فعال' : 'غیرفعال'}</span></td>
                <td>${new Date(theme.created_at || Date.now()).toLocaleDateString('fa-IR')}</td>
                <td class="action-buttons">
                    <button class="btn-icon btn-activate-demo" data-slug="${theme.slug}" title="فعال‌سازی دمو" ${theme.demo_status ? 'style="display:none;"' : ''}><i class="fas fa-play-circle"></i></button>
                    <button class="btn-icon btn-delete-demo" data-slug="${theme.slug}" title="حذف دمو" ${theme.demo_status && (theme.demo_status === 'active' || theme.demo_status === 'building') ? '' : 'style="display:none;"'}><i class="fas fa-stop-circle"></i></button>
                    <button class="btn-icon btn-edit-theme" data-id="${theme.id}" title="ویرایش"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon btn-delete-theme" data-id="${theme.id}" title="حذف"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Bind row actions
        $all('.btn-activate-demo').forEach(function(btn){
            btn.onclick = async function(){
                const slug = btn.getAttribute('data-slug');
                if (!slug) return;
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                btn.disabled = true;
                try {
                    const res = await fetch(`${API_BASE}/theme-demos/activate-theme/${slug}`, { 
                        method:'POST', 
                        headers: authHeaders() 
                    });
                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({}));
                        throw new Error(errorData.error || 'خطا در فعال‌سازی دمو');
                    }
                    const json = await res.json();
                    if (window.showNotification) {
                        window.showNotification(
                            `دموی قالب "${slug}" با موفقیت فعال شد. می‌توانید از ${json.demo_url || `http://themes.localhost/${slug}/`} مشاهده کنید.`,
                            'success'
                        );
                    }
                    // Reload themes to update status
                    await loadThemes();
                } catch(e) {
                    if (window.showNotification) {
                        window.showNotification(
                            e.message || 'خطا در فعال‌سازی دموی قالب',
                            'error'
                        );
                    }
                } finally {
                    btn.innerHTML = originalHTML;
                    btn.disabled = false;
                }
            };
        });
        
        // Bind delete demo actions
        $all('.btn-delete-demo').forEach(function(btn){
            btn.onclick = async function(){
                const slug = btn.getAttribute('data-slug');
                if (!slug) return;
                if (!confirm(`آیا از حذف دموی قالب "${slug}" اطمینان دارید؟ این عمل غیرقابل بازگشت است.`)) return;
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                btn.disabled = true;
                try {
                    const res = await fetch(`${API_BASE}/theme-demos/${slug}`, { 
                        method:'DELETE', 
                        headers: authHeaders() 
                    });
                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({}));
                        throw new Error(errorData.error || 'خطا در حذف دمو');
                    }
                    const json = await res.json();
                    // Hide delete demo button
                    btn.style.display = 'none';
                    if (window.showNotification) {
                        window.showNotification(
                            `دموی قالب "${slug}" با موفقیت حذف شد.`,
                            'success'
                        );
                    }
                    // Reload themes to update status
                    await loadThemes();
                } catch(e) {
                    if (window.showNotification) {
                        window.showNotification(
                            e.message || 'خطا در حذف دموی قالب',
                            'error'
                        );
                    }
                } finally {
                    btn.innerHTML = originalHTML;
                    btn.disabled = false;
                }
            };
        });
        $all('.btn-edit-theme').forEach(function(btn){
            btn.onclick = async function(){
                const id = btn.getAttribute('data-id');
                await openEditTheme(id);
            };
        });
        $all('.btn-delete-theme').forEach(function(btn){
            btn.onclick = async function(){
                const id = btn.getAttribute('data-id');
                if (!confirm('حذف این قالب قطعی است؟')) return;
                try {
                    const res = await fetch(`${API_BASE}/themes/${id}`, { method:'DELETE', headers: authHeaders() });
                    if (!res.ok) throw 0;
                    await loadThemes();
                    if (window.showNotification) window.showNotification('قالب حذف شد', 'success');
                } catch(e){ if (window.showNotification) window.showNotification('خطا در حذف قالب', 'error'); }
            };
        });
    }

    async function openEditTheme(id){
        try {
            // Ensure modal and categories
            await loadCategories();
            const res = await fetch(`${API_BASE}/themes/${id}`, { headers: authHeaders() });
            if (!res.ok) throw 0;
            const json = await res.json();
            const t = json.data;
            if (!t) throw 0;
            // Fill form
            const form = document.getElementById('addThemeForm');
            if (!form) return;
            let hiddenEdit = document.getElementById('editingThemeId');
            if (!hiddenEdit){ hiddenEdit = document.createElement('input'); hiddenEdit.type='hidden'; hiddenEdit.id='editingThemeId'; form.appendChild(hiddenEdit); }
            hiddenEdit.value = String(t.id);
            $('#modalTitle').textContent = 'ویرایش قالب';
            $('#themeName').value = t.name || '';
            if ($('#themeVersion')) $('#themeVersion').value = t.version || '';
            if ($('#themeSlug')) $('#themeSlug').value = t.slug || '';
            if ($('#themeAuthor')) $('#themeAuthor').value = t.author || '';
            if ($('#themeDescription')) $('#themeDescription').value = t.description || '';
            if ($('#themeCategory')) $('#themeCategory').value = t.category_id ? String(t.category_id) : '';
            if ($('#themePrice')) $('#themePrice').value = t.price != null ? String(t.price) : '';
            if ($('#themeIsFree')) $('#themeIsFree').checked = !!t.is_free;

            showModal();
        } catch(e){ if (window.showNotification) window.showNotification('خطا در بارگذاری قالب', 'error'); }
    }

    async function loadThemes() {
        try {
            const res = await fetch(`${API_BASE}/themes`, { headers: authHeaders() });
            if (!res.ok) throw 0;
            const json = await res.json();
            renderList(json.data || []);
        } catch (e) { /* noop */ }
    }

    async function loadCategories() {
        const sel = $('#themeCategory');
        if (!sel) return;
        sel.innerHTML = '<option value="">انتخاب دسته</option>';
        try {
            const res = await fetch(`${API_BASE}/theme-categories`, { headers: authHeaders() });
            if (!res.ok) throw 0;
            const json = await res.json();
            (json.data || []).forEach(function(cat) {
                const opt = document.createElement('option');
                opt.value = String(cat.id);
                opt.textContent = cat.name;
                sel.appendChild(opt);
            });
        } catch (e) { /* noop */ }
    }

    function initDropzones() {
        const bannerEl = document.getElementById('themeBannerDropzone');
        const fileEl = document.getElementById('themeFileDropzone');
        if (!bannerEl || !fileEl) return;
        // always use FilePicker to avoid Dropzone UI
        bannerEl.style.cursor = 'pointer';
        fileEl.style.cursor = 'pointer';

        bannerEl.addEventListener('click', function(){
            if (window.FilePicker) {
                window.FilePicker.open({ multi:false, type:'image', onSelect: function(items){
                    if (!items || !items.length) return;
                    const f = items[0];
                    const previewWrap = document.getElementById('themeBannerPreviews');
                    if (previewWrap) {
                        previewWrap.innerHTML = '';
                        const item = document.createElement('div');
                        item.className = 'fallback-preview';
                        const imgWrap = document.createElement('div');
                        imgWrap.className = 'dz-image';
                        const img = document.createElement('img');
                        img.style.maxWidth = '100%';
                        img.style.maxHeight = '80px';
                        img.src = 'https://files.iranche.com/' + (f.storage_path || '');
                        img.onerror = function(){ imgWrap.innerHTML = '<i class="fas fa-image"></i>'; };
                        imgWrap.appendChild(img);
                        const details = document.createElement('div');
                        details.className = 'dz-details';
                        const nameDiv = document.createElement('div');
                        nameDiv.className = 'dz-filename';
                        nameDiv.textContent = f.original_name || '';
                        const sizeDiv = document.createElement('div');
                        sizeDiv.className = 'dz-size';
                        sizeDiv.textContent = (f.file_size || 0) + ' B';
                        details.appendChild(nameDiv);
                        details.appendChild(sizeDiv);
                        item.appendChild(imgWrap);
                        item.appendChild(details);
                        previewWrap.appendChild(item);
                    }
                    let hidden = document.getElementById('themeBannerFileId');
                    if (!hidden){ hidden = document.createElement('input'); hidden.type='hidden'; hidden.id='themeBannerFileId'; document.getElementById('addThemeForm').appendChild(hidden); }
                    hidden.value = String(f.id || '');
                }});
            }
        });

        fileEl.addEventListener('click', function(){
            if (window.FilePicker) {
                window.FilePicker.open({ multi:false, type:'archive', onSelect: function(items){
                    if (!items || !items.length) return;
                    const f = items[0];
                    const previewWrap = document.getElementById('themeFilePreviews');
                    if (previewWrap) {
                        previewWrap.innerHTML = '';
                        const item = document.createElement('div');
                        item.className = 'fallback-preview';
                        const icon = document.createElement('div');
                        icon.className = 'dz-image';
                        icon.innerHTML = '<i class="fas fa-file-archive"></i>';
                        const details = document.createElement('div');
                        details.className = 'dz-details';
                        const nameDiv = document.createElement('div');
                        nameDiv.className = 'dz-filename';
                        nameDiv.textContent = f.original_name || '';
                        const sizeDiv = document.createElement('div');
                        sizeDiv.className = 'dz-size';
                        sizeDiv.textContent = (f.file_size || 0) + ' B';
                        details.appendChild(nameDiv);
                        details.appendChild(sizeDiv);
                        item.appendChild(icon);
                        item.appendChild(details);
                        previewWrap.appendChild(item);
                    }
                    let hiddenZip = document.getElementById('themeZipFileId');
                    if (!hiddenZip){ hiddenZip = document.createElement('input'); hiddenZip.type='hidden'; hiddenZip.id='themeZipFileId'; document.getElementById('addThemeForm').appendChild(hiddenZip); }
                    hiddenZip.value = String(f.id || '');
                }});
            }
        });
    }

    function bindEvents() {
		const openBtn = document.getElementById('openAddThemeModal');
		if (openBtn) openBtn.addEventListener('click', function() {
			showModal();
			initDropzones();
		});

		const isFree = document.getElementById('themeIsFree');
		const price = document.getElementById('themePrice');
		if (isFree && price) {
			isFree.addEventListener('change', function() {
				if (isFree.checked) {
					price.value = '0';
					price.setAttribute('disabled', 'disabled');
				} else {
					price.removeAttribute('disabled');
				}
			});
		}

        const form = document.getElementById('addThemeForm');
        if (form) {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                const payload = {
                    name: $('#themeName').value.trim(),
                    version: $('#themeVersion').value.trim(),
                    slug: $('#themeSlug') ? $('#themeSlug').value.trim() : '',
                    author: $('#themeAuthor') ? $('#themeAuthor').value.trim() : '',
                    price: Number($('#themePrice').value || 0),
                    is_free: $('#themeIsFree').checked,
                    status: 'active',
                    description: $('#themeDescription').value.trim(),
                    category_id: $('#themeCategory').value ? Number($('#themeCategory').value) : null,
                    banner_file_id: (function(){ const el=document.getElementById('themeBannerFileId'); return el? Number(el.value) || null : null; })(),
                    zip_file_id: (function(){ const el=document.getElementById('themeZipFileId'); return el? Number(el.value) || null : null; })()
                };
                if (!Number.isInteger(payload.banner_file_id) || payload.banner_file_id <= 0) {
                    delete payload.banner_file_id;
                }
                if (!Number.isInteger(payload.zip_file_id) || payload.zip_file_id <= 0) {
                    delete payload.zip_file_id;
                }
                if (!payload.name || !payload.version || !payload.slug) {
                    return window.showNotification && window.showNotification('نام، نسخه و نامک الزامی است', 'error');
                }
                try {
                    const editingEl = document.getElementById('editingThemeId');
                    const editingId = editingEl && editingEl.value ? editingEl.value : '';
                    let res;
                    if (editingId) {
                        // update
                        res = await fetch(`${API_BASE}/themes/${editingId}`, { method:'PUT', headers: authHeaders(), body: JSON.stringify(payload) });
                    } else {
                        // create
                        res = await fetch(`${API_BASE}/themes`, { method:'POST', headers: authHeaders(), body: JSON.stringify(payload) });
                    }
                    if (!res.ok) throw 0;
                    // reset edit state
                    if (editingEl) editingEl.remove();
                    $('#modalTitle').textContent = 'افزودن قالب';
                    hideModal();
                    await loadThemes();
                    if (window.showNotification) window.showNotification(editingId ? 'قالب ویرایش شد' : 'قالب با موفقیت ثبت شد', 'success');
                } catch (err) {
                    if (window.showNotification) window.showNotification('ثبت/ویرایش قالب با خطا مواجه شد', 'error');
                }
            });
        }

		const filter = document.getElementById('themeStatusFilter');
		const search = document.getElementById('themeSearch');
		if (filter || search) {
			[filter, search].forEach(function(el) {
				if (!el) return;
				el.addEventListener('input', function() {
					const status = filter ? filter.value : 'all';
					const q = (search ? search.value : '').trim();
					const rows = document.querySelectorAll('#themesTableBody tr');
					rows.forEach(function(row) {
						if (row.classList.contains('no-data')) return;
						const name = row.children[0].textContent;
						const st = row.children[3].textContent.trim();
						const okStatus = status === 'all' || (status === 'active' && st === 'فعال') || (status === 'inactive' && st === 'غیرفعال');
						const okSearch = !q || name.includes(q);
						row.style.display = okStatus && okSearch ? '' : 'none';
					});
				});
			});
		}
	}

    document.addEventListener('DOMContentLoaded', function() {
        if (window.adminCommon) adminCommon.ensureAuth();
        bindEvents();
        loadCategories();
        loadThemes();
    });
})();


