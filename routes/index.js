const express = require('express');
const router = express.Router();

const mysql = require('mysql2');
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
});
const promisePool = pool.promise();

router.get('/raw', async function (req, res, next) {
    const [rows] = await promisePool.query(`SELECT lg09forum.*, lg09users.name FROM lg09forum
    JOIN lg09users ON lg09forum.authorId = lg09users.id`);
    res.json({ rows });
});


router.post('/new', async function (req, res, next) {
    const { author, title, content } = req.body;
    const [rows] = await promisePool.query("INSERT INTO lg09forum (authorId, title, content) VALUES (?, ?, ?)", [author, title, content]);
    res.redirect('/forum');
});

router.get('/new', async function (req, res, next) {
    const [users] = await promisePool.query(`SELECT lg09forum.*, lg09users.name FROM lg09forum
    JOIN lg09users ON lg09forum.authorId = lg09users.id`);
    res.render('new.njk', {
        title: 'Nytt inlägg',
        users,
    });
});

router.get('/forum', async function (req, res, next) {
    const [posts] = await promisePool.query(`SELECT lg09forum.*, lg09users.name FROM lg09forum
    JOIN lg09users ON lg09forum.authorId = lg09users.id`);
    res.render('forum.njk', {
        title: 'Nazarick',
        posts,
    });
});

module.exports = router;
