require("dotenv").config();
const axios = require("axios");

module.exports = async (req, res) => {
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
      res.status(200).json({
        statusCode: 200,
        message: "짝짝짝 성공입니다! 캡챠이미지 텍스트와 결과값이 일치합니다🥳",
      });
    }
  } catch (err) {
    if (!err.response.data.result) {
      res.status(200).json({
        statusCode: 200,
        message: "캡챠이미지 텍스트와 결과값이 일치하지 않습니다😅",
      });
    } else {
      res.status(200).json({
        statusCode: 400,
        message: "캡챠 결과요청에 실패하였습니다😅",
      });
    }
  }
};
