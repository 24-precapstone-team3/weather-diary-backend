require('dotenv').config();
const express = require('express'); // Express 모듈 불러오기
const path = require('path');       // 경로 조작을 위한 path 모듈
const weatherRoutes = require('./routes/weatherRoutes');
const diaryRoutes = require('./routes/diaryRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();              // Express 애플리케이션 생성
const PORT = process.env.PORT || 3000; // 포트 설정 (기본값 3000)

// 미들웨어 설정
//app.use(express.json()); // JSON 요청을 처리하는 미들웨어
//app.use(express.urlencoded({ extended: false })); // URL-encoded 요청을 처리하는 미들웨어
//app.use(express.static(path.join(__dirname, '../public'))); // public 폴더를 정적 파일로 제공

app.use(express.json());
app.use('/api', diaryRoutes);
app.use('/api', userRoutes);
app.use('/api', weatherRoutes);

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
