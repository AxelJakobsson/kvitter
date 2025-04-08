import 'dotenv/config'
import express from 'express'
import nunjucks from 'nunjucks'
import indexRouter from "./routes/index.js"
import bodyParser from "body-parser"
import morgan from "morgan"
import { body, matchedData, validationResult } from "express-validator"
import bcrypt, { hash } from "bcrypt";
import session from "express-session";
import db from "./db-sqlite.js"


const app = express()
const port = 3000
const saltRounds = 10

nunjucks.configure("views", {
    autoescape: true,
    express: app,
})
app.use(express.static("public"))
app.use(morgan(':date[clf] ":method :url"'))
app.use(bodyParser.urlencoded( { extended: true}))

app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { sameSite: true }
  }));

app.use("/", indexRouter)

app.get('/tweets/:id/edit', async (req, res) => {
    const id = req.params.id;
    if (!Number.isInteger(Number(id))) {
        return res.status(400).send("Invalid ID")
    }
    const [rows] = await db.all('SELECT * FROM tweet WHERE id = ?', id)

    if (rows.length === 0) {
        return res.status(404).send("Tweet not found")
    }
    res.render('edit.njk', { tweet:  rows[0] })
})

app.post("/tweets/edit",
    body("id").isInt(),
    
    body("message").isLength({ min: 1, max:130 }),
    async (req, res) => {
    const errors = validationResult(req)

    const { id, message } = matchedData(req)
    console.log(message)

    if (!errors.isEmpty()) {
        return res.status(400).send("Invalid input")
    }
    await db.run('UPDATE tweet SET message = ? WHERE id = ?', message, id)
    res.redirect("/")
})

app.get("/hiddenPage", (req, res) => {
    if (!req.session.loggedIn) {
        return res.status(401).send("Not logged in")
    }
    res.send("You are logged in")
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})