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

// Analysis_results 테이블에 분석 결과 저장 (content만 수정, emotion만 업데이트)
const updateDiaryAnalysis = (diaryId, content, emotion) => {
    const queries = [];

    // Diaries 테이블의 content와 emotion 업데이트
    queries.push(
        db.promise().query(
            'UPDATE Diaries SET content = ?, emotion = ? WHERE diary_id = ?',
            [content, emotion, diaryId]
        )
    );

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

// 다이어리와 관련된 모든 데이터 삭제 (controller에서 이미 삭제가 진행되므로 다이어리만 삭제)
const deleteDiary = async (firebase_uid, diary_id) => {
    const query = `
        DELETE FROM Diaries 
        WHERE diary_id = ? AND firebase_uid = ?;
    `;

    const [result] = await db.promise().query(query, [diary_id, firebase_uid]);

    if (result.affectedRows === 0) {
        throw new Error("삭제할 다이어리가 없거나 권한이 없습니다.");
    }

    return result.affectedRows; // 삭제된 행 수 반환
};


// firebase_uid와 diary_id 검증
const verifyDiaryOwner = async (firebase_uid, diary_id) => {
    try {
        const query = `
            SELECT COUNT(*) AS count 
            FROM Diaries 
            WHERE firebase_uid = ? AND diary_id = ?
        `;

        const [results] = await db.promise().query(query, [firebase_uid, diary_id]);

        return results[0].count > 0; // 소유 여부 반환
    } catch (err) {
        console.error('Error verifying diary owner:', err.message);
        throw new Error('Failed to verify diary ownership');
    }
};

module.exports = { 
    createDiary, 
    getAllDiaries, 
    updateDiary, 
    getDiaryById, 
    updateDiaryAnalysis, 
    deleteDiary,
    verifyDiaryOwner
};
