// const http = require("http");
// import gfname, { gfname2, gfname3 } from "./features.js";
// import * as myobj from "./features.js";
// console.log(myobj.default);
// console.log(myobj.gfname2);
// console.log(myobj.gfname3);
// import http from "http";
// import fs from "fs";
// import { calculateLovePercentage } from "./features.js";
// const home = fs.readFileSync("./index.html");
// const server = http.createServer((req, res) => {
//   if (req.url === "/about") {
//     res.end(`<h1>Love is ${calculateLovePercentage()}</h1>`);
//   } else if (req.url === "/") {
//     res.end(home);
//   } else if (req.url === "/contact") {
//     res.end("Contact page");
//   } else {
//     res.end("Page not found");
//   }
// });
// server.listen(3000, () => {
//   console.log("Server is working!");
// });
//This is all very messy and we have not used any methods yet so this will get even more messier . So first of all installing a package
//Now making the server using
import exp from "constants";
import { name } from "ejs";
import path from "path";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "backend",
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((e) => {
    console.log(e);
  });

//need to create schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
//need to create a model , model is just a fancy name for the collection, a collection is just collection of databases
// const Message = mongoose.model("Message", messageSchema);
const User = mongoose.model("User", userSchema);
const app = express();
const users = [];
//Using middlewares
//setting the static folder
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//We are using ejs to dynamically render HTML for that
//-->First of all make a directory named views
//-->and move the html file to be rendered in that directory and rename the file from .html to .ejs
app.set("view engine", "ejs");
//creating a function
const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const decoded = jwt.verify(token, "sdjasdbajsdbjasd");
    req.user = await User.findById(decoded._id);
    next();
  } else {
    res.redirect("/login");
  }
};
//we can pass as many handlers as possible
app.get("/", isAuthenticated, (req, res) => {
  // console.log(req.user);
  res.render("logout", { name: req.user.name });
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});
// app.get("/", (req, res) => {
//   // res.sendStatus(404);
//   //404->Not found but we can print our message on getting this code error like this:
//   // res.status(400).send("Heehee Boii!");
//   // res.json({
//   //   success: true,
//   //   products: ["pen", "pencil", "copies"],
//   // });
//   //how to get path location
//   // const pathlocation = path.resolve();
//   // res.sendFile(path.join(pathlocation, "./index.html"));
//   //using ejs we can now render
//   // res.render("index", { name: "Kumkum Rani" });
//   //with the help pf static folder pubic
//   // res.sendFile("index");

//   //We want to render the login.ejs now
//   // console.log(req.cookies.token);
//   const { token } = req.cookies;
//   if (token) {
//     res.render("logout");
//   } else {
//     res.render("login");
//   }
//   res.render("login");
// });
//By default when we normally click the submit button then the method by default is get method jisse hmne jo v input diya wo usi page k url pe dikhne lagega if we want to post the inputs on different location then
// app.get("/success", (req, res) => {
//   res.render("success");
// });
// app.post("/", (req, res) => {
//   // console.log(req.body.name); //But iske liye v ek middleware lagega
//   //Agar hm chahte h ki submit btn pe click hote hi koi ek nyi page render ho then
//   //Also for now we are pushing the elements in the array so that whatever data is given as input in the form gets stored in the users array
//   users.push({ username: req.body.name, email: req.body.email });
//   res.redirect("/success");
// });
// app.get("/add", (req, res) => {
//   Message.create({ name: "kumkum", email: "kumkumr0815@gmail.com" }).then(
//     () => {
//       res.send("Nice!!");
//     }
//   );
// });

//instead of chaining using then we can use async and await:
// app.get("/add", async (req, res) => {
//   await Message.create({
//     name: "Saraswati Kumari",
//     email: "saras252k@getMaxListeners.com",
//   });
//   res.send("Nice");
// });
// app.get("/users", (req, res) => {
//   res.json({
//     users,
//   });
// });

//earlier we were storing the data in the array now lets store the data in mongodb
// app.post("/contact", async (req, res) => {
//   const { name, email } = req.body; //defined here so no need to write req.body again and again
//   // await Message.create({
//   //   name: name,
//   //   email: email,
//   // });
//   //also if key and value pair names are same then this can be reduced to :
//   await Message.create({ name, email });
//   res.redirect("/success");
// });

// app.post("/login", async (req, res) => {
//   const { name, email } = req.body;

//   //we can check whether the user exists already or not
//   let user = await User.findOne({ email });
//   if (!user) {
//     return res.redirect("/register");
//   }
//   user = await User.create({
//     name,
//     email,
//   });
//   const token = jwt.sign({ _id: user._id }, "shdhuskafaskhfufjue");

//   res.cookie("token", token, {
//     httpOnly: true,
//     expires: new Date(Date.now() + 60 * 1000),
//   });
//   res.redirect("/");
// });

// app.get("/logout", (req, res) => {
//   res.cookie("token", null, {
//     httpOnly: true,
//     expires: new Date(Date.now()),
//   });
//   res.redirect("/");
// });
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user) return res.redirect("/register");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return res.render("login", { email, message: "Incorrect Password" });

  const token = jwt.sign({ _id: user._id }, "sdjasdbajsdbjasd");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.redirect("/login");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ _id: user._id }, "sdjasdbajsdbjasd");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});

app.listen(5000, () => {
  console.log("server is working!");
});
