// models/Diary.js
const db = require('../db/db');

// 새로운 일기를 생성
const createDiary = (firebase_uid, content, date, weather) => {
    return db.promise().query('INSERT INTO Diaries (firebase_uid, content, date, weather) VALUES (?, ?, ?, ?)', [firebase_uid, content, date, weather]);
};

// // 일기 업데이트
// const updateDiary = (diaryId, content, weather) => {
//     return db.promise().query('UPDATE Diaries SET content = ?, weather = ? WHERE diary_id = ?', [content, weather, diaryId]);
// };

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

// // 해시태그로 일기 검색
// const searchDiariesByHashtag = (firebase_uid, hashtag) => {
//     return db.promise().query(
//         'SELECT tag_id FROM Tags WHERE tag_name = ?', [hashtag]
//     ).then(tagResults => {
//         if (tagResults.length === 0) {
//             throw new Error('해당 해시태그를 찾을 수 없습니다.');
//         }
//         const tagId = tagResults[0].tag_id;

//         return db.promise().query(
//             'SELECT D.* FROM Diaries D ' +
//             'JOIN Diary_Tags DT ON D.diary_id = DT.diary_id ' +
//             'WHERE D.firebase_uid = ? AND DT.tag_id = ?',
//             [firebase_uid, tagId]
//         );
//     });
// };

module.exports = { createDiary, getAllDiaries, getDiaryById, deleteDiary};
