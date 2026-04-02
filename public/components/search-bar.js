/**
 * Component hiển thị thanh Tìm kiếm và Sắp xếp
 */
window.renderSearchUI = function(containerId, onUpdateCallback) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
    <div class="mb-12">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
            <div class="relative w-full md:w-2/3">
                <span class="absolute left-5 top-1/2 -translate-y-1/2 text-xl">🔍</span>
                <input type="text" id="common-search-input" 
                    class="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 dark:text-slate-200"
                    placeholder="Tìm kiếm theo tiêu đề hoặc nội dung...">
            </div>
            <div class="flex items-center gap-3 w-full md:w-auto">
                <span class="text-sm font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Sắp xếp:</span>
                <select id="common-sort-select" 
                    class="w-full md:w-40 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl py-4 px-6 font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500">
                    <option value="newest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                </select>
            </div>
        </div>
    </div>
    `;

    // Lắng nghe sự kiện để gọi lại hàm cập nhật danh sách
    const searchInput = document.getElementById('common-search-input');
    const sortSelect = document.getElementById('common-sort-select');

    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            onUpdateCallback(searchInput.value, sortSelect.value);
        }, 500); // 500ms debounce để tránh gọi API liên tục
    });

    sortSelect.addEventListener('change', () => {
        onUpdateCallback(searchInput.value, sortSelect.value);
    });
};
