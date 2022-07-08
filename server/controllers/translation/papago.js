const axios = require("axios");
require("dotenv").config();

module.exports = async (req, res) => {
  try {
    let client_id = process.env.NAVER_CLIENT_ID;
    let client_secret = process.env.NAVER_CLIENT_SECRET;

    const success = (source, target) => {
      if (source === "ja") {
        if (
          target === "de" ||
          target === "ru" ||
          target === "es" ||
          target === "it"
        ) {
          return false;
        }
      } else if (
        source === "zh-CN" ||
        source === "zh-TW" ||
        source === "vi" ||
        source === "th" ||
        source === "fr"
      ) {
        if (target !== "ko" || target !== "en" || target !== "ja") {
          return false;
        }
      } else if (
        source === "id" ||
        source === "de" ||
        source === "ru" ||
        source === "es" ||
        source === "it"
      ) {
        if (target !== "ko" || target !== "en") {
          return false;
        }
      }
      return true;
    };

    if (success(req.body.source, req.body.lang)) {
      const params = new URLSearchParams();
      params.append("source", req.body.source);
      params.append("target", req.body.lang);
      params.append("text", req.body.text);

      try {
        let translation = await axios.post(
          "https://openapi.naver.com/v1/papago/n2mt",
          params,
          {
            headers: {
              "X-Naver-Client-Id": client_id,
              "X-Naver-Client-Secret": client_secret,
            },
          }
        );
        res.status(200).json({
          statusCode: 200,
          message: "짝짝짝 성공입니다! 파파고번역이 완료되었습니다🥳",
          data: translation.data.message.result.translatedText,
        });
      } catch (err) {
        res.status(200).json({
          statusCode: 400,
          message:
            "삐빅 파파고번역을 실패하였습니다😅 handleTip을 확인해주세요",
          handleTip:
            "source(원본언어), lang(목적언어), text(번역할텍스트)를 확인후, 다시 요청부탁드립니다👍",
        });
      }
    } else {
      res.status(200).json({ message: "not translation" });
    }
  } catch (err) {
    res.status(200).json({
      statusCode: 500,
      message: "삐빅 문자발송에 실패하였습니다😅",
      error: "서버 에러입니다😅",
    });
  }
};
