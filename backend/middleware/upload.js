import multer from "multer";//per caricare la foto

const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;

