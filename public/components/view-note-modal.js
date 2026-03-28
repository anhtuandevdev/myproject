(function () {
    const modalHTML = `
    <!-- Image Zoom Overlay -->
    <div id="image-zoom-overlay" class="fixed inset-0 z-[120] bg-slate-900/95 backdrop-blur-xl hidden opacity-0 transition-all duration-500 flex items-center justify-center cursor-zoom-out">
        <img id="zoomed-image" src="" alt="Zoomed Memory" class="max-w-[95%] max-h-[95%] object-contain shadow-2xl rounded-lg transform scale-90 transition-all duration-500">
        <button class="absolute top-6 right-6 text-white/50 hover:text-white transition">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
    </div>

    <!-- Main View Modal -->
    <div id="view-note-modal" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md hidden opacity-0 transition-all duration-500">
        <div id="view-modal-content" class="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden transform scale-95 rotate-1 opacity-0 transition-all duration-700 shadow-2xl border border-white/20 flex flex-col md:flex-row h-full max-h-[85vh]">
            
            <button id="close-view-btn" class="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-500 hover:text-red-500 hover:rotate-90 transition-all duration-300 z-20 shadow-lg">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <!-- Image Section -->
            <div id="view-image-container" class="w-full md:w-1/2 relative bg-slate-100 dark:bg-slate-800 flex items-center justify-center group hidden border-r border-slate-100 dark:border-slate-800">
                <img id="view-note-image" src="" alt="Memory" class="w-full h-full object-cover cursor-zoom-in transition duration-500 group-hover:scale-105">
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition pointer-events-none"></div>
                <div class="absolute bottom-6 left-6 right-6 text-white opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 pointer-events-none">
                    <span class="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest">🔍 Nhấn để xem toàn bộ ảnh</span>
                </div>
            </div>

            <!-- Content Section -->
            <div class="flex-1 p-10 md:p-16 flex flex-col overflow-y-auto custom-scrollbar relative">
                <!-- Top Decoration -->
                <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                <div class="mb-10">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="w-8 h-px bg-indigo-500"></span>
                        <span class="text-indigo-600 dark:text-indigo-400 text-[11px] font-black uppercase tracking-[0.3em]">Mảnh ký ức đã đánh thức</span>
                    </div>
                    <h2 id="view-note-title" class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-2 italic"></h2>
                </div>

                <div class="flex-1 mb-12 relative min-h-[200px]">
                    <span class="absolute -left-10 -top-6 text-[120px] text-indigo-500/5 font-serif select-none pointer-events-none">“</span>
                    <p id="view-note-content" class="handwritten text-3xl md:text-4xl text-slate-700 dark:text-slate-300 leading-relaxed drop-shadow-sm"></p>
                </div>

                <div class="flex flex-wrap gap-y-6 gap-x-12 pt-10 border-t border-slate-100 dark:border-slate-800">
                    <div class="flex-1 min-w-[200px]">
                        <p class="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Người gửi</p>
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-lg">👤</div>
                            <span id="view-note-sender" class="font-bold text-slate-700 dark:text-slate-200"></span>
                        </div>
                    </div>
                    <div class="flex-1 min-w-[200px]">
                        <p class="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Thời điểm niêm phong</p>
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-lg">⏳</div>
                            <span id="view-note-date" class="font-bold text-slate-700 dark:text-slate-200"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <style>
        .handwritten {
            font-family: 'Dancing Script', cursive;
        }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(99, 102, 241, 0.15);
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.3); }

        #view-modal-content.show {
            opacity: 1;
            transform: scale(1) rotate(0deg);
        }

        #image-zoom-overlay.show {
            opacity: 1;
        }
        #image-zoom-overlay.show #zoomed-image {
            transform: scale(1);
        }
    </style>
    `;

    function initViewModal() {
        if (!document.getElementById('view-note-modal')) {
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Event Listeners
            document.getElementById('close-view-btn').onclick = () => window.closeNoteModal();
            
            document.getElementById('view-note-modal').onclick = (e) => {
                if (e.target.id === 'view-note-modal') window.closeNoteModal();
            };

            const zoomOverlay = document.getElementById('image-zoom-overlay');
            const noteImage = document.getElementById('view-note-image');
            const zoomedImage = document.getElementById('zoomed-image');

            noteImage.onclick = () => {
                zoomedImage.src = noteImage.src;
                zoomOverlay.classList.remove('hidden');
                setTimeout(() => zoomOverlay.classList.add('show'), 10);
            };

            zoomOverlay.onclick = () => {
                zoomOverlay.classList.remove('show');
                setTimeout(() => zoomOverlay.classList.add('hidden'), 500);
            };
        }
    }

    window.openNoteModal = async function (noteId) {
        const modal = document.getElementById('view-note-modal');
        const content = document.getElementById('view-modal-content');
        const token = localStorage.getItem('token');

        if (!modal || !token) return;

        try {
            modal.classList.remove('hidden');
            setTimeout(() => modal.classList.add('opacity-100'), 10);

            // Xác định xem đang trang nào để gọi API đúng
            const source = window.location.pathname.includes('sent') ? 'sent' : 'received';
            const res = await fetch(`/api/notes/${source}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const notes = await res.json();
            const note = notes.find(n => n._id === noteId);

            if (!note) throw new Error('Không tìm thấy lời nhắn');

            document.getElementById('view-note-title').innerText = note.title;
            document.getElementById('view-note-content').innerText = note.content;
            
            if (source === 'sent') {
                document.getElementById('view-note-sender').innerText = "Tôi (Gửi tới: " + (note.recipientEmail || '...') + ")";
            } else {
                const s = note.sender;
                document.getElementById('view-note-sender').innerText = (s && typeof s === 'object') ? `${s.name} (${s.email})` : (note.recipientEmail || 'Ẩn danh');
            }

            document.getElementById('view-note-date').innerText = new Date(note.createdAt).toLocaleDateString('vi-VN', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            const imgContainer = document.getElementById('view-image-container');
            const img = document.getElementById('view-note-image');
            if (note.imageUrl) {
                img.src = note.imageUrl;
                imgContainer.classList.remove('hidden');
                // Chia 50/50 nếu có ảnh, ngược lại 100% nội dung
                content.classList.remove('max-w-2xl');
                content.classList.add('max-w-5xl');
            } else {
                imgContainer.classList.add('hidden');
                content.classList.remove('max-w-5xl');
                content.classList.add('max-w-2xl');
            }

            setTimeout(() => content.classList.add('show'), 50);

        } catch (err) {
            console.error(err);
            alert('⚠️ Lỗi kết nối cỗ máy thời gian!');
            window.closeNoteModal();
        }
    };

    window.closeNoteModal = function () {
        const modal = document.getElementById('view-note-modal');
        const content = document.getElementById('view-modal-content');
        if (!modal) return;

        content.classList.remove('show');
        modal.classList.remove('opacity-100');
        
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 500);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initViewModal);
    } else {
        initViewModal();
    }
})();
