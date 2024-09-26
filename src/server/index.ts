import express from "express";
import api from "./fileuploadRoute";
import view from "./imageviewerRoute";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const upload = multer(); // Middleware to handle multipart form data

// Enable CORS for all routes
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

console.log('AWS Bucket Region:', process.env.AWS_REGION);


app.use("/api", api);
app.use("/view", view)
// use api.ts file for all routes starting with /api
// use imageviewerRoute.ts file for all routes starting with /view


// start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
