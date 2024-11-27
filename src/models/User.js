// models/user.js
const db = require('../config/db');  // MySQL 연결 모듈

// Firebase UID로 사용자 조회
const findUserByFirebaseUID = (firebase_uid) => {
    return db.promise().query('SELECT * FROM Users WHERE firebase_uid = ?', [firebase_uid]);
};

// 새 사용자 등록
const createUser = (firebase_uid) => {
    return db.promise().query('INSERT INTO Users (firebase_uid) VALUES (?)', [firebase_uid]);
};

// 사용자 삭제
const deleteUser = (firebase_uid) => {
    return db.promise().query('DELETE FROM Users WHERE firebase_uid = ?', [firebase_uid]);
};
// 모든 사용자 조회
const getAllUsers = async () => {
    const query = 'SELECT * FROM Users';  // 모든 사용자 조회 쿼리
    const [results] = await db.promise().query(query);  // [rows, fields] 구조로 반환됨
    return results;
}
module.exports = { 
    findUserByFirebaseUID,    
    createUser, 
    deleteUser ,
    getAllUsers
};