/*
  JAVASCRIPT RIÊNG CHO TRANG HOSTING (page-hosting.js)
  Đã tách từ thẻ <script> inline của hosting.html gốc.
  Chứa logic cho:
  - Tính VAT
  - Chuyển trang Tổng quan (Mindmap)
  - Chuyển Tab (Cá nhân, Doanh nghiệp)
  - Mở/Đóng Modal (Popup dịch vụ)
  - Mở/Đóng nhánh Mindmap
*/

document.addEventListener('DOMContentLoaded', () => {
    // Kích hoạt icon Lucide (Cần thiết vì HTML này gọi Lucide từ CDN)
    lucide.createIcons(); 

    // === SCRIPT TÍNH TOÁN 8% VAT === 
    function calculateVAT() {
      document.querySelectorAll('.price-year').forEach(el => {
        try {
          let text = el.textContent;
          // Updated regex to handle currency symbols or text after number
          let match = text.match(/([0-9\.]+)/); 
          if (match && match[1]) {
              let basePrice = parseInt(match[1].replace(/\./g, ''));
              if (!isNaN(basePrice)) { // Check if parsing was successful
                  let priceWithVAT = Math.round(basePrice * 1.08);
                  let formattedPrice = priceWithVAT.toLocaleString('vi-VN');
                  // Update text content more robustly
                  el.textContent = `${formattedPrice} VND/Năm`; 
              } else {
                 console.error("Lỗi parse giá trị VAT:", match[1]);
              }
          }
        } catch (e) {
          console.error("Lỗi tính VAT cho:", el.textContent, e);
        }
      });
    }
    calculateVAT(); // Execute VAT calculation

    // === SCRIPT CHUYỂN TRANG TỔNG QUAN === 
    const mainContent = document.getElementById('main-content-wrapper');
    const overviewPage = document.getElementById('overview-page-wrapper');
    const showOverviewBtn = document.getElementById('show-overview-btn');
    const hideOverviewBtn = document.getElementById('hide-overview-btn');

    if(showOverviewBtn) {
        showOverviewBtn.addEventListener('click', () => {
            if(mainContent) mainContent.style.display = 'none';
            if(overviewPage) overviewPage.style.display = 'block';
            document.body.classList.add('overview-is-open'); // Lock body scroll
            window.scrollTo(0, 0); // Scroll to top
        });
    }

    if(hideOverviewBtn) {
        hideOverviewBtn.addEventListener('click', () => {
            if(mainContent) mainContent.style.display = 'block';
            if(overviewPage) overviewPage.style.display = 'none';
            document.body.classList.remove('overview-is-open'); // Unlock body scroll
        });
    }

    // Script cho Tab 
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        // Deactivate all tabs and content
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Activate clicked tab and corresponding content
        tab.classList.add('active');
        const tabId = tab.getAttribute('data-tab'); // Get target tab ID
        if(tabId) {
            const targetContent = document.getElementById(tabId);
            if(targetContent) targetContent.classList.add('active'); // Show target content
        }
      });
    });

    // Script cho Modal (Popup) 
     document.querySelectorAll('.service-btn').forEach(button => {
      button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal'); // Get target modal ID
        if(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
              modal.style.display = "block"; // Show modal
            }
        }
      });
    });

    // Close modal via close button
    document.querySelectorAll('.close-btn').forEach(button => {
      button.addEventListener('click', () => {
        const modal = button.closest('.modal'); // Find parent modal
        if (modal) {
            modal.style.display = "none"; // Hide modal
        }
      });
    });

    // Close modal by clicking outside
    window.addEventListener('click', (event) => {
      if (event.target.classList.contains('modal')) { // Check if click is on modal background
        event.target.style.display = "none"; // Hide modal
      }
    });

    // === SCRIPT CHO MIND MAP THU GỌN === 
    const mindMapRoot = document.getElementById('mindMapRoot');
    if(mindMapRoot) {
        // Event listener for toggle clicks
        mindMapRoot.addEventListener('click', function (e) {
          // Check if clicked element is a toggle button and not a leaf node
          if (e.target.classList.contains('toggle') && !e.target.classList.contains('is-leaf')) {
            const toggleBtn = e.target;
            const parentNodeContainer = toggleBtn.closest('.mind-map-node-container');
            const subLevel = parentNodeContainer ? parentNodeContainer.nextElementSibling : null; // Get sibling level 
            
            if (subLevel && subLevel.classList.contains('mind-map-level')) {
              // Toggle collapsed state
              subLevel.classList.toggle('collapsed');
              const isCollapsed = subLevel.classList.contains('collapsed');
              
              // Update toggle button text and classes
              toggleBtn.textContent = isCollapsed ? '+' : '-';
              toggleBtn.classList.toggle('is-collapsed', isCollapsed);
              if (parentNodeContainer) {
                  parentNodeContainer.classList.toggle('is-collapsed', isCollapsed);
              }
            }
          }
        });

        // Collapse levels 3 and 4 by default
        document.querySelectorAll('.mind-map-level.level-3, .mind-map-level.level-4').forEach(level => {
             level.classList.add('collapsed'); 
             const parentNodeContainer = level.previousElementSibling; // Get parent node container
             // Update parent toggle button state if it exists
             if (parentNodeContainer && parentNodeContainer.classList.contains('mind-map-node-container')) {
                  const toggleBtn = parentNodeContainer.querySelector('.toggle');
                  if(toggleBtn && !toggleBtn.classList.contains('is-leaf')) {
                       toggleBtn.textContent = '+'; 
                       toggleBtn.classList.add('is-collapsed'); 
                       parentNodeContainer.classList.add('is-collapsed'); 
                  }
             }
         });
    }
    
    // Bỏ Script xử lý menu mobile

}); // End DOMContentLoaded