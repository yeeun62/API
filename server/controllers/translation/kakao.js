const axios = require("axios");
const logFunc = require("../../func/log");
require("dotenv").config();

module.exports = async (req, res) => {
	try {
		const params = new URLSearchParams();
		params.append("query", req.body.text);
		params.append("src_lang", req.body.source);
		params.append("target_lang", req.body.lang);

		let logSend = await logFunc(
			"kTranslation",
			"카카오번역 요청 로그입니다.",
			"-"
		);

		try {
			let translation = await axios.post(
				"https://dapi.kakao.com/v2/translation/translate",
				params,
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Authorization: `KakaoAK ${process.env.KAKAO_AK}`,
					},
				}
			);
			await logFunc(
				"kTranslation",
				"카카오번역 요청 성공로그입니다.",
				logSend.data.id
			);
			res.status(200).json({
				statusCode: 200,
				message: "짝짝짝 성공입니다! 카카오번역이 완료되었습니다🥳",
				data: translation.data.translated_text[0][0],
				LogID: logSend.data.id,
			});
		} catch (err) {
			await logFunc(
				"kTranslation",
				"카카오번역 요청 실패로그입니다.",
				logSend.data.id
			);
			res.status(200).json({
				statusCode: 400,
				message: "삐빅 카카오번역을 실패하였습니다😅 handleTip을 확인해주세요",
				handleTip:
					"source(원본언어), lang(목적언어), text(번역할텍스트)를 확인후, 다시 요청부탁드립니다👍 참고링크: 'https://developers.kakao.com/docs/latest/ko/translate/common'",
			});
		}
	} catch (err) {
		console.log("카카오번역 54번", err);
		await logFunc(
			"kTranslation",
			"카카오번역 요청 실패로그입니다.",
			logSend.data.id
		);
		res.status(200).json({
			statusCode: 500,
			message: "삐빅 문자발송에 실패하였습니다😅",
			error: "서버 에러입니다😅",
		});
	}
};
