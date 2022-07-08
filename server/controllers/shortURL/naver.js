require("dotenv").config();
const request = require("request");

module.exports = async (req, res) => {
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
        let result = JSON.parse(body);
        res.status(200).json({
          statusCode: 200,
          message: "짝짝짝 성공입니다! shortURL 생성이 완료되었습니다🥳",
          url: result.result.url,
        });
      } else {
        res.status(200).json({
          statusCode: response.statusCode,
          message:
            "삐빅 shortURL 생성에 실패하였습니다😅 handleTip을 확인해주세요",
          handleTip: "url을 확인후, 다시 요청부탁드립니다👍",
        });
      }
    });
  } catch (err) {
    res.status(200).json({
      statusCode: 500,
      message: "삐빅 shortURL 생성에 실패하였습니다😅",
      error: "서버 에러입니다😅",
    });
  }
};
