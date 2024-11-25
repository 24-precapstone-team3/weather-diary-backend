const db = require('../config/db');

// 태그 추가
exports.addTags = async (firebase_uid, tags, diary_id) => {
    const tagInsertQuery = `
        INSERT INTO Tags (tag_name, created_at)
        VALUES (?, NOW())
        ON DUPLICATE KEY UPDATE tag_id = LAST_INSERT_ID(tag_id)
    `;
    const diaryTagInsertQuery = `
        INSERT INTO Diary_Tags (diary_id, tag_id, created_at)
        VALUES (?, ?, NOW())
    `;

    try {
        for (const tag of tags) {
            // 태그를 추가하거나 기존 태그의 ID를 가져옴
            const [tagResult] = await db.promise().query(tagInsertQuery, [tag]);
            const tag_id = tagResult.insertId;

            // Diary_Tags 테이블에 연결
            await db.promise().query(diaryTagInsertQuery, [diary_id, tag_id]);
        }
        return "태그 추가 성공";
    } catch (err) {
        throw new Error("태그 추가 중 오류 발생");
    }
};

// 특정 태그로 일기 목록 조회
exports.getDiariesByTag = async (firebase_uid, tagName) => {
    const query = `
        SELECT dt.diary_id
        FROM diary_tags dt
        JOIN tags t ON dt.tag_id = t.tag_id
        JOIN Diaries d ON dt.diary_id = d.diary_id
        WHERE t.tag_name = ? AND d.firebase_uid = ?
    `;

    try {
        const [rows] = await db.promise().query(query, [tagName, firebase_uid]);

        return rows; // 일기 ID 리스트 반환
    } catch (err) {
        throw new Error("태그로 일기 조회 중 오류 발생");
    }
};

// 특정 일기에 연결된 태그 조회
exports.getTagsByDiaryId = async (firebase_uid, diary_id) => {
    const query = `
        SELECT t.tag_name
        FROM Tags t
        JOIN Diary_Tags dt ON t.tag_id = dt.tag_id
        JOIN Diaries d ON dt.diary_id = d.diary_id
        WHERE d.firebase_uid = ? AND d.diary_id = ?
    `;

    try {
        const [results] = await db.promise().query(query, [firebase_uid, diary_id]);
        return results.map(row => row.tag_name);  // 태그명만 반환
    } catch (err) {
        throw new Error("태그 조회 중 오류 발생");
    }
};

// 특정 일기에서 모든 태그 삭제
exports.deleteTagsFromDiary = async (firebase_uid, diary_id) => {
    const query = `
        DELETE dt
        FROM Diary_Tags dt
        JOIN Diaries d ON dt.diary_id = d.diary_id
        WHERE d.firebase_uid = ? AND dt.diary_id = ?
    `;

    try {
        const [results] = await db.promise().query(query, [firebase_uid, diary_id]);
        return results.affectedRows;  // 영향을 받은 행 수 반환
    } catch (err) {
        throw new Error("태그 삭제 중 오류 발생");
    }
};

// 필요 없는 태그 삭제
exports.cleanUpTags = async () => {
    const query = `
        DELETE FROM Tags
        WHERE tag_id NOT IN (SELECT DISTINCT tag_id FROM Diary_Tags)
    `;

    try {
        const [results] = await db.promise().query(query);
        return results.affectedRows;  // 영향을 받은 행 수 반환
    } catch (err) {
        throw new Error("필요 없는 태그 삭제 중 오류 발생");
    }
};
