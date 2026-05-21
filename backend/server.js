const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());

// Cấu hình CORS mở hoàn toàn tiếp nhận các yêu cầu từ tên miền Frontend
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Chuỗi kết nối đến dịch vụ Neon.tech của bạn
const connectionString = "postgresql://neondb_owner:npg_YTFb4NMX6jyK@ep-falling-rain-apkbnznb-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
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

// 3. API LẤY DANH SÁCH GIAO DỊCH (ĐÃ THÊM CỘT TYPE VÀO SELECT)
// Ví dụ cấu trúc đúng
app.get('/api/transactions', async (req, res) => {
    const { userId } = req.query; // hoặc lấy từ session/token
    try {
        const result = await pool.query(
            'SELECT id, title, amount, type, createdat FROM transactions WHERE userid = $1 ORDER BY createdat DESC', 
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
});

// 4. API THÊM MỚI GIAO DỊCH (ĐÃ CẬP NHẬT TRƯỜNG TYPE)
app.post('/api/transactions', async (req, res) => {
    try {
        const userId = req.body.userId || req.body.userid;
        const { title, amount, type } = req.body;
        
        if (!userId || !title || amount === undefined) {
            return res.status(400).json({ success: false, message: "Thiếu dữ liệu đầu vào (userId, title hoặc amount)!" });
        }

        const parsedUserId = parseInt(userId, 10);
        const parsedAmount = parseFloat(amount);
        const transactionType = type || (parsedAmount >= 0 ? 'income' : 'expense');

        if (isNaN(parsedUserId)) {
            return res.status(400).json({ success: false, message: "ID người dùng không hợp lệ (Phải là số)!" });
        }

        // Thực hiện ghi vào database bao gồm cả giá trị cột type để không bị null
        await pool.query(
            'INSERT INTO transactions (userid, title, amount, type, createdat) VALUES ($1, $2, $3, $4, NOW())', 
            [parsedUserId, title, parsedAmount, transactionType]
        );
        
        res.json({ success: true, message: "Lưu giao dịch thành công!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Lỗi hệ thống: " + err.message });
    }
});

// 5. API CẬP NHẬT / SỬA GIAO DỊCH (ĐÃ ĐỒNG BỘ THÊM CỘT TYPE)
app.put('/api/transactions/:id', async (req, res) => {
    try {
        const { title, amount, type } = req.body;
        const parsedAmount = parseFloat(amount);
        const transactionType = type || (parsedAmount >= 0 ? 'income' : 'expense');

        await pool.query(
            'UPDATE transactions SET title = $1, amount = $2, type = $3 WHERE id = $4', 
            [title, parsedAmount, transactionType, req.params.id]
        );
        res.json({ success: true, message: "Cập nhật giao dịch thành công!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 6. API XÓA GIAO DỊCH
app.delete('/api/transactions/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM transactions WHERE id = $1', [req.params.id]);
        res.json({ success: true, message: "Xóa giao dịch thành công!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/', (req, res) => {
    res.json({ message: "Backend Node.js kết nối Neon PostgreSQL đám mây đang chạy tốt!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Hệ thống Server hoạt động ổn định tại cổng ${PORT}`));
