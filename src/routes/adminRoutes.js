const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json("lista de usuarios secreta");
});

module.exports = router;
