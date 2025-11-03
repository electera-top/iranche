(function(){
	const API_BASE = 'http://localhost:3000/api/staff';
	function $(s){ return document.querySelector(s); }
	function $all(s){ return document.querySelectorAll(s); }
	function headers(){ const h = { 'Content-Type':'application/json' }; const t = localStorage.getItem('ADMIN_TOKEN'); if (t) h['Authorization'] = 'Bearer ' + t; return h; }

	function show(){ const o = $('#modalOverlay'); if (o) o.classList.add('active'); }
	window.closeModal = function(){ const o = $('#modalOverlay'); if (o) o.classList.remove('active'); };

	function renderList(items){
		const tbody = $('#staffTableBody');
		if (!tbody) return;
		if (!items.length){
			tbody.innerHTML = `<tr class="no-data"><td colspan="7"><i class=\"fas fa-users\"></i><p>کارمندی ثبت نشده است</p></td></tr>`;
			return;
		}
		tbody.innerHTML = '';
		items.forEach(function(s){
			const tr = document.createElement('tr');
			tr.dataset.id = s.id;
			tr.innerHTML = `
				<td>${s.first_name || ''}</td>
				<td>${s.last_name || ''}</td>
				<td>${s.username}</td>
				<td>${s.email}</td>
				<td>${roleLabel(s.role)}</td>
				<td><span class="status-badge ${s.is_active? 'status-active':'status-inactive'}">${s.is_active? 'فعال':'غیرفعال'}</span></td>
				<td class="action-buttons">
					<button class="btn-icon btn-edit" title="ویرایش"><i class="fas fa-edit"></i></button>
					<button class="btn-icon btn-delete" title="حذف"><i class="fas fa-trash"></i></button>
				</td>`;
			tbody.appendChild(tr);
		});
		bindRowActions();
	}

	function roleLabel(r){
		if (r === 'super_admin') return 'سوپر ادمین';
		if (r === 'moderator') return 'اپراتور';
		return 'مدیر';
	}

	async function loadStaff(){
		try {
			const res = await fetch(API_BASE, { headers: headers() });
			if (!res.ok) throw new Error('load failed');
			const json = await res.json();
			renderList(json.data || []);
		} catch(e){
			console.error(e);
		}
	}

	function bindRowActions(){
		$all('#staffTableBody .btn-delete').forEach(function(btn){
			btn.onclick = async function(){
				const tr = btn.closest('tr'); const id = tr.dataset.id;
				if (!confirm('حذف این کارمند قطعی است؟')) return;
				try { const r = await fetch(`${API_BASE}/${id}`, { method:'DELETE', headers: headers() }); if (!r.ok) throw 0; tr.remove(); if (window.showNotification) showNotification('حذف شد', 'success'); } catch(err){ if (window.showNotification) showNotification('خطا در حذف', 'error'); }
			};
		});
		$all('#staffTableBody .btn-edit').forEach(function(btn){
			btn.onclick = function(){
				const tr = btn.closest('tr'); const id = tr.dataset.id; const t = tr.querySelectorAll('td');
				document.getElementById('first_name').value = t[0].textContent.trim();
				document.getElementById('last_name').value = t[1].textContent.trim();
				document.getElementById('username').value = t[2].textContent.trim();
				document.getElementById('email').value = t[3].textContent.trim();
				document.getElementById('role').value = tr.querySelector('.status-badge') ? (tr.children[4].textContent.includes('سوپر')?'super_admin': (tr.children[4].textContent.includes('اپراتور')?'moderator':'admin')) : 'admin';
				document.getElementById('password').value = '';
				document.getElementById('national_id').value = '';
				document.getElementById('phone').value = '';
				document.getElementById('is_active').checked = tr.children[5].textContent.includes('فعال');
				$('#modalTitle').textContent = 'ویرایش کارمند';
				show();
				$('#addStaffForm').dataset.editingId = id;
			};
		});
	}

	document.addEventListener('DOMContentLoaded', function(){
		if (window.adminCommon) adminCommon.ensureAuth();
		loadStaff();
		const openBtn = document.getElementById('openAddStaffModal');
		if (openBtn) openBtn.addEventListener('click', function(){
			$('#modalTitle').textContent = 'افزودن کارمند';
			$('#addStaffForm').reset();
			$('#addStaffForm').dataset.editingId = '';
			show();
		});
		const form = document.getElementById('addStaffForm');
		if (form) form.addEventListener('submit', async function(e){
			e.preventDefault();
			const payload = {
				first_name: document.getElementById('first_name').value.trim(),
				last_name: document.getElementById('last_name').value.trim(),
				national_id: document.getElementById('national_id').value.trim(),
				phone: document.getElementById('phone').value.trim(),
				username: document.getElementById('username').value.trim(),
				email: document.getElementById('email').value.trim(),
				password: document.getElementById('password').value,
				role: document.getElementById('role').value,
				is_active: document.getElementById('is_active').checked
			};
			const editingId = form.dataset.editingId;
			try {
				let res;
				if (editingId) {
					// For edit, omit empty password and national/phone if blank
					const editPayload = { ...payload };
					if (!editPayload.password) delete editPayload.password;
					if (!editPayload.national_id) delete editPayload.national_id;
					if (!editPayload.phone) delete editPayload.phone;
					res = await fetch(`${API_BASE}/${editingId}`, { method:'PUT', headers: headers(), body: JSON.stringify(editPayload) });
				} else {
					res = await fetch(API_BASE, { method:'POST', headers: headers(), body: JSON.stringify(payload) });
				}
				if (!res.ok) throw new Error('save failed');
				closeModal();
				await loadStaff();
				if (window.showNotification) showNotification('ذخیره شد', 'success');
			} catch (err) { if (window.showNotification) showNotification('خطا در ذخیره', 'error'); }
		});
		const search = document.getElementById('staffSearch');
		if (search) search.addEventListener('input', function(){
			const q = search.value.trim();
			$all('#staffTableBody tr').forEach(function(row){
				if (row.classList.contains('no-data')) return;
				const name = (row.children[0].textContent + ' ' + row.children[1].textContent + ' ' + row.children[2].textContent).trim();
				row.style.display = !q || name.includes(q) ? '' : 'none';
			});
		});
	});
})();


