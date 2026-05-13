//CRUD eventi
import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Route eventi OK");
});

export default router;
