/**
 * Component hiển thị thẻ Lời nhắn (Note Card)
 * Dùng chung cho cả trang Index, Sent và Received
 */
window.renderNoteCard = function(note, type = 'received') {
    const isLocked = new Date(note.availableAt) > new Date();
    let displayImageUrl = note.imageUrl;

    // Nếu đang bị khóa, làm mờ ảnh bằng Cloudinary (nếu có)
    if (note.imageUrl && isLocked) {
        displayImageUrl = note.imageUrl.replace('/upload/', '/upload/e_blur:1000,f_auto,q_auto/');
    }

    const isSent = type === 'sent';
    
    // Status Icon & Styles
    const statusIcon = isLocked ? '🔒' : (isSent ? '📤' : '📜');
    const cardBg = isLocked 
        ? 'bg-white dark:bg-slate-800' 
        : (isSent ? 'bg-blue-50/30 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/50' : 'unlocked-bg border-indigo-100 dark:border-indigo-900/50');

    return `
    <div onclick="${isLocked ? '' : `openNoteModal('${note._id}')`}" 
         class="note-card ${isLocked ? 'locked' : 'cursor-pointer hover:scale-[1.02] transition-transform'} glass-card relative overflow-hidden flex flex-col min-h-[440px] ${cardBg} border shadow-lg group">
        
        <!-- Status Badge & Action Menu -->
        <div class="p-6 pb-0 flex justify-between items-start relative z-10">
             <div class="w-12 h-12 bg-white dark:bg-slate-700 flex items-center justify-center text-2xl rounded-2xl shadow-sm ${isLocked && isSent ? 'locked-pulse' : ''}">
                ${statusIcon}
            </div>
            <button onclick="event.stopPropagation(); deleteNote('${note._id}')" 
                    class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900/50 text-slate-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
        </div>
        
        <!-- Content Area -->
        <div class="p-6 flex-1">
            <h3 class="text-2xl font-black ${!isLocked && !isSent ? 'shimmer-text' : 'text-slate-800 dark:text-white'} mb-2 line-clamp-1">${note.title}</h3>
            
            ${isSent ? `
                <div class="flex items-center gap-2 mb-4">
                    <span class="text-[10px] font-black uppercase text-indigo-500 tracking-widest bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">Tới: ${note.recipientEmail}</span>
                </div>
            ` : ''}

            ${note.imageUrl ? `
                <div class="relative w-full h-40 rounded-3xl overflow-hidden mb-6 group border border-slate-100 dark:border-slate-800 shadow-md">
                    <img src="${displayImageUrl}" class="w-full h-full object-cover" alt="Image">
                    ${isLocked ? `
                        <div class="absolute inset-0 bg-indigo-950/40 backdrop-blur-xl flex flex-col items-center justify-center text-white">
                            <span class="text-[10px] font-black uppercase tracking-[0.3em] mb-2">Đang Niêm Phong</span>
                            <div class="w-1 bg-white/30 h-8 rounded-full"></div>
                        </div>` : ''}
                </div>` : ''}

            <div class="relative">
                ${isLocked
                    ? '<div class="space-y-4 opacity-40"><div class="h-3 bg-slate-100 dark:bg-slate-800 rounded-full w-full"></div><div class="h-3 bg-slate-100 dark:bg-slate-800 rounded-full w-4/5"></div><div class="h-3 bg-slate-100 dark:bg-slate-800 rounded-full w-3/4"></div></div>'
                    : `<p class="handwritten text-2xl text-slate-700 dark:text-slate-300 line-clamp-3">"${note.content}"</p>`
                }
            </div>
        </div>

        <!-- Footer Countdown & Meta -->
        <div class="px-6 py-6 bg-slate-50/50 dark:bg-slate-800/40 border-t border-dashed border-slate-200 dark:border-slate-700 flex flex-col gap-2 mt-auto">
            <div class="countdown-timer" data-date="${note.availableAt}">
                Đang tải...
            </div>
            <div class="flex justify-between items-center mt-2 opacity-50 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>Niêm phong vào:</span>
                <span>${new Date(note.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>
        </div>
    </div>`;
};
