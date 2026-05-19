const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());
// Cấu hình CORS mở hoàn toàn để nhận diện được mọi tên miền từ Vercel
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Điền chuỗi kết nối Database lấy từ Neon.tech vào đây
const connectionString = "postgresql://neondb_owner:npg_YTFb4NMX6jyK@ep-falling-rain-apkbnznb-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false } // Bắt buộc phải có để kết nối an toàn bảo mật Cloud
});

// 1. API ĐĂNG KÝ
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, fullname } = req.body;
        await pool.query(
            'INSERT INTO Users (Username, Password, FullName) VALUES ($1, $2, $3)', 
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
            'SELECT Id, Username, FullName FROM Users WHERE Username = $1 AND Password = $2', 
            [username, password]
        );
        if (result.rows.length > 0) {
            // Trả về thuộc tính chữ HOA đầu để đồng bộ với mã nguồn cũ của bạn
            const user = {
                Id: result.rows[0].id,
                Username: result.rows[0].username,
                FullName: result.rows[0].fullname
            };
            res.json({ success: true, user });
        } else {
            res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu!" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 3. API LẤY DANH SÁCH GIAO DỊCH
app.get('/api/transactions/:userId', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id AS "Id", title AS "Title", amount AS "Amount", createdat AS "CreatedAt" FROM Transactions WHERE UserId = $1 ORDER BY createdat DESC', 
            [req.params.userId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 4. API THÊM MỚI
app.post('/api/transactions', async (req, res) => {
    try {
        const { userId, title, amount } = req.body;
        await pool.query(
            'INSERT INTO Transactions (UserId, Title, Amount) VALUES ($1, $2, $3)', 
            [userId, title, amount]
        );
        res.json({ success: true, message: "Lưu thành công!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 5. API CẬP NHẬT (SỬA)
app.put('/api/transactions/:id', async (req, res) => {
    try {
        const { title, amount } = req.body;
        await pool.query(
            'UPDATE Transactions SET Title = $1, Amount = $2 WHERE Id = $3', 
            [title, amount, req.params.id]
        );
        res.json({ success: true, message: "Cập nhật thành công!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 6. API XÓA
app.delete('/api/transactions/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM Transactions WHERE Id = $1', [req.params.id]);
        res.json({ success: true, message: "Xóa thành công!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Cấu hình cổng chạy Online tự động nhận diện từ nền tảng đám mây
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server chạy online tại cổng ${PORT}`));
app.get('/', (req, res) => {
  res.send('Backend Node.js đã chạy thành công trên Vercel!');
});

app.get('/', (req, res) => {
  res.json({ message: "Backend Node.js kết nối Vercel & Neon đã chạy thành công!" });
});
