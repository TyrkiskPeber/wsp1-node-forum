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




router.get('/register', async function (req, res, next) {
    res.render('register.njk')

})

router.post('/register', async function (req, res, next) {
    const { username, password, passwordConfirmation } = req.body;
    if (username === "" && password === "" && passwordConfirmation === "") {
        return res.send('Username is Required')
    }
    else if (username === "") {
        return res.send('Username is Required')
    }
    else if (password === "") {
        return res.send('Password is Required')
    }
    else if (passwordConfirmation === "") {
        return res.send('Passwords should match')
    }

    if (password == passwordConfirmation) {

        bcrypt.hash(password, 10, async function (err, hash) {
            console.log(hash)
            const [rows] = await promisePool.query("SELECT * FROM lg09users WHERE name = ?", [username])
            console.log(rows[0])
            if (rows.length === 0) {
                const [user] = await promisePool.query("INSERT INTO lg09users (name, password) VALUES (?, ?)", [username, hash])
                req.session.user = user[0]
                return res.redirect('/profile')
            }
            else {
                return res.send('Username is already taken')
            }
            
        });

    }
    else {
        return res.send('Passwords do not match')
    }
})

router.get('/login', async function (req, res, next) {
    res.render('login.njk',
        {
            title: 'Login'
        });
});

router.post('/login', async function (req, res, next) {
    const { username, password } = req.body;
    if (username === "" && password === "") {
        return res.send('Username is Required')
    }
    else if (username === "") {
        return res.send('Username is Required')
    }
    else if (password === "") {
        return res.send('Password is Required')
    }
    else {
        const [user] = await promisePool.query(`SELECT * FROM lg09users WHERE name = ?`, [username])
        bcrypt.compare(password, user[0].password, function (err, result) {
            if (result === true) {
                req.session.user = user[0]  //Ifall det går att logga in, spara användarens data i sessions variabeln 'user'
                return res.redirect('/profile')

            }
            else {
                return res.send('Invalid username or password')
            }
        })
    }
});

router.get('/profile', async function (req, res, next) {
    if (req.session.user) {        //Kollar ifall det finns en 'user' i sessionen
        res.render('profile.njk', {
            name: req.session.user.name
        })
    }
    else {
        return res.status(401).send('Access denied')
    }
})

router.post('/logout', async function (req, res, next) {
    if (req.session.user) {
        req.session.destroy()
        return res.redirect('/')
    }
    else {
        return res.status(401).send('Access denied')
    }
})



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
