// file obj = Only Create the Server
const express = require("express");

const app = express();

// middleware
// makes raw data readable in json format received from postman
app.use(express.json());

// title, description
const notes = [];


// rest api keys

// creating api = notes, of the POST type
/* title, description */

// data frontend se backend pe aa rha hai
app.post("/notes", (req, res) => {
  // push data in notes array when request is made
  notes.push(req.body);

  // 201 status code: Success of POST request
  res.status(201).json({
    message: "Note added successfully",
  });
});

// send data from backend to frontend
app.get("/notes", (req, res) => {
  // 200 status code: Success of GET request
  res.status(200).json({
    message: "Notes fetched successfully",
    notes: notes,
  });
});

// delete note from server by index
// delete note 2: /notes/2
// 2 => dynamic part so we use params

app.delete("/notes/:index", (req, res) => {
  const index = req.params.index; // take out the index value from params = 2

  delete notes[index]; // delete note at index 2

  res.status(200).json({
    message: "Note deleted successfully",
  });
});


// update data present in server
// update description of notes on index = 1
app.patch("/notes/:index", (req, res) => {
  const index = req.params.index; // get index from params 
  const desc = req.body.description; // get new description from body
  notes[index].description = desc; // update description at index
  res.status(200).json({
    message: "Note updated successfully",
  })    

})

// export app to the server.js file
module.exports = app;
