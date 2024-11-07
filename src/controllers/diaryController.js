// controllers/diaryController.js
const { getWeather } = require('../models/Weather');
const diaryModel = require('../models/Diary');  // Diary 모델

// 새로운 일기를 생성하는 함수
const createDiary = async (req, res) => {
    const { firebase_uid, content, date, city } = req.body;

    try {
        // 날씨 정보를 받아오기
        const weatherData = await getWeather(city);
        const weather = weatherData.weather[0].description; // 날씨 설명

        // 일기 생성
        const [results] = await diaryModel.createDiary(firebase_uid, content, date, weather);
        res.status(201).json({ diary_id: results.insertId, firebase_uid, content, date, weather });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// // 일기를 업데이트하는 함수
// const updateDiary = async (req, res) => {
//     const diaryId = req.params.id;
//     const { content, weather } = req.body;

//     try {
//         await diaryModel.updateDiary(diaryId, content, weather);
//         res.json({ message: '일기가 수정되었습니다.' });
//     } catch (error) {
//         res.status(500).json({ error: '일기 수정에 실패했습니다.' });
//     }
// };

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

// // 해시태그로 일기 검색하는 함수
// const searchDiaries = async (req, res) => {
//     const { firebase_uid, hashtag } = req.query;

//     try {
//         const [results] = await diaryModel.searchDiariesByHashtag(firebase_uid, hashtag);
//         res.json(results);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

module.exports = { createDiary, getAllDiaries, getDiaryById, deleteDiary };
