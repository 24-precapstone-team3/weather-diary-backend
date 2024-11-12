const path = require('path');
const multer = require('multer');
const photoModel = require('../models/photo');

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
    (req, res) => {
        const { diary_id } = req.body;
        const file_path = req.file ? req.file.path : null;

        // diary_id가 없거나 파일이 업로드되지 않았을 때 에러 반환
        if (!diary_id) {
            return res.status(400).json({ error: "diary_id is required" });
        }
        if (!file_path) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // 모델을 통해 사진 경로 저장
        photoModel.savePhotoPath(file_path, diary_id, (err, photoId) => {
            if (err) {
                return res.status(500).json({ error: "Error saving photo path" });
            }
            res.status(201).json({ message: "Photo uploaded and path saved!", photo_id: photoId });
        });
    }
];

// 특정 diary_id에 연결된 모든 사진 조회
exports.getPhotosByDiaryId = (req, res) => {
    const { diary_id } = req.params;

    // 모델을 통해 사진 조회
    photoModel.getPhotosByDiaryId(diary_id, (err, photos) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching photos" });
        }
        if (photos.length === 0) {
            return res.status(404).json({ message: "No photos found for this diary" });
        }
        res.json(photos);
    });
};

// 특정 diary_id에 연결된 모든 사진 삭제
exports.deletePhotosByDiaryId = (req, res) => {
    const { diary_id } = req.params;

    // 모델을 통해 사진 삭제
    photoModel.deletePhotosByDiaryId(diary_id, (err, affectedRows) => {
        if (err) {
            return res.status(500).json({ error: "Error deleting photos" });
        }
        if (affectedRows === 0) {
            return res.status(404).json({ message: "No photos found to delete for this diary" });
        }
        res.status(200).json({ message: "All photos for this diary have been deleted" });
    });
};