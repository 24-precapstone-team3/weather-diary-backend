require('dotenv').config();
const express = require('express'); // Express 모듈 불러오기
const path = require('path');       // 경로 조작을 위한 path 모듈
const weatherRoutes = require('./routes/weatherRoutes');
const diaryRoutes = require('./routes/diaryRoutes');
const userRoutes = require('./routes/userRoutes');
const openAiRoutes = require('./routes/openAiRoutes');// OpenAI 라우터 불러오기
const photoRoutes = require('./routes/photoRoutes'); // 사진 라우트 불러오기
const tagRoutes = require('./routes/tagRoutes');// 태그  라우트 불러오기
const analysisRoutes = require('./routes/analysisRoutes'); //일기상담 라우트 불러오기


const app = express();              // Express 애플리케이션 생성
const PORT = process.env.PORT || 443; // 포트 설정 (기본값 3000)

app.use(express.json());
app.use('/api', diaryRoutes);
app.use('/api', userRoutes);
app.use('/api', weatherRoutes);
// 'uploads' 폴더를 정적 파일로 제공 (사진 접근을 위해)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//사진 라우트 연결
app.use('/api', photoRoutes);
//태그 라우트 연결
app.use('/api', tagRoutes);
//일기 상담 라우트 연결
app.use('/api', analysisRoutes);
// OpenAI 라우트 연결
app.use('/api', openAiRoutes);
// 서버 시작
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
