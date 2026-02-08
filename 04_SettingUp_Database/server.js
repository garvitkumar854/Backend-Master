const app = require("./src/app");

const connectDB = require("./src/db/db");

connectDB();   // actual connection to the database

port  = 3000;
app.listen(port, () => {
    console.log(`Server is starting.. on ${port}`);
})