// models/Diary.js
const db = require('../config/db');

// 새로운 일기를 생성
const createDiary = (firebase_uid, content, date, weather) => {
    return db.promise().query('INSERT INTO Diaries (firebase_uid, content, date, weather) VALUES (?, ?, ?, ?)', [firebase_uid, content, date, weather]);
};

// 일기 업데이트 (content만 수정)
const updateDiary = (diaryId, content) => {
    console.log('Updating diary:', diaryId, content); // 로그 추가
    return db.promise().query('UPDATE Diaries SET content = ? WHERE diary_id = ?', [content, diaryId]);
};


// 모든 일기 조회
const getAllDiaries = (firebase_uid) => {
    return db.promise().query('SELECT * FROM Diaries WHERE firebase_uid = ?', [firebase_uid]);
};

// 특정 일기 조회
const getDiaryById = (diaryId) => {
    return db.promise().query('SELECT * FROM Diaries WHERE diary_id = ?', [diaryId]);
};

// 일기 삭제
const deleteDiary = (diaryId) => {
    return db.promise().query('DELETE FROM Diaries WHERE diary_id = ?', [diaryId]);
};


module.exports = { createDiary, getAllDiaries, updateDiary, getDiaryById, deleteDiary};
