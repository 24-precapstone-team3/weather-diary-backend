const db = require('../config/db');

// 사진 파일 경로와 다이어리 ID 저장
exports.savePhotoPath = async (filePath, diaryId) => {
    const query = `
        INSERT INTO Photos (file_path, created_at, diary_id)
        VALUES (?, NOW(), ?)
    `;
    const values = [filePath, diaryId];

    return new Promise((resolve, reject) => {
        db.query(query, values, (err, results) => {
            if (err) {
                reject(new Error("Error saving photo path"));
            } else {
                resolve(results.insertId);
            }
        });
    });
};

// 특정 diary_id에 연결된 모든 사진 조회
exports.getPhotosByDiaryId = async (diaryId) => {
    const query = `SELECT * FROM Photos WHERE diary_id = ?`;

    return new Promise((resolve, reject) => {
        db.query(query, [diaryId], (err, rows) => {
            if (err) {
                reject(new Error("Error fetching photos"));
            } else {
                resolve(rows);
            }
        });
    });
};

// 특정 diary_id에 연결된 모든 사진 삭제
exports.deletePhotosByDiaryId = async (diaryId) => {
    const query = `DELETE FROM Photos WHERE diary_id = ?`;

    return new Promise((resolve, reject) => {
        db.query(query, [diaryId], (err, results) => {
            if (err) {
                reject(new Error("Error deleting photos"));
            } else {
                resolve(results.affectedRows);
            }
        });
    });
};
