const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

// middleware
app.use(
  cors({ origin: "*", methods: ["GET", "POST", "PUT", "PATCH", "DELETE"] }) // for handling CORS policy error
);
app.use(express.json());

// mongoDB drive code
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3mjkw.mongodb.net/car-spot?retryWrites=true&w=majority`;
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

    // POST Product
    app.post("/inventory", async (req, res) => {
      const data = req.body;
      const result = await productsCollection.insertOne(data);
      res.send(result);
    });

    // GET all Product
    app.get("/inventory", async (req, res) => {
      const query = req.query;
      const cursor = productsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // GET One Product by ID
    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    // GET One Product by Email
    app.get("/inventory", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = productsCollection.find(query);
      const myItems = await cursor.toArray();
      res.send(myItems);
    });

    // UPDATE Product by ID
    app.put("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const updatedQuantity = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          // quantity: updatedQuantity.quantity,
          ...updatedQuantity,
        },
      };
      const result = await productsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // DELETE Product by ID
    app.delete("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });
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

// Inventory
