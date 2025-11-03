(function(){
	function $(s){ return document.querySelector(s); }
	function $all(s){ return document.querySelectorAll(s); }
	const API_BASE = 'http://localhost:3000/api';

	function showModal(){ const o=$('#modalOverlay'); if(o) o.classList.add('active'); }
	function hideModal(){ const o=$('#modalOverlay'); if(o) o.classList.remove('active'); }
	window.closeModal = hideModal;

	function authHeaders(){
		const t = localStorage.getItem('ADMIN_TOKEN');
		const h = { 'Content-Type': 'application/json' };
		if (t) h['Authorization'] = 'Bearer ' + t;
		return h;
	}

	function renderList(items){
		const tbody = $('#catsTableBody');
		if (!tbody) return;
		if (!items || !items.length){
			tbody.innerHTML = '<tr class="no-data"><td colspan="5"><i class="fas fa-tags"></i><p>هنوز دسته‌ای ثبت نشده است</p></td></tr>';
			return;
		}
		tbody.innerHTML = '';
		items.forEach(function(c){
			const tr = document.createElement('tr');
			tr.innerHTML = `
				<td>${c.name}</td>
				<td>${c.slug}</td>
				<td>${c.parent_name || '-'}</td>
				<td>${c.description || ''}</td>
				<td class="action-buttons">
					<button class="btn-icon btn-edit" data-id="${c.id}" title="ویرایش"><i class="fas fa-edit"></i></button>
					<button class="btn-icon btn-delete" data-id="${c.id}" title="حذف"><i class="fas fa-trash"></i></button>
				</td>
			`;
			tbody.appendChild(tr);
		});

		$all('.btn-edit').forEach(function(btn){
			btn.onclick = function(){ openEdit(btn.getAttribute('data-id')); };
		});
		$all('.btn-delete').forEach(function(btn){
			btn.onclick = async function(){
				const id = btn.getAttribute('data-id');
				if (!confirm('حذف این دسته قطعی است؟')) return;
				try{
					const res = await fetch(`${API_BASE}/plugin-categories/${id}`, { method:'DELETE', headers: authHeaders() });
					if (!res.ok) throw 0;
					await loadList();
					if (window.showNotification) window.showNotification('دسته حذف شد','success');
				}catch(e){ if (window.showNotification) window.showNotification('خطا در حذف دسته','error'); }
			};
		});
	}

	async function loadParents(selectedId){
		const sel = $('#catParent'); if (!sel) return;
		sel.innerHTML = '<option value="">بدون والد</option>';
		try{
			const res = await fetch(`${API_BASE}/plugin-categories`, { headers: authHeaders() });
			if (!res.ok) throw 0;
			const json = await res.json();
			(json.data || []).forEach(function(cat){
				const opt = document.createElement('option');
				opt.value = String(cat.id);
				opt.textContent = cat.name;
				sel.appendChild(opt);
			});
			if (selectedId) sel.value = String(selectedId);
		}catch(e){ /* noop */ }
	}

	async function loadList(){
		try{
			const res = await fetch(`${API_BASE}/plugin-categories`, { headers: authHeaders() });
			if (!res.ok) throw 0;
			const json = await res.json();
			renderList(json.data || []);
		}catch(e){ /* noop */ }
	}

	async function openEdit(id){
		try{
			const res = await fetch(`${API_BASE}/plugin-categories`, { headers: authHeaders() });
			if (!res.ok) throw 0;
			const list = (await res.json()).data || [];
			const item = list.find(function(x){ return String(x.id) === String(id); });
			if (!item) throw 0;
			const form = $('#catForm'); if (!form) return;
			let hidden = document.getElementById('editingCatId');
			if (!hidden){ hidden = document.createElement('input'); hidden.type='hidden'; hidden.id='editingCatId'; form.appendChild(hidden); }
			hidden.value = String(item.id);
			$('#modalTitle').textContent = 'ویرایش دسته افزونه';
			$('#catName').value = item.name || '';
			$('#catSlug').value = item.slug || '';
			$('#catDesc').value = item.description || '';
			await loadParents(item.parent_id || '');
			showModal();
		}catch(e){ if (window.showNotification) window.showNotification('خطا در بارگذاری دسته','error'); }
	}

	function bind(){
		const openBtn = $('#openAddCatModal');
		if (openBtn) openBtn.addEventListener('click', async function(){
			$('#modalTitle').textContent = 'افزودن دسته افزونه';
			const editing = document.getElementById('editingCatId'); if (editing) editing.remove();
			$('#catForm').reset();
			await loadParents();
			showModal();
		});

		const form = $('#catForm');
		if (form){
			form.addEventListener('submit', async function(e){
				e.preventDefault();
				const payload = {
					name: $('#catName').value.trim(),
					slug: $('#catSlug').value.trim(),
					description: $('#catDesc').value.trim() || null,
					parent_id: $('#catParent').value ? Number($('#catParent').value) : null
				};
				if (!payload.name || !payload.slug){
					return window.showNotification && window.showNotification('نام و نامک الزامی است','error');
				}
				try{
					const editingEl = document.getElementById('editingCatId');
					const id = editingEl && editingEl.value ? editingEl.value : '';
					let res;
					if (id){
						res = await fetch(`${API_BASE}/plugin-categories/${id}`, { method:'PUT', headers: authHeaders(), body: JSON.stringify(payload) });
					}else{
						res = await fetch(`${API_BASE}/plugin-categories`, { method:'POST', headers: authHeaders(), body: JSON.stringify(payload) });
					}
					if (!res.ok) throw 0;
					hideModal();
					await loadList();
					if (window.showNotification) window.showNotification(id ? 'دسته ویرایش شد' : 'دسته با موفقیت ایجاد شد','success');
				}catch(err){ if (window.showNotification) window.showNotification('ثبت/ویرایش دسته با خطا مواجه شد','error'); }
			});
		}

		const search = $('#catSearch');
		if (search){
			search.addEventListener('input', function(){
				const q = (search.value || '').trim();
				const rows = document.querySelectorAll('#catsTableBody tr');
				rows.forEach(function(row){
					if (row.classList.contains('no-data')) return;
					const name = row.children[0].textContent;
					row.style.display = !q || name.includes(q) ? '' : 'none';
				});
			});
		}
	}

	document.addEventListener('DOMContentLoaded', function(){
		if (window.adminCommon) adminCommon.ensureAuth();
		bind();
		loadParents();
		loadList();
	});
})();

