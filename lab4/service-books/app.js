require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { db, Book } = require('./models');
const auth = require('./auth');

const app = express();
app.use(cors());
app.use(express.json());

// public (bez JWT)
app.get('/api/books', async (_req, res) => {
    res.json(await Book.findAll());
});

app.get('/api/books/:bookId', async (req, res) => {
    const b = await Book.findByPk(req.params.bookId);
    if (!b) return res.status(404).json({ message: 'Not found' });
    res.json(b);
});

// protected (wymaga JWT)
app.post('/api/books', auth, async (req, res) => {
    const { title, author, year } = req.body || {};
    if (!title || !author || !Number.isInteger(+year))
        return res.status(400).json({ message: 'Bad body' });
    const b = await Book.create({ title, author, year: +year });
    res.status(201).json({ id: b.id });
});

app.delete('/api/books/:bookId', auth, async (req, res) => {
    const n = await Book.destroy({ where: { id: req.params.bookId } });
    if (!n) return res.status(404).json({ message: 'Not found' });
    res.json({ deleted: true });
});

(async () => {
    await db.sync();
    app.listen(process.env.PORT || 3001, () =>
        console.log('Books on', process.env.PORT || 3001)
    );
})();
