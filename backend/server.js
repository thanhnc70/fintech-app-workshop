const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());

// Cấu hình CORS mở hoàn toàn để tiếp nhận các yêu cầu từ tên miền Frontend trên Vercel
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Chuỗi kết nối đến dịch vụ Neon.tech của bạn
const connectionString = "postgresql://neondb_owner:npg_YTFb4NMX6jyK@ep-falling-rain-apkbnznb-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false } // Bắt buộc đảm bảo kết nối bảo mật đám mây
});

// 1. API ĐĂNG KÝ
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, fullname } = req.body;
        
        if (!username || !password || !fullname) {
            return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ thông tin!" });
        }

        await pool.query(
            'INSERT INTO users (username, password, fullname) VALUES ($1, $2, $3)', 
            [username, password, fullname]
        );
        res.json({ success: true, message: "Đăng ký tài khoản thành công!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Tài khoản đã tồn tại hoặc lỗi: " + err.message });
    }
});

// 2. API ĐĂNG NHẬP
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await pool.query(
            'SELECT id, username, fullname FROM users WHERE username = $1 AND password = $2', 
            [username, password]
        );
        
        if (result.rows.length > 0) {
            // Trả về cả 'id' lẫn 'userId' đảm bảo Frontend đọc kiểu gì cũng trúng đích
            res.json({ 
                success: true, 
                id: result.rows[0].id,
                userId: result.rows[0].id,
                fullname: result.rows[0].fullname,
                username: result.rows[0].username
            });
        } else {
            res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu!" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 3. API LẤY DANH SÁCH GIAO DỊCH
app.get('/api/transactions', async (req, res) => {
    try {
        // Bẫy lỗi: Nhận cả trường hợp Frontend gửi lên viết hoa hoặc viết thường (?userId=... hoặc ?userid=...)
        const userId = req.query.userId || req.query.userid; 
        
        if (!userId) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin ID người dùng!" });
        }

        const result = await pool.query(
            'SELECT id, title, amount, createdat FROM transactions WHERE userid = $1 ORDER BY createdat DESC', 
            [userId]
        );
        
        res.json({ success: true, transactions: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 4. API THÊM MỚI GIAO DỊCH (SỬA ĐỔI CHÍNH TẠI ĐÂY)
app.post('/api/transactions', async (req, res) => {
    try {
        // Bẫy lỗi: Chấp nhận cả userId (CamelCase) hoặc userid (viết thường) từ Frontend đẩy lên
        const userId = req.body.userId || req.body.userid;
        const { title, amount } = req.body;
        
        if (!userId || !title || amount === undefined) {
            return res.status(400).json({ success: false, message: "Thiếu dữ liệu đầu vào (userId, title hoặc amount)!" });
        }

        // Ép kiểu dữ liệu phòng hờ trường hợp Frontend gửi chuỗi văn bản sai định dạng số
        const parsedUserId = parseInt(userId, 10);
        const parsedAmount = parseFloat(amount);

        if (isNaN(parsedUserId)) {
            return res.status(400).json({ success: false, message: "ID người dùng không hợp lệ (Phải là số)!" });
        }

        // Thực hiện ghi vào database
        await pool.query(
            'INSERT INTO transactions (userid, title, amount, createdat) VALUES ($1, $2, $3, NOW())', 
            [parsedUserId, title, parsedAmount]
        );
        
        res.json({ success: true, message: "Lưu giao dịch thành công!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Lỗi hệ thống: " + err.message });
    }
});

// 5. API CẬP NHẬT / SỬA 
app.put('/api/transactions/:id', async (req, res) => {
    try {
        const { title, amount } = req.body;
        await pool.query(
            'UPDATE transactions SET title = $1, amount = $2 WHERE id = $3', 
            [title, amount, req.params.id]
        );
        res.json({ success: true, message: "Cập nhật giao dịch thành công!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 6. API XÓA 
app.delete('/api/transactions/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM transactions WHERE id = $1', [req.params.id]);
        res.json({ success: true, message: "Xóa giao dịch thành công!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Trang kiểm tra trạng thái hoạt động mặc định tại gốc hệ thống
app.get('/', (req, res) => {
    res.json({ message: "Backend Node.js kết nối Neon PostgreSQL đám mây đang chạy tốt!" });
});

// Khởi chạy hệ thống tích hợp cổng tự động từ máy chủ Render/Vercel
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Hệ thống Server hoạt động ổn định tại cổng ${PORT}`));
