/*
  JAVASCRIPT RIÊNG CHO TRANG PROJECTS (page-projects.js)
  Chứa logic cho:
  - Tải và hiển thị dữ liệu dự án từ project-data.js
*/

document.addEventListener('DOMContentLoaded', () => {
    // Kích hoạt icon Lucide
    lucide.createIcons();

    // --- TẢI VÀ HIỂN THỊ DỮ LIỆU DỰ ÁN ---
    const projectGrid = document.querySelector('.grid'); // Tìm grid chứa projects

    // Kiểm tra xem biến projectsData từ file project-data.js có tồn tại không
    if (projectGrid && typeof projectsData !== 'undefined' && Array.isArray(projectsData)) {
        // Xóa nội dung placeholder (6 cards mẫu trong HTML)
        projectGrid.innerHTML = '';

        if (projectsData.length === 0) {
            projectGrid.innerHTML = '<p class="text-center text-gray-500 col-span-full">Chưa có dự án nào được thêm.</p>';
        } else {
            // Duyệt qua mảng dữ liệu và tạo HTML cho mỗi dự án
            projectsData.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card group'; // Class từ CSS

                // Escape HTML entities để tránh lỗi XSS cơ bản
                const escapeHtml = (unsafe) => {
                    if (!unsafe) return '';
                    return unsafe
                         .replace(/&/g, "&amp;")
                         .replace(/</g, "&lt;")
                         .replace(/>/g, "&gt;")
                         .replace(/"/g, "&quot;")
                         .replace(/'/g, "&#039;");
                };
                
                // Tạo HTML cho card
                projectCard.innerHTML = `
                    <a href="${escapeHtml(project.link) || '#'}" class="block">
                        <img src="${escapeHtml(project.imageUrl) || 'https://placehold.co/600x400/cccccc/ffffff?text=No+Image'}" 
                             alt="${escapeHtml(project.title)}" 
                             onerror="this.onerror=null; this.src='https://placehold.co/600x400/cccccc/ffffff?text=Image+Error';" 
                             loading="lazy">
                    </a>
                    <div class="content">
                        <span class="category">${escapeHtml(project.category)}</span>
                        <h3>${escapeHtml(project.title)}</h3>
                        <p>${escapeHtml(project.description)}</p>
                    </div>
                `;
                projectGrid.appendChild(projectCard);
            });
        }
    } else if (projectGrid) {
        // Xử lý trường hợp không tìm thấy dữ liệu
        projectGrid.innerHTML = '<p class="text-center text-red-500 col-span-full">Lỗi: Không thể tải dữ liệu dự án. Vui lòng kiểm tra file `assets/js/project-data.js`.</p>';
        console.error("Biến 'projectsData' không tồn tại hoặc không phải là mảng.");
    }

}); // End DOMContentLoaded