/*
  JAVASCRIPT RIÊNG CHO TRANG BÁO GIÁ (page-baogia.js)
  Đã tách từ script inline, loại bỏ logic menu và kích hoạt icon (đã có trong main.js).
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // === BỎ PHẦN 1: LOGIC MENU VÀ KÍCH HOẠT ICON (ĐÃ CÓ TRONG main.js) ===
    /* // Kích hoạt icon Lucide 
    // Xử lý menu mobile 
    */

    // === GIỮ LẠI PHẦN 2: LOGIC BÁO GIÁ ===
    
    // Cấu hình Tailwind (Giữ lại nếu bạn có tùy chỉnh màu sắc ở đây)
    if (typeof tailwind !== 'undefined') {
        // Đổi màu nasani-primary thành indigo-600, nasani-light thành indigo-50, hospital-theme thành cyan-600
        // Cập nhật cấu hình Tailwind để sử dụng màu sắc chuẩn (indigo, cyan)
        tailwind.config = {
            theme: { 
                extend: { 
                    colors: { 
                        'indigo-600': '#4f46e5', // Thay thế nasani-primary
                        'indigo-50': '#eef2ff',   // Thay thế nasani-light
                        'cyan-600': '#06b6d4'     // Thay thế hospital-theme
                        // Bạn có thể thêm các màu khác nếu cần
                    } 
                } 
            }
        }
    }

    const VAT_RATE_8 = 0.08;
    const VAT_RATE_0 = 0.0;
    
    // Bảng giá gốc (BASE PRICES) - Giá CHƯA VAT
    const PRICES_BASE = {
        package_basic: 7500000, package_multiple_interface: 10500000, package_full: 13500000,
        addon_doctor_lookup: 2000000, addon_rating_system: 3500000, addon_bmi_calculator: 2500000, addon_advanced_api: 5000000,
        addon_project_portfolio: 4000000, addon_estimation_tool: 6000000, addon_booking_spa: 4500000, addon_gallery_before_after: 3000000,
        addon_ecommerce: 8000000, addon_inventory_management: 5000000,
        // Giá Hosting CHƯA VAT (đã tính ngược từ giá có VAT 8%)
        hosting_5gb: 4872000, 
        hosting_7gb: 6000000, 
        hosting_10gb: 7200000, 
        hosting_16gb: 10560000, // Sửa giá gốc cho đúng với giá VAT hiển thị
        hosting_20gb_ca_nhan: 12000000, 
        hosting_25gb: 14400000, 
        hosting_30gb: 16080000, 
        hosting_40gb_dn: 20080000, 
        hosting_50gb_dn: 24000000, 
        hosting_70gb_dn: 32040000, 
        hosting_100gb_sieu_dn: 43200000, 
        hosting_200gb_sieu_dn: 72000000, 
        // Giá Tên miền CHƯA VAT (đã tính ngược từ giá có VAT 8%)
        domain_com: 339000,  // (366120 / 1.08)
        domain_vn: 759259,   // (820000 / 1.08) làm tròn
        domain_com_vn: 639815 // (691000 / 1.08) làm tròn
    };

    let currentDiscountAmount = 0;
    let currentDiscountType = 'none';

    // Hàm tính giá cuối cùng (đã bao gồm VAT) - Giữ nguyên
    const calculateFinalPrice = (basePrice, vatRate) => basePrice * (1 + vatRate);
    
    // Xử lý bỏ chọn radio - Giữ nguyên
    const lastCheckedState = new Map();
    const handleRadioDeselect = (event) => {
        const currentRadio = event.target;
        const radioGroup = currentRadio.name;
        if (lastCheckedState.get(radioGroup) === currentRadio.id) {
            event.preventDefault(); 
            currentRadio.checked = false; 
            lastCheckedState.set(radioGroup, null); 
            calculateTotal(); 
        } else {
            lastCheckedState.set(radioGroup, currentRadio.id); 
        }
    };

    // Hàm định dạng tiền tệ - Giữ nguyên
    const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(Math.round(amount));

    // Hàm xử lý khi đổi ngành - Giữ nguyên
    const handleIndustryChange = () => {
        document.querySelectorAll('.addon-group').forEach(group => group.style.display = 'none');
        const selectedRadio = document.querySelector('input[name="industry-option"]:checked');
        if (selectedRadio) {
            const selectedIndustryId = selectedRadio.value;
            const activeAddonGroup = document.getElementById(`addons-${selectedIndustryId}`);
            if (activeAddonGroup) activeAddonGroup.style.display = 'grid'; 
        }
        // Bỏ chọn tất cả addon khi đổi ngành
        document.querySelectorAll('input[name="addon-feature"]:checked').forEach(checkbox => checkbox.checked = false);
        calculateTotal();
    };

    // Hàm áp dụng mã giảm giá - Giữ nguyên
    const applyDiscount = () => {
        const inputEl = document.getElementById('discount-code-input');
        const statusEl = document.getElementById('discount-status');
        const code = inputEl.value.trim().toUpperCase();
        
        currentDiscountAmount = 0; 
        currentDiscountType = 'none'; 
        statusEl.textContent = '';
        statusEl.className = 'text-xs font-semibold h-4 -mt-2 mb-1'; 

        if (code === '') { 
            statusEl.textContent = 'Vui lòng nhập mã.'; 
            statusEl.classList.add('text-red-600'); 
            calculateTotal(); 
            return; 
        }

        // Logic kiểm tra mã
        if (code.startsWith('FI') && code.endsWith('PT')) {
            const percent = parseFloat(code.substring(2, code.length - 2));
            if (!isNaN(percent) && percent > 0) {
                currentDiscountAmount = percent; currentDiscountType = 'percent'; statusEl.textContent = `Áp dụng giảm ${percent}%.`; statusEl.classList.add('text-green-600');
            } else { statusEl.textContent = 'Mã % không hợp lệ.'; statusEl.classList.add('text-red-600'); }
        } else if (code.startsWith('FI') && code.endsWith('TR')) {
            let amountString = code.substring(2, code.length - 2); let amount = 0;
            // Xử lý trường hợp có "TR" (ví dụ FI1TR5TR = 1.5 triệu)
            if (amountString.includes('TR')) {
                const parts = amountString.split('TR'); 
                const trieu = parseFloat(parts[0]); 
                const tram = parseFloat(parts[1]) / 10; // Chia 10 vì 5 = 5 trăm = 0.5 triệu
                if (!isNaN(trieu) && !isNaN(tram)) amount = (trieu + tram) * 1000000;
            } else { // Trường hợp chỉ có số (ví dụ FI2TR = 2 triệu)
                amount = parseFloat(amountString) * 1000000; 
            }
            // Kiểm tra kết quả
            if (!isNaN(amount) && amount > 0) {
                currentDiscountAmount = amount; currentDiscountType = 'fixed'; statusEl.textContent = `Áp dụng giảm ${formatCurrency(amount)}.`; statusEl.classList.add('text-green-600');
            } else { statusEl.textContent = 'Mã tiền mặt không hợp lệ.'; statusEl.classList.add('text-red-600'); }
        } else { statusEl.textContent = 'Mã không hợp lệ (FI...PT/TR).'; statusEl.classList.add('text-red-600'); }
        
        calculateTotal();
    };

    // Hàm tính tổng chi phí - Giữ nguyên logic, chỉ kiểm tra null cho element
    const calculateTotal = () => {
        let packageBasePrice = 0, currentAddonBaseCost = 0, hostingBasePrice = 0, domainBasePrice = 0;
        
        const selectedPackage = document.querySelector('input[name="package-option"]:checked');
        if (selectedPackage && PRICES_BASE[selectedPackage.id]) {
            packageBasePrice = PRICES_BASE[selectedPackage.id];
        }

        const selectedIndustryRadio = document.querySelector('input[name="industry-option"]:checked');
        if (selectedIndustryRadio) {
            const activeAddonGroup = document.getElementById(`addons-${selectedIndustryRadio.value}`);
            if (activeAddonGroup && activeAddonGroup.style.display !== 'none') {
                activeAddonGroup.querySelectorAll('input[name="addon-feature"]:checked').forEach(cb => { 
                    if (PRICES_BASE[cb.id]) {
                        currentAddonBaseCost += PRICES_BASE[cb.id]; 
                    }
                });
            }
        }

        const selectedHosting = document.querySelector('input[name="hosting-option"]:checked');
        if (selectedHosting && PRICES_BASE[selectedHosting.id]) {
            hostingBasePrice = PRICES_BASE[selectedHosting.id];
        }
        
        const selectedDomain = document.querySelector('input[name="domain-option"]:checked');
        if (selectedDomain && PRICES_BASE[selectedDomain.id]) {
            domainBasePrice = PRICES_BASE[selectedDomain.id];
        }
        
        // Tính giảm giá trên tổng gói TK + Addon (CHƯA VAT)
        let totalDesignBaseCost = packageBasePrice + currentAddonBaseCost;
        let finalDiscountAmount = 0; // Số tiền giảm giá thực tế (CHƯA VAT)
        if (currentDiscountType === 'percent') {
            finalDiscountAmount = totalDesignBaseCost * (currentDiscountAmount / 100);
        } else if (currentDiscountType === 'fixed') {
            finalDiscountAmount = currentDiscountAmount;
        }
        // Đảm bảo giảm giá không vượt quá tổng tiền thiết kế
        if (finalDiscountAmount > totalDesignBaseCost) {
            finalDiscountAmount = totalDesignBaseCost;
        }
        const totalDesignCostAfterDiscountBase = totalDesignBaseCost - finalDiscountAmount;

        // Tính các giá trị cuối cùng ĐÃ VAT để hiển thị
        const packageFinalCost = calculateFinalPrice(packageBasePrice, VAT_RATE_0); 
        const addonFinalCost = calculateFinalPrice(currentAddonBaseCost, VAT_RATE_0); 
        // Giá trị giảm giá hiển thị (đã bao gồm VAT 0% nên bằng giá trị gốc)
        const displayDiscountAmount = finalDiscountAmount; 
        const hostingFinalCost = calculateFinalPrice(hostingBasePrice, VAT_RATE_8);
        const domainFinalCost = calculateFinalPrice(domainBasePrice, VAT_RATE_8);
        const totalInfrastructureFinalCost = hostingFinalCost + domainFinalCost;
        // Tổng cuối cùng = (Thiết kế + Addon - Giảm giá) + (Hosting + Domain + VAT hạ tầng)
        const totalFinalCost = calculateFinalPrice(totalDesignCostAfterDiscountBase, VAT_RATE_0) + totalInfrastructureFinalCost;
        
        // Tính VAT hạ tầng riêng để hiển thị
        const infrastructureBaseCost = hostingBasePrice + domainBasePrice;
        const vatAmount = calculateFinalPrice(infrastructureBaseCost, VAT_RATE_8) - infrastructureBaseCost;

        const formatShortCurrency = (amount) => formatCurrency(amount).replace(" VNĐ", " đ");

        // Hiển thị (Thêm kiểm tra element tồn tại)
        const packagePriceDisplay = document.getElementById('package-price-display');
        const addonPriceDisplay = document.getElementById('addon-price-display');
        const discountPriceDisplay = document.getElementById('discount-price-display');
        const hostingPriceDisplay = document.getElementById('hosting-price-display');
        const domainPriceDisplay = document.getElementById('domain-price-display');
        const vatDisplay = document.getElementById('vat-display');
        const totalCostDisplay = document.getElementById('total-cost-display');
        const totalCostDisplayMinimal = document.getElementById('total-cost-display-minimal');

        if(packagePriceDisplay) packagePriceDisplay.textContent = formatShortCurrency(packageFinalCost);
        if(addonPriceDisplay) addonPriceDisplay.textContent = formatShortCurrency(addonFinalCost);
        // Hiển thị giá trị giảm giá là số âm
        if(discountPriceDisplay) discountPriceDisplay.textContent = formatShortCurrency(-displayDiscountAmount); 
        if(hostingPriceDisplay) hostingPriceDisplay.textContent = formatShortCurrency(hostingFinalCost); 
        if(domainPriceDisplay) domainPriceDisplay.textContent = formatShortCurrency(domainFinalCost); 
        if(vatDisplay) vatDisplay.textContent = formatShortCurrency(vatAmount);
        if(totalCostDisplay) totalCostDisplay.textContent = formatShortCurrency(totalFinalCost);
        if(totalCostDisplayMinimal) totalCostDisplayMinimal.textContent = formatShortCurrency(totalFinalCost);


        // Lưu dữ liệu để dùng trong finalizeQuote
        window.costData = { 
            // Lưu giá trị ĐÃ VAT để hiển thị trong modal
            totalDesignCost: calculateFinalPrice(totalDesignCostAfterDiscountBase, VAT_RATE_0), 
            totalInfrastructureCost: totalInfrastructureFinalCost, 
            hostingFinalCost, 
            domainFinalCost, 
            totalFinalCost, 
            finalDiscountAmount: displayDiscountAmount // Lưu số tiền giảm giá đã hiển thị
        };
    };

    // Hàm mở/đóng gói hosting thêm - Giữ nguyên
    const toggleExtraPackages = () => {
        const container = document.getElementById('extra-hosting-packages');
        const button = document.getElementById('toggle-extra-packages-btn');
        if (!container || !button) return; 

        container.classList.toggle('expanded');
        if (container.classList.contains('expanded')) {
            button.textContent = 'Thu gọn các gói Hosting'; 
            button.classList.remove('bg-gray-500'); 
            button.classList.add('bg-red-500'); 
        } else {
            button.textContent = 'Xem thêm các gói Hosting khác'; 
            button.classList.remove('bg-red-500'); 
            button.classList.add('bg-gray-500'); 
        }
    };

    // Hàm hiển thị modal - Giữ nguyên
    const showAlert = (title, message, type = 'error') => {
        const modal = document.getElementById('alert-modal');
        const modalTitle = document.getElementById('alert-title');
        const modalMessage = document.getElementById('alert-message');
        const closeBtn = document.getElementById('alert-close-btn');
        
        if (!modal || !modalTitle || !modalMessage || !closeBtn) return; 
        
        modalTitle.textContent = title; 
        modalMessage.innerHTML = message; 

        // Đổi màu dựa trên type
        if (type === 'success') {
            modalTitle.className = "text-xl sm:text-2xl font-bold text-emerald-400 mb-4"; 
            // Sử dụng màu indigo-600 và indigo-700
            closeBtn.className = "w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-full hover:bg-indigo-700 transition duration-300"; 
        } else { // type 'error' hoặc khác
            modalTitle.className = "text-xl sm:text-2xl font-bold text-orange-400 mb-4"; 
            closeBtn.className = "w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-full hover:bg-orange-600 transition duration-300";
        }
        
        modal.classList.remove('hidden'); 
    };

    // Hàm ẩn modal - Giữ nguyên
    const hideAlert = () => { 
        const modal = document.getElementById('alert-modal'); 
        if (modal) modal.classList.add('hidden'); 
    };
     const alertCloseBtn = document.getElementById('alert-close-btn');
     if (alertCloseBtn) alertCloseBtn.addEventListener('click', hideAlert);

    // Hàm mở/đóng panel báo giá - Giữ nguyên
    const toggleQuotePanel = () => {
        const footer = document.getElementById('quote-summary-footer');
        const panel = document.getElementById('quote-details-panel');
        if (!footer || !panel) return;
        
        footer.classList.toggle('panel-open'); 
        panel.classList.toggle('expanded'); 
    };
     // Gán hàm cho trigger


    // Hàm finalize - Cập nhật để dùng giá trị ĐÃ VAT từ window.costData
    const finalizeQuote = () => {
        // Kiểm tra data có tồn tại không
        if (!window.costData) {
            console.error("Chưa có dữ liệu chi phí. Vui lòng chọn gói.");
            // Có thể hiển thị thông báo lỗi cho người dùng ở đây
            showAlert('Lỗi', '<p class="text-gray-300">Chưa có dữ liệu chi phí. Vui lòng chọn ít nhất một gói thiết kế.</p>', 'error');
            return;
        }

        const data = window.costData;
        const selectedPackage = document.querySelector('input[name="package-option"]:checked');
        const selectedHosting = document.querySelector('input[name="hosting-option"]:checked');
        const selectedDomain = document.querySelector('input[name="domain-option"]:checked');
        
        // Kiểm tra gói thiết kế đã chọn
        if (!selectedPackage) {
            const panel = document.getElementById('quote-details-panel');
            if (panel && panel.classList.contains('expanded')) {
                toggleQuotePanel(); 
            }
            const packageSection = document.getElementById('package-section'); 
            if (packageSection) packageSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const errorHtml = `<div class="text-center"><p class="text-base text-gray-300">Bạn cần chọn một <b>Gói Thiết kế (ở mục II)</b>.</p><p class="text-sm text-gray-400 mt-2">Trang sẽ tự động cuộn đến mục còn thiếu.</p></div>`;
            setTimeout(() => { showAlert('Vui lòng hoàn tất', errorHtml, 'error'); }, 400); 
            return; 
        }

        // Tính 50% chi phí thiết kế (đã giảm giá, ĐÃ VAT 0%)
        const designCostHalf = data.totalDesignCost / 2; 
        // Lấy tổng chi phí hạ tầng (ĐÃ VAT 8%)
        const totalInfrastructureCost = data.totalInfrastructureCost; 
        // Định dạng tiền tệ
        const designCostHalfFormatted = formatCurrency(designCostHalf);
        const totalInfrastructureCostFormatted = formatCurrency(totalInfrastructureCost);
        const totalFinalCostFormatted = formatCurrency(data.totalFinalCost);
        
        // Xây dựng nội dung modal
        let paymentDetails = `<div class="w-full text-left space-y-4"><div><p class="text-sm text-gray-400 uppercase tracking-wide">TỔNG CHI PHÍ DỰ KIẾN (ĐÃ VAT):</p><p class="text-2xl sm:text-3xl font-bold text-white">${totalFinalCostFormatted}</p></div>`;
        if (data.finalDiscountAmount > 0) {
            // Hiển thị số tiền giảm giá đã lưu
            paymentDetails += `<div><p class="text-sm text-gray-400 uppercase tracking-wide">ĐÃ GIẢM (Gói Web + Add-on):</p><p class="text-lg sm:text-xl font-bold text-green-500">-${formatCurrency(data.finalDiscountAmount)}</p></div>`;
        }
        // Sử dụng màu indigo-600 và cyan-600
        paymentDetails += `<hr class="my-4 border-gray-600"><p class="text-base font-semibold text-gray-200 mb-3">PHƯƠNG THỨC THANH TOÁN (3 ĐỢT):</p><div class="space-y-3"><div><p class="font-semibold text-indigo-600">ĐỢT 1 (Ký Hợp đồng):</p><p class="text-sm text-gray-300"><b>Chi phí:</b> ${designCostHalfFormatted}</p><p class="text-sm text-gray-300"><b>Nội dung:</b> 50% Chi phí Thiết kế (Đã Giảm giá)</p></div><div><p class="font-semibold text-cyan-600">ĐỢT 2 (Triển khai Hạ tầng):</p><p class="text-sm text-gray-300"><b>Chi phí:</b> ${totalInfrastructureCostFormatted}</p><p class="text-sm text-gray-300"><b>Nội dung:</b> 100% Hosting & Tên miền (Đã VAT)</p></div><div><p class="font-semibold text-indigo-600">ĐỢT 3 (Bàn giao & Nghiệm thu):</p><p class="text-sm text-gray-300"><b>Chi phí:</b> ${designCostHalfFormatted}</p><p class="text-sm text-gray-300"><b>Nội dung:</b> 50% Chi phí Thiết kế còn lại + Hướng dẫn</p></div></div></div>`;
        
        let warningMessage = '';
        if (!selectedHosting || !selectedDomain) {
            warningMessage = `<div class="mt-4 border-t border-gray-600 pt-4"><p class="text-sm text-orange-400 font-semibold">⚠️ CẢNH BÁO:</p><p class="text-sm text-gray-300">Vui lòng chọn Hosting và Tên miền để có thể thanh toán Đợt 2.</p></div>`;
        }
        const contactMessage = `<hr class="my-4 border-gray-600"><p class="text-sm text-center text-gray-400">Chúng tôi sẽ liên hệ lại ngay (<b>0909876817</b>) để xác nhận.</p>`;
        
        showAlert('Yêu cầu báo giá thành công!', paymentDetails + warningMessage + contactMessage, 'success');
    };
    
    // Gán hàm finalizeQuote, toggleQuotePanel, hideAlert bằng addEventListener
     const finalizeButton = document.querySelector('button[onclick="finalizeQuote()"]');
     if (finalizeButton) {
         finalizeButton.removeAttribute('onclick'); // Xóa attribute cũ
         finalizeButton.addEventListener('click', finalizeQuote); // Gán listener mới
     }
     const triggerPanel = document.getElementById('quote-summary-trigger');
     if(triggerPanel){
         triggerPanel.removeAttribute('onclick');
         triggerPanel.addEventListener('click', toggleQuotePanel);
     }
     const alertModalBg = document.getElementById('alert-modal');
     if(alertModalBg){
         alertModalBg.removeAttribute('onclick');
         alertModalBg.addEventListener('click', hideAlert);
         // Ngăn chặn đóng modal khi click vào content bên trong
         const alertModalContent = alertModalBg.querySelector('div:first-child'); // Lấy div con đầu tiên
         if(alertModalContent) {
             alertModalContent.removeAttribute('onclick');
             alertModalContent.addEventListener('click', (event) => event.stopPropagation());
         }
     }


    // === GẮN CÁC EVENT LISTENERS ===
    
    // Listeners cho các input giá - Giữ nguyên
    document.querySelectorAll('input[name="package-option"], input[name="hosting-option"], input[name="domain-option"], input[name="addon-feature"]').forEach(input => {
        input.addEventListener('change', calculateTotal);
    });
    
    // Listeners cho radio để bỏ chọn - Giữ nguyên
    document.querySelectorAll('input[name="package-option"], input[name="hosting-option"], input[name="domain-option"]').forEach(input => { 
        input.addEventListener('click', handleRadioDeselect); 
        // Bỏ check mặc định khi tải trang
        // if (input.checked) input.checked = false; 
    });
    
    // Listener cho nút "Xem thêm gói Hosting" - Giữ nguyên
    const toggleExtraBtn = document.getElementById('toggle-extra-packages-btn');
    if (toggleExtraBtn) toggleExtraBtn.addEventListener('click', toggleExtraPackages);
    
    // Listeners cho radio chọn ngành - Giữ nguyên
    document.querySelectorAll('input[name="industry-option"]').forEach(input => {
        input.addEventListener('change', handleIndustryChange);
    });
    
    // Listener cho nút "Áp dụng" mã giảm giá - Giữ nguyên
    const applyDiscountBtn = document.getElementById('apply-discount-btn');
    if (applyDiscountBtn) applyDiscountBtn.addEventListener('click', applyDiscount);

    // --- KHỞI TẠO TRẠNG THÁI BAN ĐẦU ---
    // Chọn sẵn ngành Y Tế - Giữ nguyên
    const initialIndustry = document.getElementById('industry-yte');
    if(initialIndustry) initialIndustry.checked = true;
    handleIndustryChange(); // Gọi để ẩn/hiện addon đúng
    
    // Tính tổng giá lần đầu - Giữ nguyên
    calculateTotal(); 

}); // --- KẾT THÚC DOMContentLoaded ---