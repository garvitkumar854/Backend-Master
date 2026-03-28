const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send(200).json({message: "Hello World"});
})


app.post('/register', (req, res) => {
    const {username, email, password} = req.bdoy;
})

module.exports = app;