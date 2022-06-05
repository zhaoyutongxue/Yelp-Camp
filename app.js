const express = require('express')
const app = express()
const port = 3000

app.get('/home', (req, res) => {
    res.render("home.ejs")
  })

app.get('/', (req, res) => {
  res.send('Hello World! from Yelp Camp')
})

app.listen(port, () => {
  console.log(`Yelp camp app listening on port ${port}`)
})