import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

dotenv.config();

import authentificationRoutes from "./routers/authentificationRouter";
import propertyRoutes from "./routers/propertyRouter";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: "http://localhost:3000"
}));

app.use(authentificationRoutes);
app.use(propertyRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Server Listening on port: ", PORT);
});