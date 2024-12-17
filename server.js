const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file
const express = require('express');
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");

const app = express();

mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
// Import the Fruit model
const Fruit = require("./models/fruit.js");
// This will provide req.body params as an object/ middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));// new
app.use(morgan("dev")); // new

// ROUTES BELOW
// GET 
app.get("/", async (req, res) => {
    res.render("index.ejs");
  });
  

  // INDUCES
  // GET/ fruits (index)
  app.get("/fruits", async (req,res) => {
    try {
      const allFruits = await Fruit.find();
      res.render("fruits/index.ejs", {fruits:allFruits});
    } catch {
      res.render("fruits/index.ejs", { fruits: [], errorMsg: "Something went wrong, please try again soon." });
    }
    
  })

// GET /fruits/new
app.get("/fruits/new", (req, res) => {
  res.render("fruits/new.ejs");
});


// DELETE / fruit/:fruitId(delete)
app.delete("/fruits/:fruitId", async (req,res) => {
  //Query & Delete
  await Fruit.findByIdAndDelete(req.params.fruitId);
  res.redirect("/fruits");
});

// PUT/fruits/:fruitId
// server.js

app.put("/fruits/:fruitId", async (req, res) => {
  // Handle the 'isReadyToEat' checkbox data
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  
  // Update the fruit in the database
  await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);

  // Redirect to the fruit's show page to see the updates
  res.redirect(`/fruits/${req.params.fruitId}`);
});


//Post (Create) to create new fruits
app.post("/fruits", async (req, res) => {
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  await Fruit.create(req.body);
  res.redirect("/fruits");
});

// GET /fruits/:fruitId/edit (edit)
// GET localhost:3000/fruits/:fruitId/edit
app.get("/fruits/:fruitId/edit", async (req, res) => {
    // Mongo Query (findById returns one record)
  const foundFruit = await Fruit.findById(req.params.fruitId);
  console.log(foundFruit);
  //res.send(`This is the edit route for ${foundFruit.name}`);
  res.render("fruits/edit.ejs", { fruit: foundFruit });

});


// GET/fruits/fruitID(show)
app.get("/fruits/:fruitId",  async(req,res)=> {
  // Mongo Query (findById)
  const foundFruit = await Fruit.findById(req.params.fruitId)
  res.render("fruits/show.ejs", { fruit: foundFruit });
})



app.listen(3030, () => {
  console.log('Listening on port 3030');
});
