const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.get("/", function(req, res) {
  console.log("get request to '/'");
  res.send("hello world");
});
app.get("/user/login", function(req, res) {
  res.render("login");
});

app.listen(process.env.PORT, function() {
  console.log("server started");
});
