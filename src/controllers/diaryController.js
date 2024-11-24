// controllers/diaryController.js
const { getWeather } = require('../models/Weather');
const diaryModel = require('../models/Diary');
const { analyzeDiaryContent } = require('../models/openAi'); // OpenAI 분석 함수 불러오기

// 새로운 일기 작성
const createDiary = async (req, res) => {
    const firebase_uid = req.firebase_uid; // 미들웨어에서 처리된 UID
    const { content, date, city } = req.body;

    if (!firebase_uid || !date || !isValidDate(date)) {
        return res.status(400).json({ error: 'firebase_uid와 올바른 날짜 형식(YYYY-MM-DD)을 제공해주세요.' });
    }

    try {
        const weatherData = await getWeather(city);
        const weather = weatherData.weather[0].description;

        const { mood } = await analyzeDiaryContent(content);

        const [results] = await diaryModel.createDiary(firebase_uid, content, date, weather, mood);

        res.status(201).json({
            diary_id: results.insertId,
            firebase_uid,
            content,
            date,
            weather,
            emotion: mood, // 응답에 emotion 포함
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 날짜 형식 검증 함수 (YYYY-MM-DD)
const isValidDate = (date) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
};

// 모든 일기 조회
const getAllDiaries = async (req, res) => {
    const firebase_uid = req.firebase_uid; // 미들웨어에서 처리된 UID

    if (!firebase_uid) {
        return res.status(400).json({ error: 'firebase_uid를 제공해주세요.' });
    }

    try {
        const [diaryRows] = await diaryModel.getAllDiaries(firebase_uid);

        // 필요한 데이터만 반환 (배열 형태)
        const diaries = diaryRows.map(diary => ({
            diary_id: diary.diary_id,
            firebase_uid: diary.firebase_uid,
            content: diary.content,
            date: diary.date,
            weather: diary.weather,
            emotion: diary.emotion,
            created_at: diary.created_at,
        }));

        res.json(diaries);
    } catch (err) {
        res.status(500).json({ error: '일기 조회 실패', details: err.message });
    }
};

// 특정 일기 조회
const getDiaryById = async (req, res) => {
    const firebase_uid = req.firebase_uid; // 미들웨어에서 처리된 UID
    const { diary_id } = req.params;

    if (!firebase_uid || !diary_id) {
        return res.status(400).json({ error: 'firebase_uid와 diary_id를 제공해주세요.' });
    }

    try {
        const [diaryRows] = await diaryModel.getDiaryById(diary_id, firebase_uid);

        if (!diaryRows || diaryRows.length === 0) {
            return res.status(404).json({ error: '일기를 찾을 수 없거나 접근 권한이 없습니다.' });
        }

        const diary = diaryRows[0];

        res.json({
            diary_id: diary.diary_id,
            firebase_uid: diary.firebase_uid,
            content: diary.content,
            date: diary.date,
            weather: diary.weather,
            emotion: diary.emotion,
            created_at: diary.created_at,
        });
    } catch (err) {
        res.status(500).json({ error: '일기 조회 실패', details: err.message });
    }
};

// 특정 일기 수정
const updateDiary = async (req, res) => {
    const firebase_uid = req.firebase_uid; // 미들웨어에서 처리된 UID
    const { diary_id } = req.params;
    const { content } = req.body;

    if (!firebase_uid || !diary_id || !content) {
        return res.status(400).json({ error: 'firebase_uid, diary_id와 content를 제공해주세요.' });
    }

    try {
        // 다이어리 내용 업데이트
        const [results] = await diaryModel.updateDiary(diary_id, content);
        if (results.affectedRows > 0) {
            // OpenAI API 호출하여 분석
            const { mood, hashTag, feedback } = await analyzeDiaryContent(content);

            // 분석 결과 및 emotion 저장
            await diaryModel.updateDiaryAnalysis(diary_id, feedback, hashTag, mood);

            // 수정된 다이어리 데이터 조회
            const [updatedDiary] = await diaryModel.getDiaryById(diary_id);

            if (!updatedDiary || updatedDiary.length === 0) {
                return res.status(404).json({ error: '수정된 일기를 찾을 수 없습니다.' });
            }

            // 응답으로 수정된 데이터 반환
            res.status(200).json({
                message: '일기 수정 성공',
                updatedDiary: updatedDiary[0], // 단일 다이어리 정보 반환
            });
        } else {
            res.status(404).json({ error: '일기를 찾을 수 없거나 수정할 권한이 없습니다.' });
        }
    } catch (err) {
        res.status(500).json({ error: '일기 수정 실패', details: err.message });
    }
};



// 특정 일기 삭제
const deleteDiary = async (req, res) => {
    const firebase_uid = req.firebase_uid; // 미들웨어에서 처리된 UID
    const { diary_id } = req.params;

    if (!firebase_uid || !diary_id) {
        return res.status(400).json({ error: 'firebase_uid와 diary_id를 제공해주세요.' });
    }

    try {
        const [results] = await diaryModel.deleteDiary(diary_id, firebase_uid);
        if (results.affectedRows > 0) {
            res.status(200).json({ message: '일기 삭제 성공' });
        } else {
            res.status(404).json({ error: '일기를 찾을 수 없거나 삭제할 권한이 없습니다.' });
        }
    } catch (err) {
        res.status(500).json({ error: '일기 삭제 실패', details: err.message });
    }
};

module.exports = { createDiary, getAllDiaries, updateDiary, getDiaryById, deleteDiary };
