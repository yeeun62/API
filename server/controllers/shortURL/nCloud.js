const axios = require("axios");
const logFunc = require("../../func/log");
require("dotenv").config();

module.exports = async (req, res) => {
	try {
		const { url } = req.body;
		let logSend = await logFunc(
			"ncShortURL",
			"ncShortURL요청 로그입니다.",
			"-"
		);

		try {
			const option = {
				headers: {
					"X-NCP-APIGW-API-KEY-ID": `${process.env.NCLOUD_URL_API_KEY_ID}`,
					"X-NCP-APIGW-API-KEY": `${process.env.NCLOUD_URL_API_KEY}`,
					"Content-Type": "application/json",
				},
				withCredentials: true,
			};
			let shortUrl = await axios.post(
				`https://naveropenapi.apigw.ntruss.com/util/v1/shorturl`,
				{ url },
				option
			);
			await logFunc(
				"ncShortURL",
				"ncShortURL요청 성공로그입니다.",
				logSend.data.id
			);
			res.status(200).json({
				statusCode: 200,
				message: "짝짝짝 성공입니다! shortURL 생성이 완료되었습니다🥳",
				LogID: logSend.data.id,
				url: shortUrl.data.result.url,
			});
		} catch (err) {
			await logFunc(
				"ncShortURL",
				"ncShortURL요청 성공로그입니다.",
				logSend.data.id
			);
			res.status(200).json({
				statusCode: 400,
				message:
					"삐빅 shortURL 생성에 실패하였습니다😅 handleTip을 확인해주세요",
				handleTip: "url을 확인후, 다시 요청부탁드립니다👍",
			});
		}
	} catch (err) {
		console.log("ncshortURL 48번 에러", err);
		await logFunc(
			"ncShortURL",
			"ncShortURL요청 실패로그입니다.",
			logSend.data.id
		);
		res.status(200).json({
			statusCode: 500,
			message: "삐빅 shortURL 생성에 실패하였습니다😅",
			error: "서버 에러입니다😅",
		});
	}
};
