(function() {
	function $(s) { return document.querySelector(s); }
	function $all(s) { return document.querySelectorAll(s); }
	function close() { const o = $('#modalOverlay'); if (o) o.classList.remove('active'); }
	window.closeModal = close;
	function open() { const o = $('#modalOverlay'); if (o) o.classList.add('active'); }

	const API_BASE = 'http://localhost:3000/api/theme-categories';
	function adminHeaders() {
		const token = localStorage.getItem('ADMIN_TOKEN') || '';
		const headers = { 'Content-Type': 'application/json' };
		if (token) headers['Authorization'] = 'Bearer ' + token;
		return headers;
	}

	let editingId = null;

	async function loadCategories() {
		const tbody = $('#themeCategoriesBody');
		if (!tbody) return;
		tbody.innerHTML = `<tr class="no-data"><td colspan="5"><i class="fas fa-spinner fa-spin"></i><p>در حال بارگذاری...</p></td></tr>`;
		try {
			const res = await fetch(API_BASE, { headers: adminHeaders() });
			if (!res.ok) throw new Error('Failed to load');
			const json = await res.json();
			renderList(json.data || []);
			fillParentOptions(json.data || []);
		} catch (e) {
			tbody.innerHTML = `<tr class="no-data"><td colspan="5">خطا در بارگذاری</td></tr>`;
		}
	}

	function renderList(items) {
		const tbody = $('#themeCategoriesBody');
		if (!tbody) return;
		if (!items.length) {
			tbody.innerHTML = `<tr class="no-data"><td colspan="5"><i class=\"fas fa-tags\"></i><p>هیچ دسته‌ای یافت نشد</p></td></tr>`;
			return;
		}
		tbody.innerHTML = '';
		items.forEach(function(cat) { tbody.appendChild(renderRow(cat)); });
		bindRowActions();
	}

	function renderRow(cat) {
		const tr = document.createElement('tr');
		tr.dataset.id = cat.id;
		tr.innerHTML = `
			<td>${cat.name}</td>
			<td>${cat.slug}</td>
			<td>${cat.parent_name || '-'}</td>
			<td>${cat.description || '-'}</td>
			<td class="action-buttons">
				<button class="btn-icon btn-edit" title="ویرایش"><i class="fas fa-edit"></i></button>
				<button class="btn-icon btn-delete" title="حذف"><i class="fas fa-trash"></i></button>
			</td>`;
		return tr;
	}

	function fillParentOptions(items) {
		const select = document.getElementById('catParent');
		if (!select) return;
		const current = select.value;
		select.innerHTML = '';
		const optNone = document.createElement('option');
		optNone.value = '';
		optNone.textContent = 'بدون والد';
		select.appendChild(optNone);
		(items || []).forEach(function(cat) {
			const opt = document.createElement('option');
			opt.value = String(cat.id);
			opt.textContent = cat.name;
			select.appendChild(opt);
		});
		if (current) select.value = current;
	}

	function bindRowActions() {
		$all('#themeCategoriesBody .btn-edit').forEach(function(btn){
			btn.onclick = function() {
				const tr = btn.closest('tr');
				const id = tr.dataset.id;
				const tds = tr.querySelectorAll('td');
				// Prefill
				(document.getElementById('catName') || {}).value = tds[0].textContent.trim();
				(document.getElementById('catSlug') || {}).value = tds[1].textContent.trim();
				// parent set later via loadCategories -> fillParentOptions
				(document.getElementById('catDesc') || {}).value = tds[3].textContent.trim() === '-' ? '' : tds[3].textContent.trim();
				editingId = id;
				$('#modalTitle').textContent = 'ویرایش دسته';
				open();
			};
		});
		$all('#themeCategoriesBody .btn-delete').forEach(function(btn){
			btn.onclick = async function() {
				const tr = btn.closest('tr');
				const id = tr.dataset.id;
				if (!confirm('حذف این دسته قطعی است؟')) return;
				try {
					const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE', headers: adminHeaders() });
					if (!res.ok) throw new Error('delete failed');
					tr.remove();
					if (window.showNotification) window.showNotification('دسته حذف شد', 'success');
				} catch (e) {
					if (window.showNotification) window.showNotification('حذف با خطا مواجه شد', 'error');
				}
			};
		});
	}

	function resetForm() {
		editingId = null;
		$('#modalTitle').textContent = 'افزودن دسته';
		['catName','catSlug','catDesc'].forEach(function(id){ const el = document.getElementById(id); if (el) el.value = ''; });
		const parentSel = document.getElementById('catParent');
		if (parentSel) parentSel.value = '';
	}

	function bindEvents() {
		const openBtn = document.getElementById('openAddCategoryModal');
		if (openBtn) openBtn.addEventListener('click', function() { resetForm(); open(); });

		const form = document.getElementById('addThemeCategoryForm');
		if (form) form.addEventListener('submit', async function(e) {
			e.preventDefault();
			const name = (document.getElementById('catName') || {}).value || '';
			const slug = (document.getElementById('catSlug') || {}).value || '';
			const desc = (document.getElementById('catDesc') || {}).value || '';
			const parentSel = document.getElementById('catParent');
			const parent_id = parentSel && parentSel.value ? Number(parentSel.value) : null;

			if (!name.trim() || !slug.trim()) {
				return window.showNotification && window.showNotification('نام و نامک الزامی است', 'error');
			}

			try {
				const payload = { name: name.trim(), slug: slug.trim(), description: desc.trim() || undefined, parent_id };
				let res;
				if (editingId) {
					res = await fetch(`${API_BASE}/${editingId}`, { method: 'PUT', headers: adminHeaders(), body: JSON.stringify(payload) });
				} else {
					res = await fetch(API_BASE, { method: 'POST', headers: adminHeaders(), body: JSON.stringify(payload) });
				}
				if (!res.ok) throw new Error('save failed');
				close();
				await loadCategories();
				if (window.showNotification) window.showNotification('دسته ذخیره شد', 'success');
			} catch (err) {
				if (window.showNotification) window.showNotification('ذخیره با خطا مواجه شد', 'error');
			}
		});

		const search = document.getElementById('categorySearch');
		if (search) search.addEventListener('input', function(){
			const q = search.value.trim();
			$all('#themeCategoriesBody tr').forEach(function(row){
				if (row.classList.contains('no-data')) return;
				const name = row.children[0].textContent;
				row.style.display = !q || name.includes(q) ? '' : 'none';
			});
		});
	}

	document.addEventListener('DOMContentLoaded', function(){
		bindEvents();
		loadCategories();
	});
})();


