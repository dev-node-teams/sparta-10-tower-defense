import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';

const app = express();
const server = createServer(app);

const PORT = 3005;

app.use(express.json()); // json 파싱
app.use(express.urlencoded({ extended: false })); // URL 인코딩, library 사용유무
app.use(express.static('public')); // 정적파일 서빙

// init 폴더
initSocket(server);

app.get('/', (req, res, next) => {
  res.send('Hello World! : Tower Defense!');
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
