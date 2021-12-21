const { TranslationServiceClient } = require("@google-cloud/translate");
const translationClient = new TranslationServiceClient();
const logFunc = require("../../func/log");
const { Storage } = require("@google-cloud/storage");
require("dotenv").config();
// const GOOGLE_APPLICATION_CREDENTIALS = require("/home/ubuntu/plated-valor-331804-15b8850fd169.json")
// export GOOGLE_APPLICATION_CREDENTIALS="/home/ubuntu/plated-valor-331804-15b8850fd169.json"

module.exports = async (req, res) => {
	try {
		let logSend = await logFunc(
			"gTranslation",
			"구글번역 요청 로그입니다.",
			"-"
		);
		try {
			// 인증
			const projectId = process.env.GOOGLE_PROJECT_ID;
			//const keyFilename = "/home/ubuntu/plated-valor-331804-15b8850fd169.json";
			const keyFilename =
				"/Users/bang-yeeun/Downloads/handleAPIKey/plated-valor-331804-15b8850fd169.json";
			const storage = new Storage({ projectId, keyFilename });

			async function listBuckets() {
				try {
					const [buckets] = await storage.getBuckets();
					buckets.forEach((bucket) => {});
				} catch (err) {
					console.error("인증에러", err);
				}
			}
			listBuckets();

			const request = {
				parent: `projects/${process.env.GOOGLE_PROJECT_ID}/locations/global`,
				contents: [req.body.text],
				mimeType: "text/plain",
				sourceLanguageCode: req.body.source,
				targetLanguageCode: req.body.lang,
			};
			const [response] = await translationClient.translateText(request);
			let result;
			for (const translation of response.translations) {
				result = translation.translatedText;
			}
			await logFunc(
				"gTranslation",
				"구글번역 요청 성공로그입니다.",
				logSend.data.id
			);
			res.status(200).json({
				statusCode: 200,
				message: "짝짝짝 성공입니다! 구글번역이 완료되었습니다🥳",
				data: result,
				LogID: logSend.data.id,
			});
		} catch (err) {
			console.log("!!!", err);
			await logFunc(
				"gTranslation",
				"구글번역 요청 실패로그입니다.",
				logSend.data.id
			);
			res.status(200).json({
				statusCode: 400,
				message: "삐빅 구글번역을 실패하였습니다😅 handleTip을 확인해주세요",
				handleTip:
					"lang(목적언어), text(번역할텍스트)를 확인후, 다시 요청부탁드립니다👍 참고링크: 'https://cloud.google.com/translate/docs/languages?hl=ko'",
			});
		}
	} catch (err) {
		console.log("구글번역 72번", err);
		await logFunc(
			"gTranslation",
			"구글번역 요청 실패로그입니다.",
			logSend.data.id
		);
		res.status(200).json({
			statusCode: 500,
			message: "삐빅 구글번역 요청이 실패하였습니다😅",
			error: "서버 에러입니다😅",
		});
	}
};
