const express = require("express");

const app = express();

const cors = require("cors");
// post下的body
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

// res.cc()
app.use((req, res, next) => {
  res.cc = (err, code = 1) => {
    res.send({
      code,
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

app.use(cors());
const users = require("./router/users");
app.use("/api", users);
const later = require('./router/lateruser');
app.use("/api",later)

app.listen(3000, () => {
  console.log("服务器启动成功！");
}); 
