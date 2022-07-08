const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const data = new FormData();
require("dotenv").config();

module.exports = async (req, res) => {
  try {
    data.append(
      "image",
      fs.createReadStream(`./${req.file.destination + req.file.filename}`)
    );

    const config = {
      method: "post",
      url: "https://dapi.kakao.com/v2/vision/text/ocr",
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        ...data.getHeaders(),
      },
      data: data,
    };

    axios(config)
      .then(async function (response) {
        res.status(200).json({
          statusCode: 200,
          message: "짝짝짝 성공입니다! OCR 요청에 성공하였습니다🥳",
          data: response.data.result,
        });
      })
      .catch(async function (error) {
        res.status(200).json({
          statusCode: 500,
          message: "OCR 요청에 실패하였습니다😅",
        });
      });
  } catch (err) {
    res.status(200).json({
      statusCode: 500,
      message: "삐빅 ocr요청에 실패하였습니다😅",
      error: "서버 에러입니다😅",
    });
  }
};
