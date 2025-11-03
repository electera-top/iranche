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
        const tbody = $('#pluginsTableBody');
        if (!tbody) return;
        if (!items || !items.length) {
            tbody.innerHTML = `<tr class="no-data"><td colspan="6"><i class=\"fas fa-plug\"></i><p>هنوز افزونه‌ای ثبت نشده است</p></td></tr>`;
            return;
        }
        tbody.innerHTML = '';
        items.forEach(function(plugin) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${plugin.name}</td>
                <td>${plugin.version || '-'}</td>
                <td>${formatPrice(plugin.price || 0, plugin.is_free)}</td>
                <td><span class="status-badge ${plugin.status === 'active' ? 'status-active' : 'status-inactive'}">${plugin.status === 'active' ? 'فعال' : 'غیرفعال'}</span></td>
                <td>${new Date(plugin.created_at || Date.now()).toLocaleDateString('fa-IR')}</td>
                <td class="action-buttons">
                    <button class="btn-icon btn-edit-plugin" data-id="${plugin.id}" title="ویرایش"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon btn-delete-plugin" data-id="${plugin.id}" title="حذف"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        $all('.btn-edit-plugin').forEach(function(btn){
            btn.onclick = async function(){
                const id = btn.getAttribute('data-id');
                await openEditPlugin(id);
            };
        });
        $all('.btn-delete-plugin').forEach(function(btn){
            btn.onclick = async function(){
                const id = btn.getAttribute('data-id');
                if (!confirm('حذف این افزونه قطعی است؟')) return;
                try {
                    const res = await fetch(`${API_BASE}/plugins/${id}`, { method:'DELETE', headers: authHeaders() });
                    if (!res.ok) throw 0;
                    await loadPlugins();
                    if (window.showNotification) window.showNotification('افزونه حذف شد', 'success');
                } catch(e){ if (window.showNotification) window.showNotification('خطا در حذف افزونه', 'error'); }
            };
        });
    }

    async function openEditPlugin(id){
        try {
            await loadPluginCategories();
            const res = await fetch(`${API_BASE}/plugins/${id}`, { headers: authHeaders() });
            if (!res.ok) throw 0;
            const json = await res.json();
            const p = json.data;
            if (!p) throw 0;
            const form = document.getElementById('addPluginForm');
            if (!form) return;
            let hiddenEdit = document.getElementById('editingPluginId');
            if (!hiddenEdit){ hiddenEdit = document.createElement('input'); hiddenEdit.type='hidden'; hiddenEdit.id='editingPluginId'; form.appendChild(hiddenEdit); }
            hiddenEdit.value = String(p.id);
            $('#modalTitle').textContent = 'ویرایش افزونه';
            $('#pluginName').value = p.name || '';
            if ($('#pluginVersion')) $('#pluginVersion').value = p.version || '';
            if ($('#pluginSlug')) $('#pluginSlug').value = p.slug || '';
            if ($('#pluginAuthor')) $('#pluginAuthor').value = p.author || '';
            if ($('#pluginDescription')) $('#pluginDescription').value = p.description || '';
            if ($('#pluginCategory')) $('#pluginCategory').value = p.category_id ? String(p.category_id) : '';
            if ($('#pluginPrice')) $('#pluginPrice').value = p.price != null ? String(p.price) : '';
            if ($('#pluginIsFree')) $('#pluginIsFree').checked = !!p.is_free;
            showModal();
        } catch(e){ if (window.showNotification) window.showNotification('خطا در بارگذاری افزونه', 'error'); }
    }

    async function loadPlugins() {
        try {
            const res = await fetch(`${API_BASE}/plugins`, { headers: authHeaders() });
            if (!res.ok) throw 0;
            const json = await res.json();
            renderList(json.data || []);
        } catch (e) { /* noop */ }
    }

    async function loadPluginCategories() {
        const sel = $('#pluginCategory');
        if (!sel) return;
        sel.innerHTML = '<option value="">انتخاب دسته</option>';
        try {
            const res = await fetch(`${API_BASE}/plugin-categories`, { headers: authHeaders() });
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

    function initFilePickers() {
        const bannerEl = document.getElementById('pluginBannerDropzone');
        const fileEl = document.getElementById('pluginFileDropzone');
        if (!bannerEl || !fileEl) return;
        bannerEl.style.cursor = 'pointer';
        fileEl.style.cursor = 'pointer';

        bannerEl.addEventListener('click', function(){
            if (window.FilePicker) {
                window.FilePicker.open({ multi:false, type:'image', onSelect: function(items){
                    if (!items || !items.length) return;
                    const f = items[0];
                    const previewWrap = document.getElementById('pluginBannerPreviews');
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
                    let hidden = document.getElementById('pluginBannerFileId');
                    if (!hidden){ hidden = document.createElement('input'); hidden.type='hidden'; hidden.id='pluginBannerFileId'; document.getElementById('addPluginForm').appendChild(hidden); }
                    hidden.value = String(f.id || '');
                }});
            }
        });

        fileEl.addEventListener('click', function(){
            if (window.FilePicker) {
                window.FilePicker.open({ multi:false, type:'archive', onSelect: function(items){
                    if (!items || !items.length) return;
                    const f = items[0];
                    const previewWrap = document.getElementById('pluginFilePreviews');
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
                    let hiddenZip = document.getElementById('pluginZipFileId');
                    if (!hiddenZip){ hiddenZip = document.createElement('input'); hiddenZip.type='hidden'; hiddenZip.id='pluginZipFileId'; document.getElementById('addPluginForm').appendChild(hiddenZip); }
                    hiddenZip.value = String(f.id || '');
                }});
            }
        });
    }

    function bindEvents() {
        const openBtn = document.getElementById('openAddPluginModal');
        if (openBtn) openBtn.addEventListener('click', function() {
            $('#modalTitle').textContent = 'افزودن افزونه';
            const form = document.getElementById('addPluginForm');
            const editingEl = document.getElementById('editingPluginId');
            if (editingEl) editingEl.remove();
            showModal();
            initFilePickers();
        });

        const isFree = document.getElementById('pluginIsFree');
        const price = document.getElementById('pluginPrice');
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

        const form = document.getElementById('addPluginForm');
        if (form) {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                const payload = {
                    name: $('#pluginName').value.trim(),
                    version: $('#pluginVersion').value.trim(),
                    slug: $('#pluginSlug') ? $('#pluginSlug').value.trim() : '',
                    author: $('#pluginAuthor') ? $('#pluginAuthor').value.trim() : '',
                    price: Number($('#pluginPrice').value || 0),
                    is_free: $('#pluginIsFree').checked,
                    status: 'active',
                    description: $('#pluginDescription').value.trim(),
                    category_id: $('#pluginCategory') && $('#pluginCategory').value ? Number($('#pluginCategory').value) : null,
                    banner_file_id: (function(){ const el=document.getElementById('pluginBannerFileId'); return el? Number(el.value) || null : null; })(),
                    zip_file_id: (function(){ const el=document.getElementById('pluginZipFileId'); return el? Number(el.value) || null : null; })()
                };
                if (!Number.isInteger(payload.banner_file_id) || payload.banner_file_id <= 0) delete payload.banner_file_id;
                if (!Number.isInteger(payload.zip_file_id) || payload.zip_file_id <= 0) delete payload.zip_file_id;
                if (!payload.name || !payload.version || !payload.slug) {
                    return window.showNotification && window.showNotification('نام، نسخه و نامک الزامی است', 'error');
                }
                try {
                    const editingEl = document.getElementById('editingPluginId');
                    const editingId = editingEl && editingEl.value ? editingEl.value : '';
                    let res;
                    if (editingId) {
                        res = await fetch(`${API_BASE}/plugins/${editingId}`, { method:'PUT', headers: authHeaders(), body: JSON.stringify(payload) });
                    } else {
                        res = await fetch(`${API_BASE}/plugins`, { method:'POST', headers: authHeaders(), body: JSON.stringify(payload) });
                    }
                    if (!res.ok) throw 0;
                    if (editingEl) editingEl.remove();
                    $('#modalTitle').textContent = 'افزودن افزونه';
                    hideModal();
                    await loadPlugins();
                    if (window.showNotification) window.showNotification(editingId ? 'افزونه ویرایش شد' : 'افزونه با موفقیت ثبت شد', 'success');
                } catch (err) {
                    if (window.showNotification) window.showNotification('ثبت/ویرایش افزونه با خطا مواجه شد', 'error');
                }
            });
        }

        const filter = document.getElementById('pluginStatusFilter');
        const search = document.getElementById('pluginSearch');
        if (filter || search) {
            [filter, search].forEach(function(el) {
                if (!el) return;
                el.addEventListener('input', function() {
                    const status = filter ? filter.value : 'all';
                    const q = (search ? search.value : '').trim();
                    const rows = document.querySelectorAll('#pluginsTableBody tr');
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
        loadPluginCategories();
        loadPlugins();
    });
})();


