const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

// Kết nối Neon
const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_YTFb4NMX6jyK@ep-falling-rain-apkbnznb-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require",
    ssl: { rejectUnauthorized: false }
});

// ====================== API REGISTER ======================
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, fullname } = req.body;
        await pool.query('INSERT INTO users (username, password, fullname) VALUES ($1, $2, $3)', 
            [username, password, fullname]);
        res.json({ success: true, message: "Đăng ký thành công!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Tài khoản đã tồn tại hoặc lỗi!" });
    }
});

// ====================== API LOGIN ======================
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await pool.query(
            'SELECT id, fullname FROM users WHERE username = $1 AND password = $2',
            [username, password]
        );

        if (result.rows.length > 0) {
            res.json({
                success: true,
                userId: result.rows[0].id,
                fullname: result.rows[0].fullname
            });
        } else {
            res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ====================== API TRANSACTIONS ======================
app.get('/api/transactions', async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ success: false, message: "Thiếu userId" });

    try {
        const result = await pool.query(
            'SELECT id, title, amount, type, createdat FROM transactions WHERE userid = $1 ORDER BY createdat DESC',
            [userId]
        );
        res.json({ success: true, transactions: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/transactions', async (req, res) => {
    try {
        const { userId, title, amount, type } = req.body;
        const tType = type || (amount >= 0 ? 'income' : 'expense');

        await pool.query(
            'INSERT INTO transactions (userid, title, amount, type, createdat) VALUES ($1, $2, $3, $4, NOW())',
            [userId, title, amount, tType]
        );
        res.json({ success: true, message: "Thêm giao dịch thành công" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.put('/api/transactions/:id', async (req, res) => {
    try {
        const { title, amount, type } = req.body;
        await pool.query(
            'UPDATE transactions SET title = $1, amount = $2, type = $3 WHERE id = $4',
            [title, amount, type, req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.delete('/api/transactions/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM transactions WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server chạy tại port ${PORT}`));
