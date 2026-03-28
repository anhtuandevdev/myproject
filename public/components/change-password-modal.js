(function () {
    const modalHTML = `
    <div id="password-modal" class="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-sm hidden flex items-center justify-center p-4 opacity-0 transition-opacity duration-300">
        <div id="password-modal-content" class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 transform scale-95 transition-all duration-300">
            <div class="flex items-center gap-4 mb-6">
                <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-2xl">🔐</div>
                <div>
                   <h3 class="text-xl font-bold dark:text-white">Thay đổi mật mã</h3>
                   <p class="text-xs opacity-50 dark:text-slate-400">Cập nhật khóa an toàn mới cho cỗ máy.</p>
                </div>
            </div>

            <form id="change-pass-form" class="space-y-4">
                <div>
                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Mật khẩu hiện tại</label>
                    <input type="password" id="old-pass" required placeholder="••••••••" 
                           class="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none font-semibold text-slate-900 dark:text-white transition-all">
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Mật khẩu mới</label>
                    <input type="password" id="new-pass" required placeholder="••••••••" 
                           class="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none font-semibold text-slate-900 dark:text-white transition-all">
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Xác nhận mật khẩu mới</label>
                    <input type="password" id="confirm-pass" required placeholder="••••••••" 
                           class="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 outline-none font-semibold text-slate-900 dark:text-white transition-all">
                </div>
                
                <div class="flex gap-4 pt-6">
                    <button type="button" id="close-pass-btn" class="flex-1 py-4 font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white transition">Hủy bỏ</button>
                    <button type="submit" id="submit-pass-btn" 
                            class="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95">
                        Lưu thay đổi
                    </button>
                </div>
            </form>
        </div>
    </div>`;

    function initPasswordModal() {
        if (!document.getElementById('password-modal')) {
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            setupListeners();
        }
    }

    function setupListeners() {
        const modal = document.getElementById('password-modal');
        const content = document.getElementById('password-modal-content');
        const form = document.getElementById('change-pass-form');

        window.togglePasswordModal = function (show) {
            if (show) {
                modal.classList.remove('hidden');
                setTimeout(() => {
                    modal.classList.add('opacity-100');
                    content.classList.add('scale-100');
                }, 10);
            } else {
                modal.classList.remove('opacity-100');
                content.classList.remove('scale-100');
                setTimeout(() => modal.classList.add('hidden'), 300);
                form.reset();
            }
        };

        modal.onclick = (e) => {
            if (e.target.id === 'password-modal') togglePasswordModal(false);
        };

        document.getElementById('close-pass-btn').onclick = () => togglePasswordModal(false);

        form.onsubmit = async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('token');
            const oldPassword = document.getElementById('old-pass').value;
            const newPassword = document.getElementById('new-pass').value;
            const confirmPassword = document.getElementById('confirm-pass').value;
            const btn = document.getElementById('submit-pass-btn');

            if (!token) return alert('Vui lòng đăng nhập lại!');

            if (newPassword !== confirmPassword) {
                return alert('⚠️ Mật khẩu xác nhận không khớp!');
            }

            try {
                btn.disabled = true;
                btn.innerText = "Đang xử lý...";
                
                const res = await fetch('/api/auth/change-password', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ oldPassword, newPassword })
                });
                
                const data = await res.json();
                
                if (res.ok) {
                    alert('✅ Đã cập nhật mật mã thành công!');
                    togglePasswordModal(false);
                } else {
                    alert('❌ ' + (data.message || 'Lỗi đổi mật khẩu!'));
                }
            } catch (err) {
                alert('⚠️ Lỗi kết nối hệ thống!');
            } finally {
                btn.disabled = false;
                btn.innerText = "Lưu thay đổi";
            }
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPasswordModal);
    } else {
        initPasswordModal();
    }
})();
