/*
  JAVASCRIPT CHUNG (main.js)
  Bao gồm logic menu mobile và kích hoạt icon (dùng cho MỌI trang).
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Kích hoạt icon Lucide
    // Đảm bảo thư viện Lucide đã được tải TRƯỚC khi tệp này chạy.
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    } else {
        console.error("Lucide library not loaded before main.js");
    }

    // 2. Xử lý menu mobile
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
  
    if (mobileMenuButton && mobileMenu) {
        const mobileMenuIcon = mobileMenuButton.querySelector('i');

        mobileMenuButton.addEventListener('click', () => {
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
            
            if (mobileMenuIcon) {
                // Thay đổi icon (Menu <-> X)
                mobileMenuIcon.setAttribute('data-lucide', isExpanded ? 'menu' : 'x');
                // Tạo lại icon vừa thay đổi
                lucide.createIcons(); 
            }
        });

        // Đóng menu mobile khi click vào link
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                const linkTarget = link.getAttribute('href');
                
                if (!linkTarget) return; 

                const linkPage = linkTarget.split('#')[0]; // Lấy phần tên file từ link
                const isAnchorLinkOnCurrentPage = linkTarget.startsWith('#');

                // Chỉ đóng nếu:
                // 1. Là link anchor (#) trên trang hiện tại.
                // 2. Là link sang một trang KHÁC (ví dụ: từ index.html -> hosting.html)
                if (isAnchorLinkOnCurrentPage || (linkPage && linkPage !== currentPage && linkPage !== "") ) {
                    if (mobileMenuButton && mobileMenu) {
                        mobileMenuButton.setAttribute('aria-expanded', 'false');
                        mobileMenu.classList.add('hidden');
                        if (mobileMenuIcon) {
                            mobileMenuIcon.setAttribute('data-lucide', 'menu');
                        }
                        lucide.createIcons();
                    }
                }
            });
        });
    }

}); // Hết DOMContentLoaded
