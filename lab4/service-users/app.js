require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');          // <— bcryptjs
const jwt = require('jsonwebtoken');
const { db, User } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

// POST /api/register -> {id}
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) return res.status(400).json({ message: 'Bad body' });

        const exists = await User.findOne({ where: { email } });
        if (exists) return res.status(409).json({ message: 'Email already used' });

        const hash = await require('bcryptjs').hash(password, 10);
        const u = await User.create({ email, password: hash });
        res.status(201).json({ id: u.id });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal error' });
    }
});


// POST /api/login -> {token}
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body || {};
    const u = await User.findOne({ where: { email } });
    if (!u) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, u.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: u.id, email: u.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
});

(async () => {
    await db.sync();
    app.listen(process.env.PORT || 3003, () => console.log('Users on', process.env.PORT || 3003));
})();
