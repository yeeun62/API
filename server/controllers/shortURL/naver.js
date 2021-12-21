require("dotenv").config();
const request = require("request");
const logFunc = require("../../func/log");

module.exports = async (req, res) => {
	let logSend = await logFunc("nshortURL", "nshortURL요청 로그입니다.", "-");

	try {
		let options = {
			url: "https://openapi.naver.com/v1/util/shorturl",
			form: { url: encodeURI(req.body.url) },
			headers: {
				"X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
				"X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
			},
		};

		request.post(options, async function (error, response, body) {
			if (!error && response.statusCode == 200) {
				await logFunc(
					"nshortURL",
					"nshortURL요청 성공로그입니다.",
					logSend.data.id
				);
				let result = JSON.parse(body);
				res.status(200).json({
					statusCode: 200,
					message: "짝짝짝 성공입니다! shortURL 생성이 완료되었습니다🥳",
					LogID: logSend.data.id,
					url: result.result.url,
				});
			} else {
				await logFunc(
					"nshortURL",
					"nshortURL요청 성공로그입니다.",
					logSend.data.id
				);
				res.status(200).json({
					statusCode: response.statusCode,
					message:
						"삐빅 shortURL 생성에 실패하였습니다😅 handleTip을 확인해주세요",
					handleTip: "url을 확인후, 다시 요청부탁드립니다👍",
				});
			}
		});
	} catch (err) {
		console.log("네이버 단축 url 48번 에러", err);
		await logFunc(
			"nshortURL",
			"nshortURL요청 실패로그입니다.",
			logSend.data.id
		);
		res.status(200).json({
			statusCode: 500,
			message: "삐빅 shortURL 생성에 실패하였습니다😅",
			error: "서버 에러입니다😅",
		});
	}
};
