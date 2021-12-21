require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
const logFunc = require("../../func/log");

module.exports = async (req, res) => {
	let logSend = await logFunc("captcha", "캡챠이미지요청 로그입니다.", "-");

	try {
		let key;
		const options = {
			headers: {
				"X-NCP-APIGW-API-KEY-ID": `${process.env.NCLOUD_CAPTCHA_CLIENT_ID}`,
				"X-NCP-APIGW-API-KEY": `${process.env.NCLOUD_CAPTCHA_CLIENT_SECRET}`,
			},
		};
		let getKey = await axios.get(
			"https://naveropenapi.apigw.ntruss.com/captcha/v1/nkey?code=0",
			options
		);
		key = getKey.data.key;
		let captchaImg = `https://naveropenapi.apigw.ntruss.com/captcha-bin/v1/ncaptcha?key=${key}&X-NCP-APIGW-API-KEY-ID=${process.env.NCLOUD_CAPTCHA_CLIENT_ID}`;
		await logFunc("captcha", "캡챠이미지요청 성공로그입니다.", logSend.data.id);
		res.status(200).json({
			statusCode: 200,
			message: "짝짝짝 성공입니다! 캡챠 이미지 발급이 완료되었습니다🥳",
			handleTip:
				"captchaImg를 img태그에 넣어주세요! key는 /captcha/check 요청(캡챠이미지 텍스트와 입력값 확인)에서 필요합니다!",
			captchaImg: captchaImg,
			key: key,
			LogID: logSend.data.id,
		});
	} catch (err) {
		await logFunc("captcha", "캡챠이미지요청 실패로그입니다.", logSend.data.id);
		res.status(200).json({
			statusCode: 500,
			message: "캡챠 이미지요청에 실패하였습니다😅",
			error: "서버 에러입니다😅",
		});
	}
};
