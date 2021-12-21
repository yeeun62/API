const QRCode = require("qrcode");
const logFunc = require("../../func/log");
require("dotenv").config();

module.exports = async (req, res) => {
	try {
		let logSend = await logFunc("nodeQR", "nodeQR요청 로그입니다.", "-");

		try {
			QRCode.toDataURL(req.body.url, async function (err, url) {
				await logFunc("nodeQR", "nodeQR요청 성공로그입니다.", logSend.data.id);
				res.status(200).json({
					statusCode: 200,
					message: "짝짝짝 성공입니다! QR코드 생성이 완료되었습니다🥳",
					handleTip: "url을 이미지 태그에 넣어주세요👍",
					LogID: logSend.data.id,
					url: url,
				});
			});
		} catch (err) {
			await logFunc("nodeQR", "nodeQR요청 실패로그입니다.", logSend.data.id);
			res.status(200).json({
				statusCode: 400,
				message: "삐빅 QR코드 요청이 실패하였습니다😅 handleTip을 확인해주세요",
				handleTip: "url을 확인후, 다시 요청부탁드립니다👍",
			});
		}
	} catch (err) {
		console.log("node qr 29번", err);
		await logFunc("nodeQR", "nodeQR요청 실패로그입니다.", logSend.data.id);
		res.status(200).json({
			statusCode: 500,
			message: "삐빅 QR코드 요청이 실패하였습니다😅",
			error: "서버 에러입니다😅",
		});
	}
};
