// assets/js/project-data.js
// Chứa danh sách các dự án. Mỗi dự án là một object.
// QUAN TRỌNG: KHÔNG XÓA DÒNG `const projectsData = ` VÀ DẤU `];` Ở CUỐI.
// Chỉ chỉnh sửa nội dung bên trong dấu ngoặc vuông [...].
// Copy toàn bộ nội dung từ trang admin và dán ĐÈ LÊN toàn bộ nội dung cũ của file này.

const projectsData = [
  {
    "id": 1,
    "title": "Website Kiến Trúc Phong Thủy",
    "category": "Xây dựng",
    "description": "Portfolio 50+ dự án hoàn thành, công cụ thước lỗ ban, blog chia sẻ xu hướng kiến trúc và kiến thức phong thủy.",
    "imageUrl": "assets/images/da/ptkn.webp",
    "link": "https://kientrucphongthuykynam.vn"
  },
  {
    "id": 2,
    "title": "Website Tập Đoàn Máy Làm Đá Viên Việt An",
    "category": "Thương mại điện tử",
    "description": "Website thương mại điện tử với 4 ngôn ngữ siêu chuẩn, Tích hợp thanh toán VNPAY, tối ưu SEO Local, tích hợp Google Analytics, Tích hợp ERP quản lý đơn hàng và thi công. ",
    "imageUrl": "assets/images/da/va.png",
    "link": "https://maylamdavien.vn"
  },
  {
    "id": 3,
    "title": "Website Công Ty Xây Dựng Happy House",
    "category": "Xây dựng",
    "description": "Portfolio 50+ dự án hoàn thành, công cụ ước tính chi phí thi công, blog chia sẻ xu hướng kiến trúc.",
    "imageUrl": "assets/images/da/hph.webp",
    "link": "https://xaydunghappyhouse.vn"
  },
  {
    "id": 4,
    "title": "Website BS. Tuấn - Giám Đốc BV Phương Nam",
    "category": "Y tế",
    "description": "Website giới thiệu chuyên khoa, đặt lịch khám online, tra cứu bác sĩ. Tích hợp thanh toán VNPAY, tối ưu SEO Local, tích hợp Google Analytics.",
    "imageUrl": "assets/images/da/bst.png",
    "link": "http://bsnguyenhoangtuan.com/"
  },
  {
    "id": 5,
    "title": "Website BS. Hiêu - Trưởng Khoa Cơ Xương Khớp BV Quân Y 7A",
    "category": "Y tế",
    "description": "Website giới thiệu chuyên khoa, đặt lịch khám online, theo dõi tiến độ. Tối ưu SEO Local, tích hợp Google Analytics. Tối ưu SEO đạt top 3 Google với 15 từ khóa chính, tốc độ tải 95/100 PageSpeed.",
    "imageUrl": "assets/images/da/bsh.webp",
    "link": "https://bsnguyenngochieu.com/"
  },
  {
    "id": 6,
    "title": "Website Công Ty Cổ Phần Trường Thịnh",
    "category": "Xây dựng",
    "description": "Giới thiệu thương hiệu Haky, Alpes, Maslai, tích hợp sơn thử bằng trí tuệ nhân tạo, bảng màu, công cụ ước tính lượng sơn cần dùng.",
    "imageUrl": "assets/images/da/sonth.png",
    "link": "https://sontotvn.com"
  },
  {
    "id": 7,
    "title": "Website Nguyên Liệu Pha Chế Thành Huy",
    "category": "Thương mại điện tử",
    "description": "Kênh thương mại chính chủ không mất phí qua trung gian như Shopee, Lazada, Amazon. Đảm bảo lợi nhuận và thương hiệu Thành Huy",
    "imageUrl": "assets/images/da/nlth.png",
    "link": "https://nguyenlieuthanhhuy.com"
  },
  {
    "id": 8,
    "title": "Website Công Ty Cổ Phần Thiết Bị Xây Dựng HD",
    "category": "Thiết bị & Máy móc",
    "description": "Trang website giới thiệu sản phẩm, tối ưu lazy loading. Tốc độ tải < 2 giây.",
    "imageUrl": "assets/images/da/tbhd.png",
    "link": "https://thietbixaydunghd.com/"
  },
  {
    "id": 9,
    "title": "Website Công Ty Giấy Cúng An Thành Phát",
    "category": "Thương mại điện tử",
    "description": "Trang website giới thiệu sản phẩm, Sở hữu nhiều từ khóa top từ khu vực cho đến toàn quốc, tìm là ra, tối ưu lazy loading. ",
    "imageUrl": "assets/images/da/atp.webp",
    "link": "http://congtygiaycunganthanhphat.com/"
  },
  {
    "id": 10,
    "title": "Website Công Ty Cơ Khí Chính Xác DHT",
    "category": "Cơ Khí",
    "description": "Website giới thiệu Hồ sơ năng lực, tìm kiếm nhà đầu tư, đối tác sản xuất trong lĩnh vực CNC.",
    "imageUrl": "assets/images/da/dht.png",
    "link": "https://dhtgroup739.com.vn"
  },
  {
    "id": 11,
    "title": "Website Nội Thất Cũ Xưa Tịnh Quang",
    "category": "Nội thất",
    "description": "Showroom ảo 360°, công cụ thiết kế phòng 3D, tư vấn phong thủy. Tích hợp ERP quản lý đơn hàng và thi công.",
    "imageUrl": "assets/images/da/chu-tinh.webp",
    "link": "https://thumuadocuxua.com/"
  },
  {
    "id": 12,
    "title": "Website Đại Long Bình Phước",
    "category": "Giới thiệu việc làm",
    "description": "Website giới thiệu việc làm và cho thuê xe nâng của anh Long - Công an tỉnh Bình Phước cũ.",
    "imageUrl": "assets/images/da/dlbp.webp",
    "link": "http://dailongbinhphuoc.com/"
  }
];
