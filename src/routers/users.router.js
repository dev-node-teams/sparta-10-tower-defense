import express from 'express';
import { UsersController } from '../controllers/users.controller.js';

const router = express.Router();
const usersController = new UsersController();

router.post('/sign-up', usersController.createUser);

export default router;
