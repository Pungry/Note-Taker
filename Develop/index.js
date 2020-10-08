var express = require("express");
var path = require("path");
var fs = require("fs");

var app = express();
var PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//  Returns the `index.html` file
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// Returns the `notes.html` file
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

// Reads the `db.json` file and returns all saved notes as JSON.
app.get("/api/notes", function(req, res) {
    let dbData = fs.readFileSync("db/db.json", "utf-8");
    dbData = JSON.parse(dbData);
    return res.json(dbData);
  });

//  Receives a new note to save on the request body, adds it to the `db.json` file, and then returns the new note to the client.
app.post("/api/notes", function(req, res) {
    let dbData = fs.readFileSync("db/db.json", "utf-8");
    dbData = JSON.parse(dbData);
    let newDBState = {
    "title": req.body.title,
    "text": req.body.text,
    "id": Date.now(),
    }
    dbData.push(newDBState);
    fs.writeFileSync(path.join(__dirname, "db/db.json"), JSON.stringify(dbData, null, 2));
    res.send(true);
})

//  Deletes unneeded notes.
app.delete("/api/notes/:id", function (req, res){
    let dbData = fs.readFileSync("db/db.json", "utf-8");
    dbData = JSON.parse(dbData);
    let filteredArray = dbData.filter((note) => 
        note.id != req.params.id
    );
    fs.writeFileSync(path.join(__dirname, "db/db.json"), JSON.stringify(filteredArray, null, 2));
    res.send(true);
})

// Starts the server.
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});