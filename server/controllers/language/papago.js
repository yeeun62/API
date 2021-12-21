const request = require("request");
const logFunc = require("../../func/log");
require("dotenv").config();

module.exports = async (req, res) => {
	try {
		let logSend = await logFunc(
			"Lpapago",
			"파파고언어감지 요청 로그입니다.",
			"-"
		);
		try {
			let options = {
				url: "https://openapi.naver.com/v1/papago/detectLangs",
				form: { query: req.body.text },
				headers: {
					"X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
					"X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
				},
			};
			request.post(options, async function (error, response, body) {
				if (!error && response.statusCode == 200) {
					await logFunc(
						"Lpapago",
						"파파고언어감지 요청 성공로그입니다.",
						logSend.data.id
					);
					res.status(200).json({
						statusCode: 200,
						message: "짝짝짝 성공입니다! 파파고 언어감지가 완료되었습니다🥳",
						language: JSON.parse(body).langCode,
						LogID: logSend.data.id,
					});
				} else {
					await logFunc(
						"Lpapago",
						"파파고언어감지 요청 실패로그입니다.",
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
				"Lpapago",
				"파파고언어감지 요청 실패로그입니다.",
				logSend.data.id
			);
			res.status(200).json({
				statusCode: 400,
				message: "삐빅 언어감지에 실패하였습니다😅",
			});
		}
	} catch (err) {
		console.log("파파고언어감지 45번 에러", err);
		await logFunc(
			"Lpapago",
			"파파고언어감지 요청 실패로그입니다.",
			logSend.data.id
		);
		res.status(200).json({
			statusCode: 500,
			message: "삐빅 언어감지에 실패하였습니다😅",
			error: "서버 에러입니다😅",
		});
	}
};
