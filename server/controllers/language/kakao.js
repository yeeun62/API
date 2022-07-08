const request = require("request");
require("dotenv").config();

module.exports = async (req, res) => {
  try {
    let options = {
      url: "https://dapi.kakao.com/v3/translation/language/detect",
      form: { query: req.body.text },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
      },
    };
    request.post(options, async function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.status(200).json({
          statusCode: 200,
          message: "짝짝짝 성공입니다! 카카오 언어감지가 완료되었습니다🥳",
          language: JSON.parse(body).language_info[0].code,
        });
      } else {
        res.status(200).json({
          statusCode: response.statusCode,
          message: "삐빅 언어감지에 실패하였습니다😅",
        });
      }
    });
  } catch (err) {
    res.status(200).json({
      statusCode: 400,
      message: "삐빅 언어감지에 실패하였습니다😅",
    });
  }
};
