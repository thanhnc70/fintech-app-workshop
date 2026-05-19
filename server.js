const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const dbConfig = {
    user: 'sa',
    password: '123456', // <--- Nhớ kiểm tra lại mật khẩu SQL của bạn
    server: 'localhost', 
    database: 'WebDauTien',
    options: { encrypt: false, trustServerCertificate: true }
};

// 1. API ĐĂNG KÝ
app.post('/api/register', async (req, res) => {
    const { username, password, fullname } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('user', sql.VarChar, username)
            .input('pass', sql.VarChar, password)
            .input('name', sql.NVarChar, fullname)
            .query('INSERT INTO Users (Username, Password, FullName) VALUES (@user, @pass, @name)');
        res.json({ success: true, message: "Đăng ký thành viên thành công rồi nhé!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Lỗi lưu DB: " + err.message });
    }
});

// 2. API ĐĂNG NHẬP (ĐÃ FIX: Lấy phần tử [0] để frontend đọc được Id)
// 2. API ĐĂNG NHẬP (ĐÃ CHUẨN HÓA ĐỂ SỬA LỖI CHUYỂN TRANG)
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .input('user', sql.VarChar, username)
            .input('pass', sql.VarChar, password)
            .query('SELECT Id, FullName FROM Users WHERE Username = @user AND Password = @pass');
        
        if (result.recordset && result.recordset.length > 0) {
            // SỬA CHÍNH XÁC DÒNG NÀY: Lấy phần tử đầu tiên [0] của mảng để trả về đúng 1 Object duy nhất chứa Id
            res.json({ 
                success: true, 
                message: "Đăng nhập thành công!", 
                user: result.recordset[0] 
            });
        } else {
            res.json({ success: false, message: "Không tìm thấy tài khoản này hoặc sai mật khẩu!" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Lỗi kết nối: " + err.message });
    }
});

// 3. API LẤY DANH SÁCH CHI TIÊU
app.get('/api/transactions/:userId', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .input('userId', sql.Int, req.params.userId)
            // Nhớ thêm chữ Id vào đầu câu lệnh SELECT này bạn nhé:
            .query('SELECT Id, Title, Amount, CreatedAt FROM Transactions WHERE UserId = @userId ORDER BY CreatedAt DESC');
        
        res.json(result.recordset || []); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. API THÊM KHOẢN THU/CHI
app.post('/api/transactions', async (req, res) => {
    const { userId, title, amount } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('title', sql.NVarChar, title)
            .input('amount', sql.Decimal(18,2), amount)
            .query('INSERT INTO Transactions (UserId, Title, Amount) VALUES (@userId, @title, @amount)');
        res.json({ success: true, message: "Đã ghi nhận giao dịch!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.listen(5000, () => console.log("🚀 Server thực tế đang chạy tại cổng 5000"));
// 4. API CẬP NHẬT GIAO DỊCH (SỬA)
app.put('/api/transactions/:id', async (req, res) => {
    try {
        const { title, amount } = req.body;
        const { id } = req.params;

        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('id', sql.Int, id)
            .input('title', sql.NVarChar(100), title)
            .input('amount', sql.Decimal(18, 2), amount)
            .query('UPDATE Transactions SET Title = @title, Amount = @amount WHERE Id = @id');

        res.json({ success: true, message: "Cập nhật thành công!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 5. API XÓA GIAO DỊCH (XÓA)
app.delete('/api/transactions/:id', async (req, res) => {
    try {
        const { id } = req.params;

        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Transactions WHERE Id = @id');

        res.json({ success: true, message: "Xóa thành công!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});