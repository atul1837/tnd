const express = require("express");
const app = express();

app.get("/", function(req, res) {
  console.log("get request to '/'");
  res.send("hello world");
});

app.listen(3000, function() {
  console.log("server started");
});
