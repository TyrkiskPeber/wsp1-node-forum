# Del 8 - Författare

- [ ] Skapa en ny post i databasen med SQL INSERT
- [ ] Göra detta med Node

## Hämta alla inlägg med författare i node

Uppdatera SQL frågan i index routen. Du behöver här läsa in data från två tabeller. Du kan läsa in data från två tabeller genom att använda `JOIN` i din SQL fråga. Frågan finns i [Del 6](part-6.md).

## Posta nya inlägg med författare

Uppdatera SQL frågan i new routen.

Ett första steg är att hårdkoda det för att använda user 1.

Här är det viktigt att synca din forum tabell med sql fråga, istället för author så används authorId.

```js
...
const [rows] = await promisePool.query('INSERT INTO DITT_TABELL_NAMN (authorId, title, content) VALUES (?, ?, ?)', [1, title, content]);
```

Om du ska skapa en ny författare i frågan så behöver du uppdatera så att två frågor skickas till databasen. Du kan göra detta genom att använda `promisePool.query` två gånger och lägga till data i `users` tabellen först.

Hur du löser det beror en del på ditt formulär. Skickar det id eller namn på användaren? Hur gör du då med att skapa en ny användare eller att välja användaren.

`routes/index.js`
```js
    ...
    // Skapa en ny författare om den inte finns men du behöver kontrollera om användare finns!
    let [user] = await promisePool.query('SELECT * FROM din_tabell WHERE id = ?', [authorId]);
    if (!user) {
        user = await promisePool.query('INSERT INTO din_tabell (name) VALUES (?)', [authorName]);
    }

    // user.insertId bör innehålla det nya ID:t för författaren
    const userId = user.insertId || user[0].id;

    // kör frågan för att skapa ett nytt inlägg
    const [rows] = await promisePool.query('INSERT INTO din_tabell (authorId, title, content) VALUES (?, ?, ?)', [userId, title, content]);
    ...
```

Det blev en mastig bit. **Se till att du kan starta och köra din server!**

## Uppdatera formuläret

Uppdatera formuläret i new.njk så att författaren är en dropdown som läser in alla användare från databasen.

Den här delen blev lite svår i spelet med föregående kod, det kan behöva justeringar så att du vet :)

`views/new.njk`
```html
<label for="author">Författare</label>
<select name="author" id="author">
    {% for user in users %}
        <option value="{{ user.id }}">{{ user.name }}</option>
    {% endfor %}
</select>
```

Uppdatera routen för att hämta alla användare.

`routes/index.js`
```js
router.get('/new', async function (req, res, next) {
    const [users] = await promisePool.query('SELECT * FROM din_tabell');
    res.render('new.njk', {
        title: 'Nytt inlägg',
        users,
    });
});
```

Whew, det blev en del.

**Starta din server och se till att allt fungerar!**

[Del 9](part-9.md)