// components/create-note-modal.js

(function () {
    const modalHTML = `
    <div id="create-modal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm hidden opacity-0 transition-all duration-300">
        <div class="glass-card w-full max-w-2xl p-6 md:p-8 relative transform scale-95 transition-all duration-300" id="modal-content" style="background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-lg);">
            <button id="close-modal-btn" type="button" class="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <header class="mb-6">
                <h2 class="text-2xl font-bold">Niêm phong ký ức ✍️</h2>
                <p class="text-sm opacity-60 italic">Gửi gắm tâm tư vào dòng thời gian...</p>
            </header>
            <form id="note-form" class="space-y-4">
                <input type="text" id="title" required class="w-full p-4 rounded-xl input-style font-semibold" placeholder="Tiêu đề lời nhắn...">
                <textarea id="content" rows="4" required class="w-full p-4 rounded-xl input-style leading-relaxed" placeholder="Bạn muốn nhắn nhủ điều gì?"></textarea>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[10px] font-bold text-indigo-500 uppercase mb-1 ml-1">Ngày mở (Unlock)</label>
                        <input type="datetime-local" id="availableAt" required class="w-full p-3 rounded-xl input-style text-sm">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-indigo-500 uppercase mb-1 ml-1">Email người nhận</label>
                        <input type="email" id="recipientEmail" class="w-full p-3 rounded-xl input-style text-sm" placeholder="Trống nếu gửi cho mình">
                    </div>
                </div>
                <label class="flex items-center justify-center w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all">
                    <span id="file-status" class="text-sm opacity-60">🖼️ Đính kèm ảnh kỷ niệm</span>
                    <input type="file" id="image-input" accept="image/*" class="hidden" />
                </label>
                <button type="submit" id="submit-btn" class="btn-primary w-full py-4 flex items-center justify-center gap-3">
                    <span id="btn-icon">🚀</span>
                    <span id="btn-text">Khóa vào dòng thời gian</span>
                </button>
            </form>
        </div>
    </div>`;

    // Hàm khởi tạo - Đảm bảo body đã sẵn sàng
    function initModal() {
        if (!document.getElementById('create-modal')) {
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            setupEventListeners();
        }
    }

    // Đưa hàm ra phạm vi toàn cục (global) để nút bấm có thể gọi
    window.toggleModal = function (show) {
        const modal = document.getElementById('create-modal');
        const content = document.getElementById('modal-content');
        if (!modal) return;

        if (show) {
            modal.classList.remove('hidden');
            setTimeout(() => { modal.classList.add('opacity-100'); content.classList.add('scale-100'); }, 10);
        } else {
            modal.classList.remove('opacity-100'); content.classList.remove('scale-100');
            setTimeout(() => { modal.classList.add('hidden'); }, 300);
        }
    };

    function setupEventListeners() {
        document.getElementById('close-modal-btn').onclick = () => toggleModal(false);

        const fileInput = document.getElementById('image-input');
        fileInput.onchange = function () {
            const status = document.getElementById('file-status');
            if (this.files[0]) status.innerHTML = `✅ <b>${this.files[0].name}</b>`;
        };

        document.getElementById('note-form').onsubmit = async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            const btnIcon = document.getElementById('btn-icon');
            const btnText = document.getElementById('btn-text');
            const token = localStorage.getItem('token');

            if (!token) return alert('Vui lòng đăng nhập lại!');

            const formData = new FormData();
            formData.append('title', document.getElementById('title').value);
            formData.append('content', document.getElementById('content').value);
            formData.append('availableAt', document.getElementById('availableAt').value);
            formData.append('recipientEmail', document.getElementById('recipientEmail').value);

            const fileInput = document.getElementById('image-input');
            if (fileInput.files[0]) {
                formData.append('image', fileInput.files[0]);
            }

            try {
                btn.disabled = true;
                btnIcon.innerText = '⌛';
                btnText.innerText = 'Đang niêm phong...';

                const response = await fetch('/api/notes', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    alert('🚀 Đã lưu lời nhắn cho tương lai thành công!');
                    toggleModal(false);
                    document.getElementById('note-form').reset();
                    document.getElementById('file-status').innerHTML = '🖼️ Đính kèm ảnh kỷ niệm';

                    // Reload data based on current page
                    if (typeof fetchStats === 'function') fetchStats();
                    if (typeof loadNotes === 'function') loadNotes();
                } else {
                    alert('❌ Lỗi: ' + (data.error || data.message || 'Không thể tạo lời nhắn'));
                }
            } catch (error) {
                console.error('Lỗi khi gửi:', error);
                alert('⚠️ Lỗi kết nối máy chủ!');
            } finally {
                btn.disabled = false;
                btnIcon.innerText = '🚀';
                btnText.innerText = 'Khóa vào dòng thời gian';
            }
        };
    }

    // Chạy khi DOM đã sẵn sàng
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initModal);
    } else {
        initModal();
    }
})();