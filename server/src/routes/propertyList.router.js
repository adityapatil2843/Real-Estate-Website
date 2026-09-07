import express from "express";
import { searchProperties, getAllProperties, getPropertyById } from "../controllers/propertyList.controller.js";

const propertyListrouter = express.Router();

// Search API
propertyListrouter.get("/search", searchProperties);
propertyListrouter.get("/property-list", getAllProperties);
propertyListrouter.get("/:id", getPropertyById);

export default propertyListrouter;