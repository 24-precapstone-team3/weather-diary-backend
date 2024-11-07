// models/user.js
const db = require('../db/db');  // MySQL 연결 모듈

// Firebase UID로 사용자 조회
const findUserByFirebaseUID = (firebase_uid) => {
    return db.promise().query('SELECT * FROM Users WHERE firebase_uid = ?', [firebase_uid]);
};

// 새 사용자 등록
const createUser = (firebase_uid) => {
    return db.promise().query('INSERT INTO Users (firebase_uid) VALUES (?)', [firebase_uid]);
};

// 사용자 정보 조회
const getUserInfo = (firebase_uid) => {
    return db.promise().query('SELECT firebase_uid FROM Users WHERE firebase_uid = ?', [firebase_uid]);
};

// 사용자 삭제
const deleteUser = (firebase_uid) => {
    return db.promise().query('DELETE FROM Users WHERE firebase_uid = ?', [firebase_uid]);
};

module.exports = { 
    findUserByFirebaseUID, 
    createUser, 
    getUserInfo, 
    deleteUser 
};