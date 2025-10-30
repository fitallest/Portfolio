/*
  JAVASCRIPT RIÊNG CHO TRANG DOMAIN (page-domain.js)
  Đã tách từ thẻ <script> inline của domain.html gốc.
  Chứa logic cho:
  - Kích hoạt Lucide Icons
  - Gợi ý tên miền (Domain Suggestion)
  - Mở/ĐÓng Modal
  - Xử lý Formspree (Form submission) và Confetti
*/

document.addEventListener('DOMContentLoaded', () => {
    // Kích hoạt icon Lucide (Cần thiết vì HTML này gọi Lucide từ CDN)
    lucide.createIcons(); 

    // Bỏ Script xử lý menu mobile (Vì file HTML này không có menu)

    // === SCRIPT GỢI Ý TÊN MIỀN ===
    const domainInput = document.getElementById('domainInput');
    const industryInput = document.getElementById('industryInput'); 
    const searchDomainButton = document.getElementById('searchDomainButton');
    const suggestionResultsArea = document.getElementById('suggestionResultsArea');
    const col1ResultsDiv = document.getElementById('column1Results').querySelector('.suggestion-list');
    const col2TabsDiv = document.getElementById('suggestionTabs');
    const col2ContentDiv = document.getElementById('suggestionTabContent');
    const modalMessageTextarea = document.getElementById('modal_message'); 

    // Hàm xóa dấu tiếng Việt
    function removeAccents(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
    }

    // Hàm xử lý từ khóa: xóa dấu, thay khoảng trắng/ký tự đặc biệt bằng '-', xóa dấu '-' thừa
    function processKeyword(input) {
        if (!input) return '';
        let processed = removeAccents(input.trim().toLowerCase());
        // CẬP NHẬT: Không thay thế '.' nếu nó nằm giữa các chữ cái/số (cho phép user nhập .com)
        // Chỉ thay thế các ký tự không phải chữ/số/dấu gạch nối bằng '-'
        processed = processed.replace(/[^a-z0-9\-]+/g, '-'); 
        processed = processed.replace(/-+/g, '-'); // Thay nhiều dấu -- thành 1 dấu -
        processed = processed.replace(/^-+|-+$/g, ''); // Xóa dấu - ở đầu/cuối
        return processed;
    }
    
    // CẬP NHẬT: Hàm xử lý từ khóa cho gợi ý (ghép liền, không có dấu '-')
     function processKeywordForCombine(input) {
        if (!input) return '';
        let processed = removeAccents(input.trim().toLowerCase());
        // Xóa tất cả ký tự không phải chữ cái hoặc số
        processed = processed.replace(/[^a-z0-9]+/g, ''); 
        return processed;
    }


    // Danh sách đuôi tên miền phổ biến
    const commonTLDs = ['.com', '.vn', '.net', '.com.vn', '.info', '.org', '.store', '.online', '.shop', '.xyz', '.site'];
    const vnTLDs = ['.vn', '.com.vn', '.net.vn', '.info.vn', '.edu.vn', '.gov.vn']; // Để phân loại VN

    // CẬP NHẬT: Mở rộng từ khóa ngành nghề
    const industryKeywords = {
        'nhua': ['plastic', 'poly', 'plas'],
        'thoi trang': ['fashion', 'style', 'boutique', 'shop', 'store', 'mode'],
        'du lich': ['travel', 'tour', 'booking', 'trip', 'holiday'],
        'xay dung': ['construction', 'build', 'decor', 'home', 'solution', 'group', 'cons'],
        'giao duc': ['edu', 'school', 'academy', 'learn', 'study'],
        'bat dong san': ['real', 'land', 'property', 'bds', 'homes', 'realty'],
        'noi that': ['interior', 'decor', 'furniture', 'design'],
        'thuc pham': ['food', 'kitchen', 'mart', 'deli'],
        'my pham': ['beauty', 'cosmetic', 'spa', 'skin'],
        'cong nghe': ['tech', 'solution', 'soft', 'data', 'it'],
        'van tai': ['logistics', 'trans', 'ship', 'cargo']
        // Thêm các ngành khác nếu cần
    };

    // CẬP NHẬT: Hàm tạo các gợi ý thông minh
    function generateSmartSuggestions(keyword, industry) {
        const suggestions = new Set(); 
        const keywordProcessedHyphen = processKeyword(keyword); // Dùng cho các gợi ý có thể có gạch nối
        const keywordProcessedCombine = processKeywordForCombine(keyword); // Dùng để ghép liền
        const industryProcessedHyphen = processKeyword(industry);
        const industryProcessedCombine = processKeywordForCombine(industry);

        // 2. Keyword + Ngành (Ưu tiên ghép liền)
        if (industryProcessedCombine) {
            // Lấy từ tiếng Anh hoặc dùng từ gốc (đã xử lý)
            const industryENKeywords = industryKeywords[industryProcessedHyphen] || [industryProcessedCombine]; 
            
            industryENKeywords.forEach(indKey => {
                // Ghép liền keyword + ngành
                commonTLDs.forEach(tld => {
                    suggestions.add(keywordProcessedCombine + indKey + tld); 
                });
                 // Ghép keyword-ngành (ít hơn)
                 if (keywordProcessedHyphen && indKey) { // Chỉ thêm nếu cả 2 có giá trị
                    commonTLDs.slice(0, 4).forEach(tld => { // Chỉ với các TLD phổ biến nhất
                        suggestions.add(keywordProcessedHyphen + '-' + indKey + tld);
                    });
                 }
            });
        }

        // 3. Thêm hậu tố/tiền tố phổ biến (Ưu tiên ghép liền)
         const commonSuffixes = ['vn', 'sg', 'hcm', 'hanoi', 'group', 'global', 'tech', 'solution', 'shop', 'store', 'pro', 'plus'];
         commonSuffixes.forEach(suffix => {
             commonTLDs.forEach(tld => suggestions.add(keywordProcessedCombine + suffix + tld));
         });
         const commonPrefixes = ['the', 'my', 'best', 'top', 'go', 'get'];
         commonPrefixes.forEach(prefix => {
             commonTLDs.forEach(tld => suggestions.add(prefix + keywordProcessedCombine + tld));
         });
        
         // Thêm một số biến thể có gạch nối (ít hơn)
         ['group', 'global', 'tech', 'solution'].forEach(suffix => {
            if(keywordProcessedHyphen){
                commonTLDs.slice(0, 2).forEach(tld => suggestions.add(keywordProcessedHyphen + '-' + suffix + tld));
            }
         });

        // Lọc bỏ các tên miền không hợp lệ
        const validSuggestions = Array.from(suggestions).filter(domain => {
            if (domain.includes('--')) return false; 
            const parts = domain.split('.');
            return parts.length >= 2 && parts[0] !== '' && parts[parts.length -1] !== ''; 
        });
        return validSuggestions.slice(0, 50); // Lấy tối đa 50 gợi ý
    }

    // Hàm hiển thị kết quả
    function displayResults(keyword, industry, userTLD) {
        col1ResultsDiv.innerHTML = ''; 
        col2TabsDiv.innerHTML = ''; 
        col2ContentDiv.innerHTML = ''; 

        let col1Domains = new Set(); 
        if (userTLD) {
             const userDomain = keyword + userTLD;
             if (!userDomain.includes('--')) {
                col1Domains.add(userDomain);
             }
        }
        commonTLDs.forEach(tld => {
            const domain = keyword + tld;
            if (!domain.endsWith(tld + tld) && !domain.includes('--')) {
                 col1Domains.add(domain);
            }
        });
        const col1DomainsArray = Array.from(col1Domains); 

        // Hiển thị cột 1
        if (col1DomainsArray.length > 0) {
             col1DomainsArray.forEach(domain => {
                 const div = document.createElement('div');
                 div.className = 'suggestion-item';
                 div.innerHTML = `
                    <span class="domain-name">${domain}</span>
                    <button data-domain="${domain}" class="register-suggestion-btn open-register-modal">Đăng ký</button>
                 `;
                 col1ResultsDiv.appendChild(div);
             });
         } else {
             col1ResultsDiv.innerHTML = '<p class="text-center text-gray-500 p-4">Không có kết quả trực tiếp hợp lệ.</p>';
         }

        // Tạo gợi ý cột 2
        const smartSuggestions = generateSmartSuggestions(keyword, industry);
        const suggestionsByTLD = {};
        smartSuggestions.forEach(domain => {
            if(col1DomainsArray.includes(domain)) return;
            let tldGroup = 'Khác'; 
            const sortedTLDs = [...commonTLDs, ...vnTLDs].sort((a, b) => b.length - a.length); 
            for (const tld of sortedTLDs) { 
                if (domain.endsWith(tld)) {
                    tldGroup = tld;
                    break;
                }
            }
            if (!suggestionsByTLD[tldGroup]) suggestionsByTLD[tldGroup] = [];
            if (!suggestionsByTLD[tldGroup].includes(domain)) {
                suggestionsByTLD[tldGroup].push(domain);
            }
        });

         // Hiển thị cột 2 (Tabs và Content)
         const sortedTLDGroups = Object.keys(suggestionsByTLD).sort((a, b) => {
             const priority = ['.com', '.vn', '.com.vn'];
             const aPrio = priority.indexOf(a);
             const bPrio = priority.indexOf(b);
             if (aPrio !== -1 && bPrio !== -1) return aPrio - bPrio;
             if (aPrio !== -1) return -1; 
             if (bPrio !== -1) return 1;  
             return a.localeCompare(b); 
         });

         if(sortedTLDGroups.length > 0) {
            col2ContentDiv.innerHTML = ''; 
            sortedTLDGroups.forEach((tldGroup, index) => {
                 if (suggestionsByTLD[tldGroup] && suggestionsByTLD[tldGroup].length > 0) {
                     // Tạo Tab Button
                     const tabButton = document.createElement('button');
                     tabButton.className = `tab-btn ${index === 0 ? 'active' : ''}`;
                     tabButton.dataset.tab = `tab-${tldGroup.replace(/\./g, '')}`; 
                     tabButton.textContent = tldGroup.toUpperCase();
                     col2TabsDiv.appendChild(tabButton);

                     // Tạo Tab Content Div
                     const tabContent = document.createElement('div');
                     tabContent.id = `tab-${tldGroup.replace(/\./g, '')}`;
                     tabContent.className = `tab-content ${index === 0 ? 'active' : ''}`;
                     
                     suggestionsByTLD[tldGroup].forEach(domain => {
                         const div = document.createElement('div');
                         div.className = 'suggestion-item';
                         div.innerHTML = `
                            <span class="domain-name">${domain}</span>
                            <button data-domain="${domain}" class="register-suggestion-btn open-register-modal">Đăng ký</button>
                         `;
                         tabContent.appendChild(div);
                     });
                     col2ContentDiv.appendChild(tabContent);
                 }
            });

            // Thêm sự kiện chuyển tab
            if (col2TabsDiv.hasChildNodes()) {
                col2TabsDiv.querySelectorAll('.tab-btn').forEach(button => {
                     button.addEventListener('click', () => {
                         col2TabsDiv.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                         col2ContentDiv.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                         button.classList.add('active');
                         const targetContent = document.getElementById(button.dataset.tab);
                         if (targetContent) targetContent.classList.add('active');
                     });
                 });
            } else {
                 col2ContentDiv.innerHTML = '<p class="text-center text-gray-500 p-4">Không có gợi ý nào khác.</p>';
            }

         } else {
             col2ContentDiv.innerHTML = '<p class="text-center text-gray-500 p-4">Không có gợi ý nào khác.</p>';
         }

        // Gắn lại sự kiện mở modal
        attachModalOpenListeners();
    }


    if(searchDomainButton && domainInput && suggestionResultsArea) {
        searchDomainButton.addEventListener('click', () => {
            const rawInput = domainInput.value;
            const industry = industryInput.value;
            
            if (!rawInput.trim()) {
                suggestionResultsArea.classList.remove('hidden');
                col1ResultsDiv.innerHTML = '<p class="text-center text-gray-500 p-4">Vui lòng nhập tên miền hoặc từ khóa.</p>';
                col2TabsDiv.innerHTML = '';
                col2ContentDiv.innerHTML = '<p class="text-center text-gray-500 p-4"></p>';
                return;
            }

            // Tách tên miền và TLD
            let baseKeywordRaw = rawInput;
            let userTLD = null;
            const lastDotIndex = rawInput.lastIndexOf('.');
            if (lastDotIndex > 0 && lastDotIndex < rawInput.length - 1) { 
                 const potentialTLD = rawInput.substring(lastDotIndex).toLowerCase();
                 const isValidTLD = commonTLDs.includes(potentialTLD) || vnTLDs.includes(potentialTLD) || /^\.[a-z]{2,}(\.[a-z]{2})?$/.test(potentialTLD);
                 
                 if (isValidTLD) {
                    const potentialBase = rawInput.substring(0, lastDotIndex);
                    if (potentialBase && !potentialBase.endsWith('.')) { 
                        userTLD = potentialTLD;
                        baseKeywordRaw = potentialBase;
                    }
                 }
            }

            // Xử lý keyword
            const processedKeyword = processKeyword(baseKeywordRaw);

            if (!processedKeyword) {
                suggestionResultsArea.classList.remove('hidden');
                col1ResultsDiv.innerHTML = '<p class="text-center text-gray-500 p-4">Từ khóa không hợp lệ.</p>';
                 col2TabsDiv.innerHTML = '';
                col2ContentDiv.innerHTML = '<p class="text-center text-gray-500 p-4"></p>';
                return;
            }
            
            suggestionResultsArea.classList.remove('hidden'); 
            col1ResultsDiv.innerHTML = '<p class="text-center text-gray-500 p-4">Đang tải...</p>'; 
            col2TabsDiv.innerHTML = '';
            col2ContentDiv.innerHTML = '<p class="text-center text-gray-500 p-4">Đang tải...</p>'; 

            // Giả lập độ trễ
            setTimeout(() => {
                 displayResults(processedKeyword, industry, userTLD);
            }, 300); 

        });
    }
    // === HẾT SCRIPT GỢI Ý TÊN MIỀN ===

    // === SCRIPT MỞ/ĐÓNG MODAL ĐĂNG KÝ ===
    const registerModal = document.getElementById('registerModal');
    const closeModalButtons = document.querySelectorAll('.close-register-modal');
    const successMessage = document.getElementById('success-message');

    function openModal(domainToRegister = null) {
        if (registerModal) {
            if (domainToRegister && modalMessageTextarea) {
                modalMessageTextarea.value = `Tôi muốn đăng ký tên miền: ${domainToRegister}`;
            } else if (modalMessageTextarea) {
                modalMessageTextarea.value = ''; 
                modalMessageTextarea.placeholder = 'Bạn cần tư vấn thêm về tên miền nào?';
            }
            registerModal.style.display = 'block';
            lucide.createIcons(); // Đảm bảo icon trong modal (nếu có) được render
        }
    }

    function closeModal() {
         if (registerModal) {
            registerModal.style.display = 'none';
            if (modalMessageTextarea) {
                modalMessageTextarea.value = '';
                modalMessageTextarea.placeholder = 'Ví dụ: Tôi muốn đăng ký tên miền abc.com'; 
            }
        }
    }
    
    function attachModalOpenListeners() {
         // SỬ DỤNG EVENT DELEGATION
         const resultsArea = document.getElementById('suggestionResultsArea');
         const priceTables = document.querySelectorAll('.price-table-container'); 

         const handleOpenClick = (event) => {
             if (event.target.classList.contains('open-register-modal')) {
                 const domain = event.target.dataset.domain || null; 
                 openModal(domain);
             }
         };

         if (resultsArea) {
             resultsArea.removeEventListener('click', handleOpenClick); 
             resultsArea.addEventListener('click', handleOpenClick); 
         }
         priceTables.forEach(table => {
             table.removeEventListener('click', handleOpenClick); 
             table.addEventListener('click', handleOpenClick); 
         });
    }

    attachModalOpenListeners(); // Gắn listener lần đầu

    closeModalButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });

    window.addEventListener('click', (event) => {
        if (event.target == registerModal) {
            closeModal();
        }
    });
    // === HẾT SCRIPT MODAL ===

    // === SCRIPT XỬ LÝ FORM SUBMISSION VÀ PHÁO HOA ===
    const form = document.getElementById('registrationForm');
    const formStatus = document.getElementById('form-status');
    const submitButton = document.getElementById('submitButton');

    if (form && formStatus && submitButton) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); 
            
            const formData = new FormData(form);
            submitButton.disabled = true; 
            formStatus.textContent = 'Đang gửi...';
            formStatus.className = 'text-center text-sm text-gray-500';

            fetch(form.action, {
                method: form.method,
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    formStatus.textContent = 'Gửi thành công!';
                    formStatus.className = 'text-center text-sm text-green-600';
                    form.reset(); 
                    closeModal(); 

                    if (successMessage) {
                        successMessage.classList.add('show');
                        setTimeout(() => { successMessage.classList.remove('show'); }, 3000); 
                    }

                    if (typeof confetti === 'function') {
                        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
                    }
                    
                } else {
                    response.json().then(data => {
                        formStatus.textContent = (data && data.errors) ? data.errors.map(e => e.message).join(", ") : 'Oops! Có lỗi xảy ra.';
                        formStatus.className = 'text-center text-sm text-red-600';
                    }).catch(() => {
                        formStatus.textContent = 'Oops! Lỗi xử lý phản hồi.';
                        formStatus.className = 'text-center text-sm text-red-600';
                    });
                }
            }).catch(error => {
                console.error('Form submission fetch error:', error); 
                formStatus.textContent = 'Oops! Lỗi mạng khi gửi form.';
                formStatus.className = 'text-center text-sm text-red-600';
            }).finally(() => {
                submitButton.disabled = false; 
                setTimeout(() => { if (formStatus) formStatus.textContent = ''; }, 5000); 
               if (modalMessageTextarea) modalMessageTextarea.value = ''; 
            });
        });
    } else {
        console.error("Không tìm thấy các thành phần form cần thiết."); 
    }
    // === HẾT SCRIPT FORM SUBMISSION ===

}); // Đóng DOMContentLoaded
