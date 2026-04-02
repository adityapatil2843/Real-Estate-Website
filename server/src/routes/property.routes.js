// routes/property.routes.js

import express from "express";
import { getAllProperties } from "../controllers/property.controller.js";

const propertyRoutes = express.Router();

propertyRoutes.get("/property-list", getAllProperties);

export default propertyRoutes;