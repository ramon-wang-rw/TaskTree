const router = require("express").Router();
let User = require("../schemas/userSchema");

router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("error"));
});

router.route("/add").post((req, res) => {
  console.log("here");
  const username = req.body.username;
  const password = req.body.password;
  const newUser = new User({ username, password });
  newUser
    .save()
    .then(() => res.json("user added"))
    .catch((err) => res.status(400).json("error"));
});

module.exports = router;
