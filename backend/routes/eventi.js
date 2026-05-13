//CRUD eventi
import express from "express";
const router = express.Router();
import { getEventiByVia, getEventoById, createEvento, updateEvento } from "../controllers/eventiControler.js";

router.get("/", (req, res) => {
  res.send("Route eventi OK");
});

//get eventi by via
router.get("/via/:via", (req, res) => {
  const via = req.params.via;
  const eventi = getEventiByVia(via);
  res.json(eventi);
});

//get eventi by id
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const evento = getEventoById(id);
  res.json(evento);
});

//create evento
router.post("/create", (req, res) => {
  const evento = req.body;
  const evento2 = createEvento(evento);
  res.json(evento2);
});

//update evento
router.post("/update/:id", (req, res) => {
  const id = req.params.id;
  const evento = req.body;
  const evento2 = updateEvento(id, evento);
  res.json(evento2);
});

export default router;
