const express = require("express");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const User = require("./models/User");
const bcrypt = require('bcrypt');
// const routes = require("./routes");
const dbUrl = 'mongodb://localhost:27017/rp-users-api';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection; // set to db so its shorter to write
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database Connected');
})

// adding Helmet to enhance your API's security
app.use(helmet());
// adding morgan to log HTTP requests
app.use(morgan('combined'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/users", async (req, res) => {
    const users = await User.find();
    res.send(users);
})

app.post("/users", async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: bcrypt.hashSync('req.body.password', 10),
        email: req.body.email
    });
    await user.save();
    res.send(user);
});

app.get("/users/:id", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id })
        res.send(user);
    } catch {
        res.status(404);
        res.send({ error: "User doesn't exist!" });
    }
});


app.patch("/users/:id", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id })

        if (req.body.username) {
            user.username = req.body.username
        }

        if (req.body.password) {
            user.password = req.body.password
        }
        if (req.body.email) {
            user.email = req.body.email
        }

        await user.save();
        res.send(user);
    } catch {
        res.status(404)
        res.send({ error: "User doesn't exist!" });
    }
});

app.delete("/users/:id", async (req, res) => {
    try {
        await User.deleteOne({ _id: req.params.id })
        res.status(204).send();
    } catch {
        res.status(404);
        res.send({ error: "User doesn't exist!" });
    }
});

app.listen(3000, () => {
    console.log("Listening on Port 3000");
});