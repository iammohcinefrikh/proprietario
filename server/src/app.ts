import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

dotenv.config();

import authentificationRoutes from "./routers/authentificationRouter";
import statsRoute from "./routers/statsRouter";
import unitRoutes from "./routers/unitRouter";
import tenantRoutes from "./routers/tenantRouter";
import landlordRouter from "./routers/landlordRouter";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: process.env.DOMAIN_URL
}));

app.use(authentificationRoutes);
app.use(statsRoute);
app.use(unitRoutes);
app.use(tenantRoutes);
app.use(landlordRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Server Listening on port: ", PORT);
});