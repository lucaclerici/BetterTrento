export const checkAdmin = (req, res, next) => {
    // req.utente viene creato prima dal tuo middleware 'auth'
    if (req.utente && req.utente.ruolo === 'admin') {
        next(); // L'utente è admin! Procedi pure verso la rotta
    } else {
        // 403 significa "Forbidden" (Vietato)
        return res.status(403).json({ error: "Accesso negato: devi essere un amministratore." });
    }
};