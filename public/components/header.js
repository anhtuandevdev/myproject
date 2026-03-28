(function initTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const username = user.name || 'Thành viên';

    const headerHTML = `
    <header class="fixed top-0 left-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg z-[100] border-b border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div class="max-w-full mx-auto px-4 md:px-8 h-16 flex justify-between items-center text-slate-900 dark:text-white">
            
            <div class="flex items-center gap-3 cursor-pointer group" onclick="window.location.href='index.html'">
                <div class="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                    <span class="text-white text-lg">🔔</span>
                </div>
                <span class="text-xl font-bold tracking-tighter">TimeCapsule</span>
            </div>

            <div class="relative">
                <button id="user-menu-btn" class="flex items-center gap-3 pl-4 pr-2 py-1.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-95">
                    <span class="text-sm font-semibold">
                        Chào mừng, <span class="text-indigo-600 dark:text-indigo-400 font-bold">${username}</span>
                    </span>
                    <div class="w-8 h-8 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-600 shadow-sm">
                        <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </div>
                </button>

                <div id="user-dropdown" class="hidden absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 py-1.5 overflow-hidden ring-1 ring-black ring-opacity-5">
                    <a href="profile.html" class="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition">👤 Hồ sơ cá nhân</a>
                    <a href="settings.html" class="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition">⚙️ Cài đặt hệ thống</a>
                    <div class="h-px bg-slate-100 dark:bg-slate-700 my-1 mx-2"></div>
                    <button id="logout-btn-header" class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition text-left">🚪 Thoát tài khoản</button>
                </div>
            </div>
        </div>
    </header>
    <div class="h-16"></div>
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    const btn = document.getElementById('user-menu-btn');
    const dropdown = document.getElementById('user-dropdown');
    if (btn && dropdown) {
        btn.onclick = (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('hidden');
        };
        document.onclick = () => dropdown.classList.add('hidden');
    }

    const logoutBtn = document.getElementById('logout-btn-header');
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            localStorage.clear();
            window.location.href = 'login.html';
        };
    }
});