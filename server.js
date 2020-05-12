const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");

conf = {
  // look for PORT environment variable,
  // else look for CLI argument,
  // else use hard coded value for port 8080
  port: process.env.PORT || process.argv[2] || 8080,

  // origin undefined handler
  // see https://github.com/expressjs/cors/issues/71
  originUndefined: function (req, res, next) {
    if (!req.headers.origin) {
      res.json({
        mess:
          "Hi you are visiting the service locally. If this was a CORS the origin header should not be undefined",
      });
    } else {
      next();
    }
  },

  // Cross Origin Resource Sharing Options
  cors: {
    // origin handler
    origin: function (origin, cb) {
      // setup a white list
      let wl = ["https://dustinpfister.github.io"];

      if (wl.indexOf(origin) != -1) {
        cb(null, true);
      } else {
        cb(new Error("invalid origin: " + origin), false);
      }
    },

    optionsSuccessStatus: 200,
  },
};
app.use(conf.originUndefined, cors(conf.cors));

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
  db = client.db(process.env.HEROKU_URL);
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
