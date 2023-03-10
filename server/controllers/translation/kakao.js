const axios = require("axios");
require("dotenv").config();

module.exports = async (req, res) => {
  const { text, source, lang } = req.body;

  try {
    const params = new URLSearchParams();
    params.append("target_lang", req.body.lang);
    params.append("src_lang", req.body.source);

    try {
      if (Array.isArray(text)) {
        if (text && source && lang) {
          try {
            let result = [];
            for (let txt of req.body.text) {
              params.append("query", txt);
              let translation = await axios.post(
                "https://dapi.kakao.com/v2/translation/translate",
                params,
                {
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
                  },
                }
              );
              result.push(translation.data.translated_text[0][0]);
              params.delete("query");
            }
            res.status(200).json({ data: result });
          } catch (err) {
            console.log("카카오 번역에러", err);
          }
        } else {
          return;
        }
      } else {
        params.append("query", req.body.text);
        let translation = await axios.post(
          "https://dapi.kakao.com/v2/translation/translate",
          params,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
            },
          }
        );
        res.status(200).json({
          statusCode: 200,
          message: "짝짝짝 성공입니다! 카카오번역이 완료되었습니다🥳",
          data: translation.data.translated_text[0][0],
        });
      }
    } catch (err) {
      res.status(200).json({
        statusCode: 400,
        message: "삐빅 카카오번역을 실패하였습니다😅 handleTip을 확인해주세요",
        handleTip:
          "source(원본언어), lang(목적언어), text(번역할텍스트)를 확인후, 다시 요청부탁드립니다👍",
      });
    }
  } catch (err) {
    res.status(200).json({
      statusCode: 500,
      message: "삐빅 문자발송에 실패하였습니다😅",
      error: "서버 에러입니다😅",
    });
  }
};
