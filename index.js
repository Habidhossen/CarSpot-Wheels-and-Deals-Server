const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// mongoDB drive code
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3mjkw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// CREATE API
async function run() {
  try {
    await client.connect();
    const productsCollection = client.db("car-spot").collection("products");

    // post API
    app.post("/product", async (req, res) => {
      // const data = req.body;
      // console.log(data);
      // const result = await productsCollection.insertOne(data);

      res.send("data");
    });

    // get API
    app.get("/products", async (req, res) => {
      const query = req.query;
      const cursor = productsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //
  } finally {
  }
}
run().catch(console.dir);

// running the server
app.get("/", (req, res) => {
  res.send("Running the server...");
});

// listening port
app.listen(port, () => {
  console.log("Listening to port", port);
});
