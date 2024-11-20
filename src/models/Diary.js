// models/Diary.js
const db = require('../config/db');

// 새로운 일기를 생성
const createDiary = (firebase_uid, content, date, weather, emotion) => {
    return db.promise().query(
        'INSERT INTO Diaries (firebase_uid, content, date, weather, emotion) VALUES (?, ?, ?, ?, ?)',
        [firebase_uid, content, date, weather, emotion]
    );
};

// 일기 업데이트 (content만 수정)
const updateDiary = (diaryId, content) => {
    console.log('Updating diary:', diaryId, content); // 로그 추가
    return db.promise().query('UPDATE Diaries SET content = ? WHERE diary_id = ?', [content, diaryId]);
};

// Analysis_results 테이블에 분석 결과 저장
const updateDiaryAnalysis = (diaryId, feedback, hashtags, emotion) => {
    const queries = [];

    // Diaries 테이블의 emotion 업데이트
    queries.push(
        db.promise().query(
            'UPDATE Diaries SET emotion = ? WHERE diary_id = ?',
            [emotion, diaryId]
        )
    );

    // Analysis_results 테이블 업데이트
    queries.push(
        db.promise().query(
            'INSERT INTO Analysis_results (diary_id, feedback, created_at) VALUES (?, ?, NOW()) ON DUPLICATE KEY UPDATE feedback = ?',
            [diaryId, feedback, feedback]
        )
    );

    // 태그 처리
    if (hashtags && Array.isArray(hashtags)) {
        hashtags.forEach(tag => {
            queries.push(
                db.promise().query(
                    'INSERT INTO Tags (tag_name, created_at) VALUES (?, NOW()) ON DUPLICATE KEY UPDATE tag_id = LAST_INSERT_ID(tag_id)',
                    [tag]
                )
            );
            queries.push(
                db.promise().query(
                    'INSERT IGNORE INTO Diary_Tags (diary_id, tag_id, created_at) SELECT ?, tag_id, NOW() FROM Tags WHERE tag_name = ?',
                    [diaryId, tag]
                )
            );
        });
    }

    return Promise.all(queries);
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


module.exports = { createDiary, getAllDiaries, updateDiary, getDiaryById, deleteDiary, updateDiaryAnalysis};
