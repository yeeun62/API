const axios = require("axios");
require("dotenv").config();

module.exports = async (req, res) => {
  try {
    const { url } = req.body;

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
    res.status(200).json({
      statusCode: 200,
      message: "짝짝짝 성공입니다! shortURL 생성이 완료되었습니다🥳",
      url: shortUrl.data.result.url,
    });
  } catch (err) {
    res.status(200).json({
      statusCode: 400,
      message: "삐빅 shortURL 생성에 실패하였습니다😅 handleTip을 확인해주세요",
      handleTip: "url을 확인후, 다시 요청부탁드립니다👍",
    });
  }
};
