// models/Tag.js
const db = require('../config/db');

// 태그 추가 함수
exports.addTags = (tags, diary_id) => {
    return new Promise((resolve, reject) => {
        const tagQuery = "INSERT INTO Tags (tag_name, created_at) VALUES ?";
        const tagValues = tags.map(tag => [tag, new Date()]);

        db.query(tagQuery, [tagValues], (err, tagResults) => {
            if (err) {
                reject("태그 저장 오류");
            } else {
                const tagIds = tagResults.insertId;
                const diaryTagQuery = "INSERT INTO Diary_Tags (diary_id, tag_id, created_at) VALUES ?";
                const diaryTagValues = tags.map((_, index) => [diary_id, tagIds + index, new Date()]);

                db.query(diaryTagQuery, [diaryTagValues], (err) => {
                    if (err) {
                        reject("Diary_Tags 저장 오류");
                    } else {
                        resolve("태그와 Diary_Tags 저장 성공");
                    }
                });
            }
        });
    });
};

// 특정 태그와 연관된 일기 목록 조회
exports.getDiariesByTag = (tagName) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT d.diary_id, d.content
            FROM Diaries d
            JOIN Diary_Tags dt ON d.diary_id = dt.diary_id
            JOIN Tags t ON dt.tag_id = t.tag_id
            WHERE t.tag_name = ?
        `;

        db.query(query, [tagName], (err, rows) => {
            if (err) {
                reject("태그로 일기 검색 오류");
            } else {
                resolve(rows);
            }
        });
    });
};

// 특정 일기에 등록된 태그 조회
exports.getTagsByDiaryId = (diary_id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT t.tag_name
            FROM Tags t
            JOIN Diary_Tags dt ON t.tag_id = dt.tag_id
            WHERE dt.diary_id = ?
        `;

        db.query(query, [diary_id], (err, rows) => {
            if (err) {
                reject("일기에 대한 태그 조회 오류");
            } else {
                resolve(rows.map(row => row.tag_name));
            }
        });
    });
};

// 특정 일기에 등록된 전체 태그 삭제 함수
exports.deleteTagsFromDiary = (diary_id) => {
    return new Promise((resolve, reject) => {
        // Diary_Tags 테이블에서 해당 일기와 연결된 모든 태그 삭제
        const deleteDiaryTagsQuery = "DELETE FROM Diary_Tags WHERE diary_id = ?";
        db.query(deleteDiaryTagsQuery, [diary_id], (err) => {
            if (err) {
                reject("일기에서 전체 태그 삭제 오류");
            } else {
                resolve("일기에서 모든 태그가 성공적으로 삭제되었습니다.");
            }
        });
    });
};