import express from "express";
import {createDevice, deleteDevice, getAllDevices, getDevice, updateDevice} from "../controllers/deviceController";

const router = express.Router();

router.post("/createDevice", createDevice as express.RequestHandler);
router.get("/getDevice/:id", getDevice as express.RequestHandler);
router.get("/getAllDevices", getAllDevices as express.RequestHandler);
router.put("/updateDevice/:id", updateDevice as express.RequestHandler);
router.delete("/deleteDevice/:id", deleteDevice as express.RequestHandler);

export default router;