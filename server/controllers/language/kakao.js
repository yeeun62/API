const request = require("request");
const logFunc = require("../../func/log");
require("dotenv").config();

module.exports = async (req, res) => {
	try {
		let logSend = await logFunc(
			"Lkakao",
			"카카오언어감지 요청 로그입니다.",
			"-"
		);
		try {
			let options = {
				url: "https://dapi.kakao.com/v3/translation/language/detect",
				form: { query: req.body.text },
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Authorization: `KakaoAK ${process.env.KAKAO_AK}`,
				},
			};
			request.post(options, async function (error, response, body) {
				if (!error && response.statusCode == 200) {
					await logFunc(
						"Lkakao",
						"카카오언어감지 요청 성공로그입니다.",
						logSend.data.id
					);
					res.status(200).json({
						statusCode: 200,
						message: "짝짝짝 성공입니다! 카카오 언어감지가 완료되었습니다🥳",
						language: JSON.parse(body).language_info[0].code,
						LogID: logSend.data.id,
					});
				} else {
					await logFunc(
						"Lkakao",
						"카카오언어감지 요청 실패로그입니다.",
						logSend.data.id
					);
					res.status(200).json({
						statusCode: response.statusCode,
						message: "삐빅 언어감지에 실패하였습니다😅",
					});
				}
			});
		} catch (err) {
			await logFunc(
				"Lkakao",
				"카카오언어감지 요청 실패로그입니다.",
				logSend.data.id
			);
			res.status(200).json({
				statusCode: 400,
				message: "삐빅 언어감지에 실패하였습니다😅",
			});
		}
	} catch (err) {
		console.log("카카오언어감지 47번 에러", err);
		await logFunc(
			"Lkakao",
			"카카오언어감지 요청 실패로그입니다.",
			logSend.data.id
		);
		res.status(200).json({
			statusCode: 500,
			message: "삐빅 언어감지에 실패하였습니다😅",
			error: "서버 에러입니다😅",
		});
	}
};
