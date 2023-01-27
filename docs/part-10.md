# Del 10 - Den episka delen med param rutter... typ

- [ ] Skapa en ny route för enskilda poster som hämtar kommentarer för den posten.
- [ ] Skapa ett nytt formulär och route för att kunna skapa en ny kommentar till en post.

## Skapa en ny route för enskilda poster som hämtar kommentarer för den posten.

För att kunna komma åt och ladda sidor som bara hämtar en specifik post behöver vi skapa en route som hämtar detta.
Ett sätt att göra det på är att skicka postens ID till routen. Detta gör vi genom att skapa en ny route som tar emot ett ID.

[Läs på expressjs](https://expressjs.com/en/guide/routing.html#route-parameters)

Ofärdigt exempel följer.

```js
app.get('/post/:id', async (req, res) => {
    const postId = req.params.id;
    const post = await getPost(postId); // skriv en funktion som hämtar en post på id eller stoppa in kod för detta här. Använd WHERE i din SQL.
    const comments = await getComments(postId); // Om du ska hämta comments kopplad till postens ID.
    res.render('post.njk', { post, comments }); // rendera post.njk med post och comments som variabler.
});
```