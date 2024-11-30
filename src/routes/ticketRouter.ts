import express from "express";
import {createTicket, deleteTicket, getAllTickets, getTicketById} from "../controllers/ticketController";

const router = express.Router();

router.post("/createTicket", createTicket as express.RequestHandler);
router.get("/getTicketById/:id", getTicketById as express.RequestHandler);
router.get("/getAllTickets", getAllTickets as express.RequestHandler);
router.delete("/deleteTicket/:id", deleteTicket as express.RequestHandler);

export default router;