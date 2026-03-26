document.addEventListener('DOMContentLoaded', () => {
    // Lấy tên từ localStorage
    const username = localStorage.getItem('username') || 'Thành viên';

    const headerHTML = `
    <header class="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-lg z-[100] border-b border-slate-100 shadow-sm">
        <div class="max-w-full mx-auto px-4 md:px-8 h-16 flex justify-between items-center">

            <div class="flex items-center gap-3 cursor-pointer group" onclick="window.location.href='index.html'">
                <div class="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200 transition-transform group-hover:scale-110">
                    <span class="text-white text-lg">🔔</span>
                </div>
                <span class="text-xl font-bold text-slate-800 tracking-tighter">TimeCapsule</span>
            </div>

            <div class="relative">
                <button id="user-menu-btn" class="flex items-center gap-3 pl-4 pr-2 py-1.5 bg-slate-50/50 border border-slate-200 rounded-full hover:bg-white hover:shadow-md transition-all active:scale-95">
                    <span class="text-sm font-semibold text-slate-600">
                        Chào mừng trở lại, <span class="text-indigo-600 font-bold">${username}</span>
                    </span>
                    <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm">
                        <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </div>
                </button>

                <div id="user-dropdown" class="hidden absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-slate-100 py-1.5 overflow-hidden ring-1 ring-black ring-opacity-5 animate-in fade-in slide-in-from-top-2">
                    <a href="profile.html" class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition">
                        <span>👤</span> Hồ sơ cá nhân
                    </a>
                    <a href="settings.html" class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition">
                        <span>⚙️</span> Cài đặt hệ thống
                    </a>
                    <div class="h-px bg-slate-100 my-1 mx-2"></div>
                    <button id="logout-btn" class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-bold transition">
                        <span>🚪</span> Thoát tài khoản
                    </button>
                </div>
            </div>
        </div>
    </header>
    <div class="h-16"></div>
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // Logic toggle dropdown
    const btn = document.getElementById('user-menu-btn');
    const dropdown = document.getElementById('user-dropdown');

    if (btn && dropdown) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('hidden');
        });

        // Đóng dropdown khi click ra ngoài
        document.addEventListener('click', () => {
            dropdown.classList.add('hidden');
        });
    }

    // Logic đăng xuất
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('user'); // Xóa thêm key user cho sạch
            window.location.href = 'login.html';
        });
    }
});