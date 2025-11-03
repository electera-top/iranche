(function(){
	const API_BASE = 'http://localhost:3000/api';

	function authHeaders(){
		const t = localStorage.getItem('ADMIN_TOKEN');
		const h = { 'Content-Type':'application/json' };
		if (t) h['Authorization'] = 'Bearer ' + t;
		return h;
	}

    async function ensureModalInjected() {
        if (document.getElementById('filePickerModal')) return;
        // Inject full modal markup inline to avoid file:// CORS issues
        const el = document.createElement('div');
        el.id = 'filePickerModal';
        el.className = 'modal-overlay';
        el.style.display = 'none';
        el.innerHTML = [
            '<div class="modal" style="max-width:980px;width:96%;">',
            '  <div class="modal-header">',
            '    <h3>انتخاب فایل</h3>',
            '    <button class="modal-close" data-fp-close><i class="fas fa-times"></i></button>',
            '  </div>',
            '  <div class="modal-body">',
            '    <div class="filters-section" style="margin-bottom:16px;">',
            '      <div class="filter-group">',
            '        <label>نوع فایل</label>',
            '        <select id="fpType">',
            '          <option value="">همه</option>',
            '          <option value="image">تصویر</option>',
            '          <option value="document">سند</option>',
            '          <option value="video">ویدیو</option>',
            '          <option value="audio">صوت</option>',
            '          <option value="archive">آرشیو</option>',
            '          <option value="other">سایر</option>',
            '        </select>',
            '      </div>',
            '      <div class="filter-group">',
            '        <label>مرتب‌سازی</label>',
            '        <select id="fpSort">',
            '          <option value="created_at_desc">جدیدترین</option>',
            '          <option value="created_at_asc">قدیمی‌ترین</option>',
            '          <option value="name_asc">نام (الف-ی)</option>',
            '          <option value="name_desc">نام (ی-الف)</option>',
            '          <option value="size_desc">بزرگ‌ترین</option>',
            '          <option value="size_asc">کوچک‌ترین</option>',
            '        </select>',
            '      </div>',
            '      <div class="filter-group">',
            '        <label>جستجو</label>',
            '        <input type="text" id="fpSearch" placeholder="نام فایل...">',
            '      </div>',
            '      <div class="filter-group">',
            '        <label>&nbsp;</label>',
            '        <button class="btn btn-secondary" id="fpApply">اعمال فیلتر</button>',
            '      </div>',
            '    </div>',
            '    <div class="table-container">',
            '      <table class="data-table">',
            '        <thead><tr><th>انتخاب</th><th>نام</th><th>نوع</th><th>حجم</th><th>دسته‌بندی</th><th>تاریخ</th></tr></thead>',
            '        <tbody id="fpTableBody"><tr class="loading"><td colspan="6"><i class="fas fa-spinner fa-spin"></i> در حال بارگذاری...</td></tr></tbody>',
            '      </table>',
            '    </div>',
            '    <div class="pagination" id="fpPagination" style="margin-top:12px;"></div>',
            '    <div class="form-actions" style="margin-top:16px;">',
            '      <button class="btn btn-outline" data-fp-close>انصراف</button>',
            '      <button class="btn btn-primary" id="fpConfirm">انتخاب</button>',
            '    </div>',
            '  </div>',
            '</div>',
            '<style>#filePickerModal .selected-row{background:rgba(59,130,246,0.1);}</style>'
        ].join('');
        document.body.appendChild(el);
    }

	async function fetchFiles({ page=1, limit=10, file_type='', search='', sort='created_at_desc' }){
		const params = new URLSearchParams();
		params.append('page', String(page));
		params.append('limit', String(limit));
		if (file_type) params.append('file_type', file_type);
		if (search) params.append('search', search);
		// Sorting: map to backend-supported fields
		// As fallback, backend orders by created_at desc
		const url = `${API_BASE}/files?${params.toString()}`;
		const res = await fetch(url, { headers: authHeaders() });
		if (!res.ok) throw new Error('files load failed');
		return await res.json();
	}

	function formatSize(bytes){
		if (!bytes && bytes !== 0) return '-';
		const k = 1024; const sizes = ['B','KB','MB','GB'];
		const i = Math.floor(Math.log(bytes)/Math.log(k));
		return (bytes/Math.pow(k,i)).toFixed(2)+' '+sizes[i];
	}

    function renderTable(rows, opts){
		const tbody = document.getElementById('fpTableBody');
		if (!tbody) return;
		if (!rows || !rows.length){
			tbody.innerHTML = '<tr class="no-data"><td colspan="6"><i class="fas fa-folder-open"></i> فایلی یافت نشد</td></tr>';
			return;
		}
		tbody.innerHTML='';
		rows.forEach(function(f){
			const tr = document.createElement('tr');
            const isImage = String(f.file_type||'') === 'image';
            const thumb = isImage && f.storage_path ? `<img src="https://files.iranche.com/${f.storage_path}" alt="thumb" style="width:40px;height:40px;object-fit:cover;border-radius:4px;" onerror="this.style.display='none'">` : '<i class="fas fa-file"></i>';
            tr.innerHTML = `
                <td><input type="${opts.multi? 'checkbox':'radio'}" name="fp-select"></td>
                <td><div style="display:flex;align-items:center;gap:8px;">${thumb}<span>${f.original_name}</span></div></td>
                <td>${f.file_type}</td>
                <td>${formatSize(f.file_size)}</td>
                <td>${f.category || '-'}</td>
                <td>${new Date(f.created_at).toLocaleDateString('fa-IR')}</td>
            `;
			tr.dataset.id = String(f.id);
			tr.dataset.payload = JSON.stringify(f);
			tbody.appendChild(tr);
		});
	}

	async function open(options){
		await ensureModalInjected();
		const modal = document.getElementById('filePickerModal');
		if (!modal) return;
		const multi = !!options.multi;
		const type = options.type || '';
		const onSelect = typeof options.onSelect === 'function' ? options.onSelect : function(){};

		modal.style.display = 'flex';
		const closeEls = modal.querySelectorAll('[data-fp-close]');
		closeEls.forEach(el=> el.addEventListener('click', ()=>{ modal.style.display='none'; }));

		const fpType = document.getElementById('fpType');
		if (fpType) fpType.value = type || '';
		let state = { page:1, limit:10, file_type:type||'', search:'', sort:'created_at_desc', multi };

		async function reload(){
			try {
				const json = await fetchFiles(state);
				renderTable(json.data?.files || [], state);
			} catch(e){
				const tbody = document.getElementById('fpTableBody');
				if (tbody) tbody.innerHTML = '<tr class="no-data"><td colspan="6">خطا در بارگذاری</td></tr>';
			}
		}

		const applyBtn = document.getElementById('fpApply');
		if (applyBtn) applyBtn.onclick = function(){
			if (fpType) state.file_type = fpType.value;
			const s = document.getElementById('fpSearch');
			if (s) state.search = s.value.trim();
			const sort = document.getElementById('fpSort');
			if (sort) state.sort = sort.value;
			reload();
		};

		const confirmBtn = document.getElementById('fpConfirm');
		if (confirmBtn) confirmBtn.onclick = function(){
			const rows = Array.from(document.querySelectorAll('#fpTableBody tr'));
			const selected = [];
			rows.forEach(r=>{
				const inp = r.querySelector('input[type="checkbox"], input[type="radio"]');
				if (inp && inp.checked){
					try { selected.push(JSON.parse(r.dataset.payload||'{}')); } catch{}
				}
			});
			if (!multi && selected.length>1) selected.splice(1);
			modal.style.display='none';
			onSelect(selected);
		};

		reload();
	}

	window.FilePicker = { open };
})();


