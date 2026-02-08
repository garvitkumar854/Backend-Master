const express = require("express");

const noteModel = require("./models/note.model");

const app = express();
/* notes = {title, description}

POST /notes = create a note
GET /notes = get all notes
DELETE /notes/:id = delete a note
PATCH /notes/:id = update a note
*/

// middleware
app.use(express.json());

// post request to create a note
app.post("/notes", async (req, res) => {
  const data = req.body; // {title, description}
  await noteModel.create({
    title: data.title,
    description: data.description,
  });

  res.status(201).json({ message: "Note Created !" });
});

// get request to fetch all notes
app.get("/notes", async (req, res) => {
  const notes = await noteModel.find(); // give array of notes

  /* there is a findOne method which gives only one record and null if not found
     const notes = await noteModel.findOne({
        // title: "title_3"
    }); // give one note    
    
    find => [{},{}] or []
    findOne => {} or null
    */

  res.status(200).json({
    message: "All Notes fetched successfully",
    notes: notes,
  });
});

// delete request to delete a note
app.delete("/notes/:id", async (req, res) => {
  const id = req.params.id;

  await noteModel.findByIdAndDelete({
    _id: id,
  });

  res.status(200).json({
    message: "Note deleted successfully",
  });
});

app.patch("/notes/:id", async (req, res) => {
  const id = req.params.id;
  const description = req.body.description;
  await noteModel.findOneAndUpdate(
    // basis to find the record
    { _id: id },
    { description: description },
  );
  res.status(200).json({
    message: "Note updated successfully",
  });
});
module.exports = app;
