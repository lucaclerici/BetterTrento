//CRUD eventi
import express from "express";
const router = express.Router();
import { getEventiByVia, getEventoById, createEvento, updateEvento } from "../controllers/eventiControler.js";
import { Evento } from "../models/schema.js";

router.get("/", (req, res) => {
  res.send("Route eventi OK");
});

//get eventi by via
router.get("/via/:via", getEventiByVia);

//get eventi by id
router.get("/evento/:id", getEventoById);

//create evento
router.post("/create", createEvento);

//update evento
router.post("/update/:id", updateEvento);

export default router;
