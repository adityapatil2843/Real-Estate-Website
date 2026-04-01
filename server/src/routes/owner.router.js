import express from "express";
import { createProperty } from "../controllers/owner.controller.js";
// import isAuth from "../middleware/isAuth.js";
import isAuth from "../middleware/isAuth.js";

const ownerRoutes = express.Router();

// POST Property (Protected)
ownerRoutes.post("/property",isAuth, createProperty);

export default ownerRoutes;



