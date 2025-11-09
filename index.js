const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
require("dotenv").config();

// middle Ware
app.use(cors());

// for Json Body parse
app.use(express.json());

// DB connects
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@curd-service.6ebidhj.mongodb.net/?appName=Curd-Service`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("StudyMate");
    const usersCollection = database.collection("users");
    const partnersCollection = database.collection("partners-profile");
    const networkCollection = database.collection("partners-connection");

    //Set User
    app.post("/create/user", async (req, res) => {
      const data = req.body;
      const email = data.email;
      const query = { email: email };
      const exitUser = await usersCollection.findOne(query);
      if (exitUser) {
        res.send({ message: "Already exist" });
      } else {
        const result = await usersCollection.insertOne(data);
        res.send(result);
      }
    });
    // ✅ Create Partner Profile
    app.post("/create/partner", async (req, res) => {
      try {
        const data = req.body;
        // 🗃️ Insert new partner data into partnersCollection
        const result = await partnersCollection.insertOne(data);
        res.send({ message: "Partner created successfully", result });
      } catch (error) {
        console.error("Error creating partner:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // See all partners
    app.get("/all-partners", async (req, res) => {
      const cursor = partnersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // See by partners ID
    app.get("/partner/:id", async (req, res) => {
      const ID = req.params.id;
      const filter = { _id: new ObjectId(ID) };
      const result = await partnersCollection.findOne(filter);
      res.send(result);
    });

    //   Sell all connected Partners
    app.get("/partner/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const data = networkCollection.find(filter);
      const result = await data.toArray();
      res.send(result);
    });
    //   connect with partner
    app.post("/partner/connect", async (req, res) => {
      const data = req.body;
      const Email = data.email;
      const partnerID = data.partner_id;
      const query = { partner_id: partnerID };
      const isExist = await networkCollection.findOne(query);
      if (isExist) {
        res.send({ message: "Already exist" });
      } else {
        const result = await networkCollection.insertOne(data);
        res.send(result);
      }
    });
    //   delete connection
    app.delete("/partner/delete/:id", async (req, res) => {
      const Id = req.params.id;
      const query = { _id: new ObjectId(Id) };
      const result = await networkCollection.deleteOne(query);
      res.send(result);
    });

    //   Update partners Details
    app.patch("/partner/update/:id", async (req, res) => {
      const ID = req.params.id;
      const reqData = req.body;
      const filter = { _id: new ObjectId(ID) };
      const Update = {
        $set: {
          name: reqData.name,
          profileimage: reqData.imgURL,
          subject: reqData.sub,
          studyMode: reqData.stdMode,
        },
      };
      const result = await networkCollection.updateOne(filter, Update);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log("Running on Port:", port);
});
