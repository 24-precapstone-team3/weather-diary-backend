const path = require('path');
const multer = require('multer');
const photoModel = require('../models/photo');
const diaryModel = require('../models/Diary'); // Diary 관련 모델 추가

// 파일 저장 경로 및 파일명 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/photos'); // 파일이 저장될 폴더 경로
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // 고유 파일명 생성
    }
});

// multer 미들웨어 설정
const upload = multer({ storage: storage });

// 사진 파일 저장 및 경로 기록
exports.uploadPhoto = [
    upload.single('photo'), // 'photo'는 프론트에서 보낸 파일의 필드명
    async (req, res) => {
        const firebase_uid = req.headers['firebase-uid']; // 헤더에서 firebase_uid 추출
        const { diary_id } = req.body;
        const file_path = req.file ? req.file.path : null;

        if (!firebase_uid || !diary_id || !file_path) {
            return res.status(400).json({ error: "firebase_uid, diary_id, 파일 경로가 필요합니다." });
        }

        try {
            // diary_id가 firebase_uid에 속하는지 확인
            const isOwner = await diaryModel.verifyDiaryOwner(firebase_uid, diary_id);
            if (!isOwner) {
                return res.status(403).json({ error: "Unauthorized: You do not own this diary." });
            }

            // 모델을 통해 사진 경로 저장
            const photoId = await photoModel.savePhotoPath(file_path, diary_id);
            res.status(201).json({ message: "Photo uploaded and path saved!", photo_id: photoId });
        } catch (err) {
            return res.status(500).json({ error: err.message || "Error saving photo path" });
        }
    }
];

// 특정 diary_id에 연결된 모든 사진 조회
exports.getPhotosByDiaryId = async (req, res) => {
    const firebase_uid = req.headers['firebase-uid']; // 헤더에서 firebase_uid 추출
    const { diary_id } = req.params;

    if (!firebase_uid || !diary_id) {
        return res.status(400).json({ error: "firebase_uid와 diary_id가 필요합니다." });
    }

    try {
        // diary_id가 firebase_uid에 속하는지 확인
        const isOwner = await diaryModel.verifyDiaryOwner(firebase_uid, diary_id);
        if (!isOwner) {
            return res.status(403).json({ error: "Unauthorized: You do not own this diary." });
        }

        // 모델을 통해 사진 조회
        const photos = await photoModel.getPhotosByDiaryId(diary_id);
        if (photos.length === 0) {
            return res.status(404).json({ message: "No photos found for this diary" });
        }
        res.json(photos);
    } catch (err) {
        return res.status(500).json({ error: err.message || "Error fetching photos" });
    }
};

// 특정 diary_id에 연결된 모든 사진 삭제
exports.deletePhotosByDiaryId = async (req, res) => {
    const firebase_uid = req.headers['firebase-uid']; // 헤더에서 firebase_uid 추출
    const { diary_id } = req.params;

    if (!firebase_uid || !diary_id) {
        return res.status(400).json({ error: "firebase_uid와 diary_id가 필요합니다." });
    }

    try {
        // diary_id가 firebase_uid에 속하는지 확인
        const isOwner = await diaryModel.verifyDiaryOwner(firebase_uid, diary_id);
        if (!isOwner) {
            return res.status(403).json({ error: "Unauthorized: You do not own this diary." });
        }

        // 모델을 통해 사진 삭제
        const affectedRows = await photoModel.deletePhotosByDiaryId(diary_id);
        if (affectedRows === 0) {
            return res.status(404).json({ message: "No photos found to delete for this diary." });
        }
        res.status(200).json({ message: "All photos for this diary have been deleted" });
    } catch (err) {
        return res.status(500).json({ error: err.message || "Error deleting photos" });
    }
};