(function() {
	function $(s) { return document.querySelector(s); }
	function close() { const o = $('#modalOverlay'); if (o) o.classList.remove('active'); }
	window.closeModal = close;
	function open() { const o = $('#modalOverlay'); if (o) o.classList.add('active'); }

	function addRow(cat) {
		const tbody = $('#pluginCategoriesBody');
		if (!tbody) return;
		const noData = tbody.querySelector('.no-data');
		if (noData) noData.remove();
		const tr = document.createElement('tr');
		tr.innerHTML = `
			<td>${cat.name}</td>
			<td>${cat.slug}</td>
			<td>${cat.parentName || '-'}</td>
			<td>${cat.desc || '-'}</td>
			<td class="action-buttons">
				<button class="btn-icon" title="ویرایش"><i class="fas fa-edit"></i></button>
				<button class="btn-icon" title="حذف"><i class="fas fa-trash"></i></button>
			</td>`;
		tbody.appendChild(tr);
	}

	function bindEvents() {
		const openBtn = document.getElementById('openAddPluginCategoryModal');
		if (openBtn) openBtn.addEventListener('click', function(){ open(); });

		const form = document.getElementById('addPluginCategoryForm');
		if (form) form.addEventListener('submit', function(e){
			e.preventDefault();
			const name = (document.getElementById('pluginCatName') || {}).value || '';
			const slug = (document.getElementById('pluginCatSlug') || {}).value || '';
			const desc = (document.getElementById('pluginCatDesc') || {}).value || '';
			const parentSel = document.getElementById('pluginCatParent');
			const parentName = parentSel && parentSel.value ? (parentSel.options[parentSel.selectedIndex] || {}).text : '';
			if (!name.trim() || !slug.trim()) {
				return window.showNotification && window.showNotification('نام و نامک الزامی است', 'error');
			}
			addRow({ name: name.trim(), slug: slug.trim(), desc: desc.trim(), parentName });
			close();
			if (window.showNotification) window.showNotification('دسته با موفقیت ذخیره شد', 'success');
		});

		const search = document.getElementById('pluginCategorySearch');
		if (search) search.addEventListener('input', function(){
			const q = search.value.trim();
			document.querySelectorAll('#pluginCategoriesBody tr').forEach(function(row){
				if (row.classList.contains('no-data')) return;
				const name = row.children[0].textContent;
				row.style.display = !q || name.includes(q) ? '' : 'none';
			});
		});
	}

	document.addEventListener('DOMContentLoaded', bindEvents);
})();


