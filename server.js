const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
app.use(cors());
app.use(bodyParser.json());

const MongoClient = require("mongodb").MongoClient;
const url = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

client.connect(function (err) {
  if (err) throw err;
  db = client.db(process.env.HEROKU_URL);
});

app.get("/flowcharts", (req, res) => {
  const flowchartCollection = db.collection("flowcharts");
  flowchartCollection.find({}).toArray(function (err, charts) {
    res.send(charts);
  });
});

app.post("/flowcharts", (req, res) => {
  const flowchartCollection = db.collection("flowcharts");
  flowchartCollection.insertMany([req.body]).then((e) => {
    console.log(e.ops);
    res.send(e.ops);
  });
});

app.delete("/flowcharts/:id", (req, res) => {
  const todoCollection = db.collection("flowcharts");
  todoCollection
    .deleteMany({ _id: new mongodb.ObjectID(req.params.id) })
    .then(() => res.send(req.params.id));
});

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.send("working");
});

app.listen(port, () => {
  console.log(`Lyssnar på port: ${port}`);
});
