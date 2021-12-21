const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// 외부 API
router.post("/msg/aligo", controller.aligo);
router.post("/msg/orange", controller.orange);
router.post("/qr/node", controller.qrNode);
router.post("/qr/google", controller.qrGoogle);
router.post("/short/naver", controller.shortNaver);
router.post("/short/ncloud", controller.shortNcloud);
router.post("/captcha/ncloud", controller.captchaNcloudCheck);
router.post("/ocr/kakao", upload.single("image"), controller.ocrKakao);
router.post("/translation/google", controller.translationGoogle);
router.post("/translation/kakao", controller.translationKakao);
router.post("/translation/papago", controller.translationPapago);
router.post("/language/papago", controller.languagePapago);
router.post("/language/kakao", controller.languageKakao);
router.get("/captcha/ncloud", controller.captchaNcloudImg);

// handle chat
router.post("/chat/create", controller.chat.create);
router.get("/chat/read/:id", controller.chat.read);

module.exports = router;
