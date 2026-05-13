//VALIDAZIONE TOKEN
import jwt from "jsonwebtoken";

const JWT_SECRET = "supersegreto123"; //da sistemare poi

export function auth(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ errore: "Token mancante" });
    }

    const token = header.split(" ")[1]; // "Bearer TOKEN"

    const decoded = jwt.verify(token, JWT_SECRET);

    req.utente = decoded; // contiene id e ruolo

    next();

  } catch (err) {
    return res.status(401).json({ errore: "Token non valido" });
  }
}
