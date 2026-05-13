//login, logout e gestione profilo
import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Route utenti OK");
});

export default router;
