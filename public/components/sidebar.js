(function initSidebar() {
    document.addEventListener('DOMContentLoaded', () => {
        const sidebarHTML = `
        <aside id="main-sidebar" class="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 z-40 transition-all duration-300 hidden md:block">
            <div class="flex flex-col h-full p-6">
                <!-- Navigation -->
                <nav class="space-y-2 mb-8">
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-3">Menu</p>
                    <a href="index.html" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-600 dark:text-slate-300 font-medium">
                        <span class="text-xl">🏠</span> Trang chủ
                    </a>
                    <a href="received.html" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-600 dark:text-slate-300 font-medium">
                        <span class="text-xl">📩</span> Hộp thư đến
                    </a>
                    <a href="sent.html" class="nav-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-600 dark:text-slate-300 font-medium">
                        <span class="text-xl">📤</span> Hộp thư đi
                    </a>
                </nav>

                <!-- Mini Stats (Shrunk) -->
                <div class="mt-auto">
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-3">Thống kê nhanh</p>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100/50 dark:border-indigo-800/50">
                            <p class="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase leading-none mb-1">Đã gửi</p>
                            <span id="sb-stat-sent" class="text-lg font-black text-slate-800 dark:text-white">0</span>
                        </div>
                        <div class="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100/50 dark:border-blue-800/50">
                            <p class="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase leading-none mb-1">Đã nhận</p>
                            <span id="sb-stat-received" class="text-lg font-black text-slate-800 dark:text-white">0</span>
                        </div>
                        <div class="p-3 rounded-xl bg-orange-50/50 dark:bg-orange-900/20 border border-orange-100/50 dark:border-orange-800/50">
                            <p class="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase leading-none mb-1">Đang khóa</p>
                            <span id="sb-stat-locked" class="text-lg font-black text-slate-800 dark:text-white">0</span>
                        </div>
                        <div class="p-3 rounded-xl bg-green-50/50 dark:bg-green-900/20 border border-green-100/50 dark:border-green-800/50">
                            <p class="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase leading-none mb-1">Đã mở</p>
                            <span id="sb-stat-unlocked" class="text-lg font-black text-slate-800 dark:text-white">0</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Mobile Bottom Nav -->
        <nav class="fixed bottom-0 left-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-50 flex justify-around items-center h-16 md:hidden">
            <a href="index.html" class="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400">
                <span class="text-xl">🏠</span>
                <span class="text-[10px] font-bold uppercase">Home</span>
            </a>
            <a href="received.html" class="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400">
                <span class="text-xl">📩</span>
                <span class="text-[10px] font-bold uppercase">Nhận</span>
            </a>
            <a href="sent.html" class="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400">
                <span class="text-xl">📤</span>
                <span class="text-[10px] font-bold uppercase">Gửi</span>
            </a>
        </nav>
        `;

        document.body.insertAdjacentHTML('beforeend', sidebarHTML);

        // Highlight active link
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-item').forEach(item => {
            if (item.getAttribute('href') === currentPath) {
                item.classList.add('bg-indigo-600', 'text-white', 'shadow-lg', 'shadow-indigo-500/20');
                item.classList.remove('text-slate-600', 'dark:text-slate-300', 'hover:bg-indigo-50', 'dark:hover:bg-indigo-900/30');
            }
        });

        // Add padding to main content for desktop sidebar
        const mainContent = document.querySelector('.max-w-6xl') || document.querySelector('main');
        if (mainContent) {
            mainContent.classList.add('md:ml-64', 'transition-all', 'duration-300');
            mainContent.classList.remove('mx-auto');
            mainContent.classList.add('mx-0', 'max-w-none', 'px-4', 'md:px-12');
        }
    });

    // Global function to update sidebar stats
    window.updateSidebarStats = function(sent, received, locked, unlocked) {
        const elements = {
            'sb-stat-sent': sent,
            'sb-stat-received': received,
            'sb-stat-locked': locked,
            'sb-stat-unlocked': unlocked
        };
        
        for (const [id, val] of Object.entries(elements)) {
            const el = document.getElementById(id);
            if (el) el.innerText = val;
        }
    };
})();
