const express = require('express');

const app = express();      // server instance created

app.get("/", (req, res)=>{
    res.send("Hello World");
    
})

app.get("/home", (req, res)=>{
    res.send("Home Page");
})


app.listen(3000);   // used to start server