import express from 'express';
import {
  createTicket,
  deleteTicket,
  getAllTickets,
  getTicket,
} from '../controllers/ticketController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validate';
import { createTicketSchema } from '../validations/ticketValidation';
import { objectIdParamSchema } from '../validations/commonValidation';

const router = express.Router();

// Public: anyone can create a ticket
router.post(
  '/createTicket',
  validate(createTicketSchema),
  createTicket as express.RequestHandler,
);

// Public: user can check their ticket by ID
router.get(
  '/getTicket/:id',
  validate(objectIdParamSchema, 'params'),
  getTicket as express.RequestHandler,
);

// Protected: only authenticated users can view all tickets
router.get(
  '/getAllTickets',
  authenticateToken as express.RequestHandler,
  getAllTickets as express.RequestHandler,
);

// Protected: only authenticated users can delete tickets
router.delete(
  '/deleteTicket/:id',
  authenticateToken as express.RequestHandler,
  validate(objectIdParamSchema, 'params') as express.RequestHandler,
  deleteTicket as express.RequestHandler,
);

export default router;
