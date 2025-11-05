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
// Script cho carousel dự án trên trang chủ
// Thêm vào cuối file main.js hoặc tạo file riêng projects-carousel.js

// Script cho carousel dự án trên trang chủ
// Thêm vào cuối file main.js hoặc tạo file riêng projects-carousel.js

document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.getElementById('projects-carousel-container');
    
    if (!projectsContainer || typeof projectsData === 'undefined' || !Array.isArray(projectsData)) {
        return;
    }

    let currentIndex = 0;
    let autoSlideInterval;
    
    // === ĐIỀU CHỈNH LOGIC CAROUSEL CHO MOBILE ===
    const isMobile = window.matchMedia("(max-width: 768px)").matches; 
    
    // Trên Desktop: 3 cột x 2 hàng = 6 dự án.
    // Trên Mobile (1 cột): Chỉ hiển thị 1 dự án để card lớn.
    const ITEMS_PER_VIEW = isMobile ? 1 : 6; 
    const ITEMS_PER_SLIDE = isMobile ? 1 : 2; 
    // ===========================================
    
    const AUTO_SLIDE_DELAY = 2000; // 2 giây
    let projectCards = []; // Cache các card đã tạo

    // Hàm escape HTML
    const escapeHtml = (unsafe) => {
        if (!unsafe) return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    // Hàm tạo HTML card dự án
    const createProjectCard = (project) => {
        return `
            <div class="project-card opacity-0">
                <div class="group rounded-lg shadow-lg overflow-hidden h-full">
                    <a href="${escapeHtml(project.link) || '#'}" class="block">
                        <img src="${escapeHtml(project.imageUrl) || 'https://placehold.co/600x400/e0e7ff/4f46e5?text=No+Image'}" 
                             alt="${escapeHtml(project.title)}" 
                             class="w-full h-48 object-cover group-hover:opacity-80 transition duration-300"
                             onerror="this.onerror=null; this.src='https://placehold.co/600x400/cccccc/ffffff?text=Image+Error';"
                             loading="lazy">
                    </a>
                    <div class="p-6">
                        <span class="text-sm text-indigo-600 font-medium">${escapeHtml(project.category)}</span>
                        <h3 class="mt-1 text-xl font-bold text-gray-900">${escapeHtml(project.title)}</h3>
                        <p class="mt-2 text-base text-gray-600 line-clamp-3">${escapeHtml(project.description)}</p>
                    </div>
                </div>
            </div>
        `;
    };

    // Hàm render dự án
    const renderProjects = () => {
        const grid = projectsContainer.querySelector('.projects-grid');
        if (!grid) return;

        grid.innerHTML = '';
        
        // Lấy số dự án cần hiển thị
        for (let i = 0; i < ITEMS_PER_VIEW; i++) {
            const projectIndex = (currentIndex + i) % projectsData.length;
            const project = projectsData[projectIndex];
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = createProjectCard(project);
            const card = tempDiv.firstElementChild;
            
            grid.appendChild(card);
            
            // Trigger fade in với delay
            setTimeout(() => {
                card.classList.remove('opacity-0');
                card.classList.add('opacity-100');
            }, i * 50);
        }
    };

    // Hàm chuyển slide
    const slideProjects = (direction = 'next') => {
        const grid = projectsContainer.querySelector('.projects-grid');
        if (!grid) return;

        // Thêm class animation
        grid.classList.add(direction === 'next' ? 'slide-left' : 'slide-right');

        setTimeout(() => {
            if (direction === 'next') {
                currentIndex = (currentIndex + ITEMS_PER_SLIDE) % projectsData.length;
            } else {
                currentIndex = (currentIndex - ITEMS_PER_SLIDE + projectsData.length) % projectsData.length;
            }
            
            grid.classList.remove('slide-left', 'slide-right');
            renderProjects();
        }, 500);
    };

    // Hàm bắt đầu auto slide
    const startAutoSlide = () => {
        stopAutoSlide();
        autoSlideInterval = setInterval(() => {
            slideProjects('next');
        }, AUTO_SLIDE_DELAY);
    };

    // Hàm dừng auto slide
    const stopAutoSlide = () => {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    };

    // Xử lý nút prev
    const prevBtn = projectsContainer.querySelector('.carousel-btn-prev');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            slideProjects('prev');
            startAutoSlide();
        });
    }

    // Xử lý nút next
    const nextBtn = projectsContainer.querySelector('.carousel-btn-next');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            slideProjects('next');
            startAutoSlide();
        });
    }

    // Dừng auto slide khi hover
    projectsContainer.addEventListener('mouseenter', stopAutoSlide);
    projectsContainer.addEventListener('mouseleave', startAutoSlide);

    // Khởi tạo
    renderProjects();
    startAutoSlide();

    // Kích hoạt Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
