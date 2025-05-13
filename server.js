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



app.get("/hiddenPage", (req, res) => {
    if (!req.session.loggedIn) {
        return res.status(401).send("Not logged in")
    }
    res.send("You are logged in")
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})