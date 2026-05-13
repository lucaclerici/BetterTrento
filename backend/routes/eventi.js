//CRUD eventi
import express from "express";
const router = express.Router();
import { getEventiByVia, getEventoById, createEvento, updateEvento } from "../controllers/eventiControler.js";

router.get("/", (req, res) => {
  res.send("Route eventi OK");
});

//get eventi by via
router.get("/via/:via", async (req, res) => {
  const via = req.params.via;
  const eventi = await getEventiByVia(via);
  console.log(eventi);
  res.json(eventi);
});

//get eventi by id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const evento = await getEventoById(id);
  res.json(evento);
});

//create evento
router.post("/create", async (req, res) => {
  const evento = req.body;
  const evento2 = await createEvento(evento);
  res.json(evento2);
});

//update evento
router.post("/update/:id", async (req, res) => {
  const id = req.params.id;
  const evento = req.body;
  const evento2 = await updateEvento(id, evento);
  res.json(evento2);
});

export default router;
