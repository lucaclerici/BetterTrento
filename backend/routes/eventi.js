//CRUD eventi
import express from "express";
const router = express.Router();
import { tuttiEventi, getEventiByVia, getEventoById, createEvento, updateEvento, eliminaEvento } from "../controllers/eventiControler.js";
import { auth } from "../middleware/auth.js";
import { autorizzaRuoli } from "../middleware/ruoli.js";
import { Evento } from "../models/schema.js";


//get di tutti gli eventi 
router.get("/", auth, autorizzaRuoli("AMMINISTRATORE"), tuttiEventi);

//get eventi by via
router.get("/via/:via", getEventiByVia);

//get eventi by id
router.get("/evento/:id", getEventoById);

//create evento
router.post("/create", auth, autorizzaRuoli("AMMINISTRATORE"), createEvento);

//update evento
router.post("/update/:id", auth, autorizzaRuoli("AMMINISTRATORE"), updateEvento);

//delete evento
router.delete("/:id", auth, autorizzaRuoli("AMMINISTRATORE"), eliminaEvento);


export default router;