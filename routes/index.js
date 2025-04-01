import express, { application } from "express"
import pool from "../db.js"
import bodyParser from "body-parser"
import bcrypt, { hash } from "bcrypt";

import { body, matchedData, validationResult } from "express-validator"

const router = express.Router()
const saltRounds = 10

router.get("/", async (req, res) => {
    const [tweets] = await pool.promise().query(`SELECT tweet.*, user.name 
        FROM tweet 
        JOIN user ON tweet.author_id = user.id;`)
    res.render("index.njk", {
        title: "Kvitter", 
        message: "Bästa hemsidan",
        tweets: tweets,
        loggedIn: req.session.loggedIn || false,
        accountName: req.session.name || null
    })
})

router.get("/tweets", async (req, res) => {
    const [tweets] = await pool.promise().query(`SELECT tweet.*, user.name 
        FROM tweet 
        JOIN user ON tweet.author_id = user.id;`)
    res.render("index.njk", {
        title: "Kvitter", 
        message: "Bästa hemsidan",
        tweets: tweets,
    })
})


router.post("/delete", async (req, res) => {
    const id = req.body.id

    await pool.promise().query("DELETE FROM tweet WHERE id = ?", [id])
    res.redirect("/")
})


router.get('/tweets/:id/delete', async (req, res) => {
    const [tweetID] = await pool.promise().query(`SELECT id FROM tweet WHERE id = ?`, [req.params.id]);
    if(tweetID.length === 0) { // Make sure the tweet id is valid
        return res.render("failed.njk")
    }

    const [tweetsOut] = await pool.promise().query(`DELETE FROM tweet WHERE id = ?;`,
    [req.params.id],
    )
    res.render("tweets_delete.njk", {
        tweetsOut:tweetsOut,
    })
});



// Router to create tweet page
router.get("/create", async (req, res) => {
    if (!req.session.loggedIn) {
        console.log("Not logged in")
        return res.redirect("/login")
    }
    else {
        res.render("create.njk", {
        title: "Kvitter",
    })
    }
});

// Post the new tweet to the database with the message and author_id connected. 
router.post("/create", async (req, res) => {
    const { message } = req.body
    const [[author]] = await pool.promise().query(`SELECT id FROM user WHERE name = ?`, [req.session.name]);
    const author_id = author.id;
    // const [accounts] = await pool.promise().query(`SELECT id FROM user WHERE id = ?`, [author_id]);
    

    // if (accounts.length === 0) {
    //     return res.render("failed.njk");
    // }
    await pool.promise().query("INSERT INTO tweet (message, author_id) VALUES (?, ?)", [message, author_id]);
    res.redirect("/")   
})

router.post("/createNoID", async (req, res) => {
    const { message } = req.body
    const author_id = 6
    await pool.promise().query("INSERT INTO tweet (message, author_id) VALUES (?, ?)", [message, author_id]);
    res.redirect("/")
})

router.get("/accounts", async (req, res) => {
    const [accounts] = await pool.promise().query(`SELECT user.*
        FROM user`)
    res.render("accounts.njk", {
        title: "Accounts", 
        accounts: accounts
    })
})

router.get("/logout", (req, res) => {
    req.session.loggedIn = false;
    res.redirect("/")
});

router.post("/logout", async (req, res) => {
    req.session.loggedIn = false;
    console.log("Logged out")
    res.redirect("/")
});

router.get("/login", async (req, res) => {
    res.render("login.njk", {
        title: "Kvitter",
    })
});

router.post("/login", async (req, res) => {
    const { name, password } = req.body

    const [users] = await pool.promise().query("SELECT * FROM user WHERE name = ?", [name])
    if (users.length === 0) {
        return res.status(400).send("Invalid user")
    }
    const hashedPassword = users[0].hashed;
    bcrypt.compare(password, hashedPassword, function(err, result) {
        if (err) {
            console.log("Error: ", err)
        }
        if (result) {
            console.log("Logged in")
            req.session.loggedIn = true;
            req.session.name = users[0].name // assign the name
            res.redirect("/")
        }
        else {
            res.sendStatus(401)
        }
    })
})


router.get("/createAccount", (req, res) => {
    res.render("create_account.njk", {
        title: "Kvitter",
    })
})

router.post("/createAccount", async (req, res) => {
    const { name, password } = req.body;
  
    const [users] = await pool.promise().query("SELECT * FROM user WHERE name = ?", [name]);
    if (users.length > 0) {
      return res.status(400).send("User already exists");
    }
  
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).send("Internal server error");
      }
      pool.promise().query("INSERT INTO user (name, hashed) VALUES (?, ?)", [name, hash])
      console.log("Account created")
      res.redirect("/")
        });
    });


export default router