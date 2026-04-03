import express from "express";
import { searchProperties } from "../controllers/propertyList.controller.js";

const propertyListrouter = express.Router();

// Search API
propertyListrouter.get("/search", searchProperties);

export default propertyListrouter;