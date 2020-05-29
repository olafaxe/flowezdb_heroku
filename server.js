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
  //users is the name of the collection from the db document
  db = client.db(process.env.HEROKU_URL || "flowez");
});

//getting all the users from document db "fake", collection "users"
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

// app.put("/todos/:id", (req, res) => {
//   //put
//   const todo = req.body;
//   const todoCollection = db.collection("todos");
//   todoCollection
//     .replaceOne(
//       { id: Number(req.params.id) },
//       {
//         id: todo.id,
//         filter: todo.filter,
//         checked: todo.checked,
//         edit: todo.edit,
//         delete: todo.delete,
//         content: todo.content,
//         date: todo.date
//       }
//     )
//     .then(() => res.send(todo));
// });

// app.patch("/todos/:id", (req, res) => {
//   const checked = req.body.checked;
//   const todoCollection = db.collection("todos");
//   todoCollection
//     .updateOne(
//       { id: Number(req.params.id) },
//       {
//         $set: {
//           checked: checked
//         }
//       }
//     )
//     .then(() => res.send(checked));
// });

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
  res.send("working");
});

app.listen(port, () => {
  console.log(`Lyssnar på port: ${port}`);
});
