const db = require('../config/db');

// 사진 파일 경로와 다이어리 ID 저장
exports.savePhotoPath = (filePath, diaryId) => {
    const query = `
        INSERT INTO Photos (file_path, created_at, diary_id)
        VALUES (?, NOW(), ?)
    `;
    const values = [filePath, diaryId];

    return new Promise((resolve, reject) => {
        db.query(query, values, (err, results) => {
            if (err) {
                console.error("Error saving photo path:", err);
                return reject(err);
            }
            resolve(results.insertId);
        });
    });
};

// 특정 diary_id에 연결된 모든 사진 조회
exports.getPhotosByDiaryId = (diaryId) => {
    const query = "SELECT * FROM Photos WHERE diary_id = ?";
    
    return new Promise((resolve, reject) => {
        db.query(query, [diaryId], (err, rows) => {
            if (err) {
                console.error("Error fetching photos:", err);
                return reject(err);
            }
            resolve(rows);
        });
    });
};

// 특정 diary_id에 연결된 모든 사진 삭제
exports.deletePhotosByDiaryId = (diaryId) => {
    const query = "DELETE FROM Photos WHERE diary_id = ?";

    return new Promise((resolve, reject) => {
        db.query(query, [diaryId], (err, result) => {
            if (err) {
                console.error("Error deleting photos:", err);
                return reject(err);
            }
            resolve(result.affectedRows);
        });
    });
};