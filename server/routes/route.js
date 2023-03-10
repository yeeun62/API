const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// 외부 API
router.post("/msg/aligo", controller.aligo);
router.post("/talk/aligo", controller.aligoTalk);
router.post("/qr/node", controller.qrNode);
router.post("/qr/google", controller.qrGoogle);
router.post("/short/naver", controller.shortNaver);
router.post("/short/ncloud", controller.shortNcloud);
router.post("/captcha/ncloud", controller.captchaNcloudCheck);
router.get("/captcha/ncloud", controller.captchaNcloudImg);
router.post("/ocr/kakao", upload.single("image"), controller.ocrKakao);
router.post("/translation/google", controller.translationGoogle);
router.post("/translation/kakao", controller.translationKakao);
router.post("/translation/papago", controller.translationPapago);
router.post("/language/papago", controller.languagePapago);
router.post("/language/kakao", controller.languageKakao);
router.post("/drive", controller.drive);

// handle navi
router.post("/navi", controller.navi.navi);
router.post("/navi/position", controller.navi.position);
router.post("/navi/coord", controller.navi.coord);

// handle page
router.post("/page/find", controller.page.findCanvas);
router.post("/page/create", controller.page.postCanvas);
router.put("/page/update", controller.page.updateCanvas);
router.get("/page/pixabay", controller.page.getPixabay);
router.get("/page/searchPix", controller.page.searchPixabay);

// handle chat //! 안쓰는 부분
router.post("/chat/create", controller.chat.create);
router.get("/chat/:code", controller.chat.read);
router.post("/chat/invite/:code", controller.chat.invite);
router.post("/chat/send/:code", controller.chat.send);
router.get("/uuid", controller.chat.uuid);

module.exports = router;
