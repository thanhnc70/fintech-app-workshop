<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ví Điện Tử Thông Minh Premium</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-slate-100 font-sans min-h-screen flex flex-col justify-between">
    <header id="mainHeader" class="text-center py-8 bg-white shadow-sm border-b border-slate-200">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xl shadow-md shadow-blue-200 mb-3">
            <i class="fa-solid fa-wallet"></i>
        </div>
        <h1 class="text-2xl font-black text-slate-800 tracking-tight">VÍ ĐIỆN TỬ THÔNG MINH</h1>
        <p class="text-slate-400 text-xs mt-1 font-medium uppercase tracking-wider">Hệ thống quản lý tài chính đám mây</p>
    </header>

    <main id="mainContainer" class="max-w-6xl w-full mx-auto px-4 py-8 flex-grow flex items-center justify-center">
        <!-- Login/Register sẽ được thay bằng dashboard sau khi login -->
    </main>

    <footer class="text-center py-4 text-xs text-slate-400 font-medium border-t border-slate-200 bg-white">
        &copy; 2026 Fintech Workshop Premium. Đồng bộ hóa dữ liệu thời gian thực.
    </footer>

    <script>
        const API_URL = 'https://fintech-backend-api-t83c.onrender.com/api';
        let transactions = [];
        let currentUserId = null;
        let currentUserName = '';

        // ====================== ĐĂNG KÝ ======================
        async function handleRegister(event) {
            event.preventDefault();
            const fullname = document.getElementById('regFullname').value.trim();
            const username = document.getElementById('regUsername').value.trim();
            const password = document.getElementById('regPassword').value.trim();

            if (!fullname || !username || !password) {
                alert("Vui lòng điền đầy đủ thông tin!");
                return;
            }

            try {
                const res = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password, fullname })
                });
                const data = await res.json();
                alert(data.message || "Đăng ký thành công!");
            } catch (e) {
                alert("Lỗi kết nối: " + e.message);
            }
        }

        // ====================== ĐĂNG NHẬP ======================
        async function handleLogin(event) {
            event.preventDefault();
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            if (!username || !password) {
                alert("Vui lòng nhập tài khoản và mật khẩu!");
                return;
            }

            try {
                const res = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await res.json();

                if (data.success) {
                    currentUserId = data.userId;
                    currentUserName = data.fullname || username;

                    alert("Đăng nhập thành công! Đang tải dữ liệu...");
                    renderDashboard();
                    fetchTransactions();
                } else {
                    alert(data.message || "Sai tài khoản hoặc mật khẩu!");
                }
            } catch (e) {
                alert("Không thể kết nối đến server: " + e.message);
            }
        }

        // ====================== RENDER DASHBOARD ======================
        function renderDashboard() {
            document.getElementById('mainHeader').classList.add('hidden');
            document.getElementById('mainContainer').innerHTML = `
                <div class="grid lg:grid-cols-3 gap-6 w-full">
                    <!-- Sidebar -->
                    <div class="space-y-6 lg:col-span-1">
                        <div class="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <div class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                                        👑
                                    </div>
                                    <div>
                                        <div class="font-medium">${currentUserName}</div>
                                        <div class="text-xs text-emerald-400">LIVE NEON</div>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-8">
                                <div class="text-xs uppercase tracking-widest text-slate-400">Số dư khả dụng</div>
                                <div id="balanceDisplay" class="text-4xl font-black mt-1">0 đ</div>
                            </div>
                            <div class="mt-6 text-xs text-slate-400">
                                ID: #${currentUserId}
                            </div>
                        </div>

                        <!-- Form thêm giao dịch -->
                        <div class="bg-white p-6 rounded-3xl shadow-sm">
                            <h3 class="font-bold mb-4 flex items-center gap-2">
                                <i class="fa-solid fa-square-plus text-blue-600"></i> Ghi Chép Thu Chi Mới
                            </h3>
                            <input type="hidden" id="txId">
                            <div class="space-y-4">
                                <input type="text" id="txTitle" placeholder="Tên mục giao dịch" 
                                       class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none">
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <input type="number" id="txAmount" placeholder="Số tiền" 
                                               class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none">
                                    </div>
                                    <div>
                                        <select id="txType" class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none">
                                            <option value="income">📈 Khoản Thu</option>
                                            <option value="expense">📉 Khoản Chi</option>
                                        </select>
                                    </div>
                                </div>
                                <button onclick="saveTransaction()" 
                                        class="w-full bg-slate-900 hover:bg-black text-white font-bold py-3.5 rounded-2xl transition-all">
                                    💾 Lưu Giao Dịch
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Bảng giao dịch -->
                    <div class="lg:col-span-2">
                        <div class="bg-white rounded-3xl shadow-sm overflow-hidden">
                            <div class="px-6 py-4 border-b bg-slate-50 flex justify-between items-center">
                                <h3 class="font-bold">Sổ Nhật Ký Thu Chi (Neon Cloud)</h3>
                                <span class="text-sm font-medium text-slate-500">Tổng: <span id="txCount">0</span> giao dịch</span>
                            </div>
                            <div class="overflow-x-auto">
                                <table class="w-full">
                                    <thead>
                                        <tr class="bg-slate-50 text-xs font-bold text-slate-500">
                                            <th class="py-4 px-6 text-left">Nội dung</th>
                                            <th class="py-4 px-6">Loại</th>
                                            <th class="py-4 px-6 text-right">Số tiền</th>
                                            <th class="py-4 px-6 text-center">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody id="transactionList" class="divide-y"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // ====================== LẤY DANH SÁCH GIAO DỊCH ======================
        async function fetchTransactions() {
            try {
                const res = await fetch(`${API_URL}/transactions?userId=${currentUserId}`);
                const data = await res.json();

                transactions = data.transactions || data || [];
                renderTransactionTable();
            } catch (err) {
                console.error(err);
                alert("Không thể tải danh sách giao dịch từ NeonDB");
            }
        }

        // ====================== HIỂN THỊ BẢNG ======================
        function renderTransactionTable() {
            const tbody = document.getElementById('transactionList');
            let balance = 0;

            tbody.innerHTML = '';

            if (transactions.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" class="py-12 text-center text-slate-400">Chưa có giao dịch nào</td></tr>`;
                document.getElementById('balanceDisplay').textContent = "0 đ";
                document.getElementById('txCount').textContent = "0";
                return;
            }

            transactions.forEach(tx => {
                const amount = parseFloat(tx.amount) || 0;
                const isIncome = tx.type === 'income' || tx.type === 'IN';

                if (isIncome) balance += amount;
                else balance -= amount;

                const row = document.createElement('tr');
                row.className = "hover:bg-slate-50";
                row.innerHTML = `
                    <td class="py-4 px-6 font-medium">${tx.title}</td>
                    <td class="py-4 px-6">
                        ${isIncome ? 
                            `<span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">Thu</span>` : 
                            `<span class="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-medium">Chi</span>`
                        }
                    </td>
                    <td class="py-4 px-6 text-right font-bold ${isIncome ? 'text-emerald-600' : 'text-rose-600'}">
                        ${isIncome ? '+' : '-'}${amount.toLocaleString('vi-VN')} đ
                    </td>
                    <td class="py-4 px-6 text-center">
                        <button onclick="editTransaction(${tx.id})" class="text-blue-600 hover:text-blue-800 mr-3">Sửa</button>
                        <button onclick="deleteTransaction(${tx.id})" class="text-red-600 hover:text-red-800">Xóa</button>
                    </td>
                `;
                tbody.appendChild(row);
            });

            document.getElementById('balanceDisplay').textContent = balance.toLocaleString('vi-VN') + " đ";
            document.getElementById('txCount').textContent = transactions.length;
        }

        // ====================== LƯU GIAO DỊCH ======================
        async function saveTransaction() {
            const id = document.getElementById('txId').value;
            const title = document.getElementById('txTitle').value.trim();
            const amount = document.getElementById('txAmount').value;
            const type = document.getElementById('txType').value;

            if (!title || !amount) {
                alert("Vui lòng nhập đầy đủ thông tin!");
                return;
            }

            const method = id ? 'PUT' : 'POST';
            const url = id ? `${API_URL}/transactions/${id}` : `${API_URL}/transactions`;

            try {
                const res = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: currentUserId,
                        title,
                        amount: parseFloat(amount),
                        type
                    })
                });

                if (res.ok) {
                    alert(id ? "Cập nhật thành công!" : "Thêm giao dịch thành công!");
                    document.getElementById('txTitle').value = '';
                    document.getElementById('txAmount').value = '';
                    fetchTransactions();
                }
            } catch (e) {
                alert("Lỗi khi lưu: " + e.message);
            }
        }

        async function deleteTransaction(id) {
            if (!confirm("Xóa giao dịch này?")) return;
            await fetch(`${API_URL}/transactions/${id}`, { method: 'DELETE' });
            fetchTransactions();
        }

        function editTransaction(id) {
            const tx = transactions.find(t => t.id === id);
            if (!tx) return;
            document.getElementById('txId').value = tx.id;
            document.getElementById('txTitle').value = tx.title;
            document.getElementById('txAmount').value = tx.amount;
            document.getElementById('txType').value = tx.type || 'income';
        }

        // Khởi tạo form login/register
        document.getElementById('mainContainer').innerHTML = `
            <div class="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                <div class="bg-white p-8 rounded-3xl shadow">
                    <h2 class="text-xl font-bold mb-6">Tạo Tài Khoản Mới</h2>
                    <form onsubmit="handleRegister(event)">
                        <input type="text" id="regFullname" placeholder="Họ và tên" class="w-full mb-4 px-4 py-3 rounded-2xl border">
                        <input type="text" id="regUsername" placeholder="Tài khoản" class="w-full mb-4 px-4 py-3 rounded-2xl border">
                        <input type="password" id="regPassword" placeholder="Mật khẩu" class="w-full mb-6 px-4 py-3 rounded-2xl border">
                        <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold">Đăng Ký</button>
                    </form>
                </div>
                <div class="bg-white p-8 rounded-3xl shadow">
                    <h2 class="text-xl font-bold mb-6">Đăng Nhập</h2>
                    <form onsubmit="handleLogin(event)">
                        <input type="text" id="loginUsername" placeholder="Tài khoản" class="w-full mb-4 px-4 py-3 rounded-2xl border">
                        <input type="password" id="loginPassword" placeholder="Mật khẩu" class="w-full mb-6 px-4 py-3 rounded-2xl border">
                        <button type="submit" class="w-full bg-emerald-600 text-white py-3 rounded-2xl font-bold">Đăng Nhập</button>
                    </form>
                </div>
            </div>
        `;
    </script>
</body>
</html>
