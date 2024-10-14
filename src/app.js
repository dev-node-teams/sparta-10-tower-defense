import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import initSocket from './init/socket.js';
import userRouter from './routers/users.router.js';
import rankRouter from './routers/ranks.router.js';
import errorMiddleware from './middlewares/error.middleware.js';
import { initRedisClient } from './init/redis.js';
import { initData } from './init/initData.js';
import { ScheduleController } from './controllers/schedule.controller.js';

// .env => process.env
dotenv.config();

const app = express();
const server = createServer(app);

const PORT = 3005;

app.use(express.json()); // json 파싱
app.use(express.urlencoded({ extended: false })); // URL 인코딩, library 사용유무
app.use(express.static('public')); // 정적파일 서빙

// init 폴더
initSocket(server);

app.use('/api', [userRouter, rankRouter]);

app.use(errorMiddleware);

app.get('/', (req, res, next) => {
  res.send('Hello World! : Tower Defense!');
});

server.listen(PORT, async () => {
  try {
    // redis 설정
    await initRedisClient();
    // 초기 데이터 세팅 ( MySQL -> Redis )
    await initData();

    const scheduleController = new ScheduleController();
    scheduleController.createRankHistory();

    console.log(`Server is running on port ${PORT}`);
  } catch (e) {
    console.error('Failed to load Redis ', e);
  }
});
