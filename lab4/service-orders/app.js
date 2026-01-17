require('dotenv').config();
const express = require('express');
const cors = require('cors');
const auth = require('./auth');
const { db, Order } = require('./models');
const fetch = (...a) => import('node-fetch').then(({default: f}) => f(...a));

const app = express();
app.use(cors());
app.use(express.json());

const BOOKS_URL = process.env.BOOKS_URL || 'http://localhost:3001/api';

// odczyt zamówień użytkownika (JWT)
app.get('/api/orders/:userId', auth, async (req, res) => {
    const rows = await Order.findAll({ where: { userId: req.params.userId } });
    res.json(rows);
});

// utworzenie zamówienia (JWT) + weryfikacja bookId przez serwis Books (REST)
app.post('/api/orders', auth, async (req, res) => {
    const { userId, bookId, quantity } = req.body || {};
    if (!userId || !bookId || !Number.isInteger(+quantity))
        return res.status(400).json({ message: 'Bad body' });

    // walidacja książki — ZABRONIONE bezpośrednie pytanie bazy; sprawdzamy przez HTTP do Books
    const r = await fetch(`${BOOKS_URL}/books/${bookId}`);
    if (r.status === 404) return res.status(400).json({ message: 'Book not exists' });
    if (!r.ok) return res.status(502).json({ message: 'Books service error' });

    const o = await Order.create({ userId: +userId, bookId: +bookId, quantity: +quantity });
    res.status(201).json({ id: o.id });
});

// usunięcie zamówienia (JWT)
app.delete('/api/orders/:orderId', auth, async (req, res) => {
    const n = await Order.destroy({ where: { id: req.params.orderId } });
    if (!n) return res.status(404).json({ message: 'Not found' });
    res.json({ deleted: true });
});

// aktualizacja ilości (JWT)
app.patch('/api/orders/:orderId', auth, async (req, res) => {
    const { quantity } = req.body || {};
    if (!Number.isInteger(+quantity)) return res.status(400).json({ message: 'Bad body' });
    const [n] = await Order.update({ quantity: +quantity }, { where: { id: req.params.orderId } });
    if (!n) return res.status(404).json({ message: 'Not found' });
    res.json({ updated: true });
});

(async () => {
    await db.sync();
    app.listen(process.env.PORT || 3002, () =>
        console.log('Orders on', process.env.PORT || 3002)
    );
})();
