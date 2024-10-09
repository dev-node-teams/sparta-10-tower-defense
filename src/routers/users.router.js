import express from 'express';
import { UsersController } from '../controllers/users.controller.js';

const router = express.Router();
const usersController = new UsersController();

// 회원가입
router.post('/sign-up', usersController.signUp);
// 로그인
router.post('/sign-in', usersController.signIn);

export default router;
