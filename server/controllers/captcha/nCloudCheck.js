require("dotenv").config();
const axios = require("axios");
const logFunc = require("../../func/log");

module.exports = async (req, res) => {
	let logSend = await logFunc("captcha", "캡챠결과요청 로그입니다.", "-");

	try {
		try {
			let options = {
				headers: {
					"X-NCP-APIGW-API-KEY-ID": `${process.env.NCLOUD_CAPTCHA_CLIENT_ID}`,
					"X-NCP-APIGW-API-KEY": `${process.env.NCLOUD_CAPTCHA_CLIENT_SECRET}`,
				},
			};
			let check = await axios.get(
				`https://naveropenapi.apigw.ntruss.com/captcha/v1/nkey?code=1&key=${req.body.key}&value=${req.body.value}`,
				options
			);
			if (check.data.result) {
				await logFunc(
					"captcha",
					"캡챠결과요청 성공로그입니다.",
					logSend.data.id
				);
				res.status(200).json({
					statusCode: 200,
					message:
						"짝짝짝 성공입니다! 캡챠이미지 텍스트와 결과값이 일치합니다🥳",
					LogID: logSend.data.id,
				});
			}
		} catch (err) {
			if (!err.response.data.result) {
				await logFunc(
					"captcha",
					"캡챠결과요청 성공로그입니다.",
					logSend.data.id
				);
				res.status(200).json({
					statusCode: 200,
					message: "캡챠이미지 텍스트와 결과값이 일치하지 않습니다😅",
					LogID: logSend.data.id,
				});
			} else {
				await logFunc(
					"captcha",
					"캡챠결과요청 실패로그입니다.",
					logSend.data.id
				);
				res.status(200).json({
					statusCode: 400,
					message: "캡챠 결과요청에 실패하였습니다😅",
				});
			}
		}
	} catch (err) {
		await logFunc("captcha", "캡챠결과요청 실패로그입니다.", logSend.data.id);
		res.status(200).json({
			statusCode: 500,
			message: "캡챠 결과요청에 실패하였습니다😅",
			error: "서버 에러입니다😅",
		});
	}
};
