// assets/js/project-data.js
// Chứa danh sách các dự án. Mỗi dự án là một object.
// QUAN TRỌNG: KHÔNG XÓA DÒNG `const projectsData = ` VÀ DẤU `];` Ở CUỐI.
// Chỉ chỉnh sửa nội dung bên trong dấu ngoặc vuông [...].
// Copy toàn bộ nội dung từ trang admin và dán ĐÈ LÊN toàn bộ nội dung cũ của file này.

const projectsData = [
  {
    "id": 1,
    "title": "Website Phòng khám Đa khoa Sài Gòn",
    "category": "Y tế",
    "description": "Website giới thiệu 15+ chuyên khoa, đặt lịch khám online, tra cứu bác sĩ. Tích hợp thanh toán VNPAY, tối ưu SEO Local.",
    "imageUrl": "https://placehold.co/600x400/e0e7ff/4f46e5?text=Phong+Kham",
    "link": "#"
  },
  {
    "id": 2,
    "title": "App Y tế HealthTrack",
    "category": "Ứng dụng Sức khỏe",
    "description": "Ứng dụng theo dõi sức khỏe cá nhân: đo chỉ số BMI, lịch sử khám bệnh, nhắc uống thuốc. Hỗ trợ iOS & Android.",
    "imageUrl": "https://placehold.co/600x400/c7d2fe/4338ca?text=Health+App",
    "link": "#"
  },
  {
    "id": 3,
    "title": "Website Công ty Xây dựng Phương Nam",
    "category": "Xây dựng",
    "description": "Portfolio 50+ dự án hoàn thành, công cụ ước tính chi phí thi công, blog chia sẻ xu hướng kiến trúc. Tích hợp CRM Zoho.",
    "imageUrl": "https://placehold.co/600x400/a5b4fc/3730a3?text=Xay+Dung",
    "link": "#"
  },
  {
    "id": 4,
    "title": "Landing Page Tech Summit 2024",
    "category": "Landing Page Sự kiện",
    "description": "Trang đăng ký sự kiện công nghệ với 2000+ attendees. Form đăng ký tối ưu chuyển đổi 35%, countdown timer, tích hợp Google Analytics.",
    "imageUrl": "https://placehold.co/600x400/818cf8/ede9fe?text=Landing+Page",
    "link": "#"
  },
  {
    "id": 5,
    "title": "Blog Marketing Hub",
    "category": "Website Tin tức/Blog",
    "description": "Nền tảng blog 200+ bài viết về Digital Marketing. Tối ưu SEO đạt top 3 Google với 15 từ khóa chính, tốc độ tải 95/100 PageSpeed.",
    "imageUrl": "https://placehold.co/600x400/6366f1/eef2ff?text=Blog",
    "link": "#"
  },
  {
    "id": 6,
    "title": "App Đặt lịch Spa Beauty House",
    "category": "Ứng dụng Đặt lịch",
    "description": "Ứng dụng đặt lịch hẹn cho chuỗi 8 spa. Quản lý lịch nhân viên, điểm tích lũy, push notification nhắc lịch. Giảm no-show 40%.",
    "imageUrl": "https://placehold.co/600x400/4f46e5/ddd6fe?text=Spa+App",
    "link": "#"
  },
  {
    "id": 7,
    "title": "Website Bất động sản HomeLand",
    "category": "Bất động sản",
    "description": "Nền tảng tìm kiếm 5000+ bất động sản. Bộ lọc thông minh, bản đồ tương tác, chatbot AI tư vấn 24/7. Tích hợp CRM Salesforce.",
    "imageUrl": "https://placehold.co/600x400/312e81/c7d2fe?text=Bat+Dong+San",
    "link": "#"
  },
  {
    "id": 8,
    "title": "Portfolio Nhiếp ảnh Minh Anh",
    "category": "Portfolio Cá nhân",
    "description": "Trang portfolio cá nhân với gallery 300+ ảnh chất lượng cao, hiệu ứng parallax, tối ưu lazy loading. Tốc độ tải < 2 giây.",
    "imageUrl": "https://placehold.co/600x400/4338ca/d1d5db?text=Portfolio",
    "link": "#"
  },
  {
    "id": 9,
    "title": "Website E-learning TechAcademy",
    "category": "Website Giáo dục",
    "description": "Nền tảng học trực tuyến 50+ khóa học lập trình. Video streaming, bài kiểm tra tự động, cấp chứng chỉ. 3000+ học viên đăng ký.",
    "imageUrl": "https://placehold.co/600x400/a78bfa/f3e8ff?text=E-learning",
    "link": "#"
  },
  {
    "id": 10,
    "title": "Website E-commerce TechStore",
    "category": "Website Thương mại điện tử",
    "description": "Website bán lẻ thiết bị công nghệ: giỏ hàng, thanh toán đa kênh (VNPAY/Momo), quản lý tồn kho, tích hợp vận chuyển GHN/GHTK.",
    "imageUrl": "https://placehold.co/600x400/e0e7ff/4f46e5?text=E-commerce",
    "link": "#"
  },
  {
    "id": 11,
    "title": "Website Nội thất Hoàng Gia",
    "category": "Nội thất",
    "description": "Showroom ảo 360°, công cụ thiết kế phòng 3D, tư vấn phong thủy. Tích hợp ERP quản lý đơn hàng và thi công.",
    "imageUrl": "https://placehold.co/600x400/c7d2fe/4338ca?text=Noi+That",
    "link": "#"
  },
  {
    "id": 12,
    "title": "Website Thực phẩm Organic Farm",
    "category": "Thực phẩm",
    "description": "Website giới thiệu và bán thực phẩm organic. Blog chia sẻ công thức nấu ăn, đặt hàng theo mùa, giao hàng định kỳ.",
    "imageUrl": "https://placehold.co/600x400/a5b4fc/3730a3?text=Organic",
    "link": "#"
  }
];