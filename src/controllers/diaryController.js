// controllers/diaryController.js
const { getWeather } = require('../models/Weather');
const diaryModel = require('../models/Diary');  // Diary 모델

const createDiary = async (req, res) => {
    const { firebase_uid, content, date, city } = req.body;

    // date가 없거나 잘못된 형식일 경우 처리
    if (!date || !isValidDate(date)) {
        return res.status(400).json({ error: '올바른 날짜 형식(YYYY-MM-DD)을 입력해주세요.' });
    }

    try {
        // 날씨 정보를 받아오기
        const weatherData = await getWeather(city);
        const weather = weatherData.weather[0].description; // 날씨 설명

        // 입력된 date를 그대로 사용
        const formattedDate = date; // date 값을 그대로 사용

        // 일기 생성
        const [results] = await diaryModel.createDiary(firebase_uid, content, formattedDate, weather);
        res.status(201).json({ diary_id: results.insertId, firebase_uid, content, date: formattedDate, weather });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// 날짜 형식 검증 함수 (YYYY-MM-DD)
const isValidDate = (date) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
};

// 일기를 업데이트하는 함수 (content만 업데이트)
const updateDiary = async (req, res) => {
    const diaryId = req.params.diary_id;
    const { content } = req.body;  // content만 받도록 수정

    // content가 없는 경우 처리
    if (!content) {
        return res.status(400).json({ error: '일기 내용(content)을 입력해 주세요.' });
    }

    try {
        await diaryModel.updateDiary(diaryId, content);  // content만 전달
        res.json({ message: '일기가 수정되었습니다.' });
    } catch (error) {
        res.status(500).json({ error: '일기 수정에 실패했습니다.' });
    }
};


// 모든 일기를 조회하는 함수
const getAllDiaries = async (req, res) => {
    const firebase_uid = req.query.firebase_uid;

    try {
        const [results] = await diaryModel.getAllDiaries(firebase_uid);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: '일기 조회에 실패했습니다.' });
    }
};

// 특정 일기를 조회하는 함수
const getDiaryById = async (req, res) => {
    const diaryId = req.params.diary_id;

    try {
        const [results] = await diaryModel.getDiaryById(diaryId);
        if (results.length === 0) {
            return res.status(404).json({ error: '일기를 찾을 수 없습니다.' });
        }
        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ error: '일기 조회에 실패했습니다.' });
    }
};

// 일기를 삭제하는 함수
const deleteDiary = async (req, res) => {
    const diaryId = req.params.diary_id;

    try {
        await diaryModel.deleteDiary(diaryId);
        res.json({ message: '일기가 삭제되었습니다.' });
    } catch (error) {
        res.status(500).json({ error: '일기 삭제에 실패했습니다.' });
    }
};

module.exports = { createDiary, getAllDiaries,updateDiary, getDiaryById, deleteDiary };
