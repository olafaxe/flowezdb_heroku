const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

const MongoClient = require("mongodb").MongoClient;
const url = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

client.connect(function (err) {
  if (err) throw err;
  //users is the name of the collection from the db document
  db = client.db(HEROKU_URL);
});

//getting all the users from document db "fake", collection "users"
app.get("/flowcharts", (req, res) => {
  const usersCollection = db.collection("flowcharts");
  usersCollection.find({}).toArray(function (err, users) {
    res.send(users);
  });
});

//parsing incoming requests
app.use(
  express.urlencoded({
    extended: true,
  })
);

//use static files
// app.use(express.static("views/public"));

//simple get rout with variable sent to "/" for use at pages/index
app.get("/", (req, res) => {
  res.send("hej");
});

app.listen(port, () => {
  console.log(`Lyssnar på port: ${port}`);
});
