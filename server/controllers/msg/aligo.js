const aligoapi = require("aligoapi");
require("dotenv").config();

module.exports = async (req, res) => {
  try {
    let AuthData = {
      key: process.env.ALIGO_KEY,
      user_id: process.env.ALIGO_USERID,
    };
    // AuthData.testmode_yn = "Y"; // 테스트용

    const { receiver, msg } = req.body;

    const numberCheck = (receiver) => {
      let numReceiver = "";
      let numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
      for (let i = 0; i < receiver.length; i++) {
        if (numbers.includes(receiver[i])) {
          numReceiver += receiver[i];
        }
      }
      return numReceiver;
    };

    req.body = {
      sender: process.env.SENDER,
      receiver: numberCheck(receiver),
      msg,
    };

    if (!receiver) {
      res.send({
        statusCode: 400,
        message: "삐빅 문자발송에 실패하였습니다😅 handleTip을 확인해주세요",
        handleTip: "receiver 키와 값을 확인후, 다시 요청부탁드립니다👍",
      });
    } else if (!msg) {
      res.send({
        statusCode: 400,
        message: "삐빅 문자발송에 실패하였습니다😅 handleTip을 확인해주세요",
        handleTip: "msg 키와 값을 확인후, 다시 요청부탁드립니다👍",
      });
    } else {
      aligoapi
        .send(req, AuthData)
        .then(async (r) => {
          if (r.result_code === "1") {
            res.status(200).json({
              statusCode: 200,
              message: "짝짝짝 성공입니다! 알리고 문자 전송이 완료되었습니다🥳",
            });
          } else if (r.result_code !== "1") {
            res.status(200).json({
              statusCode: 400,
              message: "삐빅 문자발송에 실패하였습니다😅",
            });
          }
        })
        .catch(async (e) => {
          res.status(200).json({
            statusCode: 400,
            message: "삐빅 문자발송에 실패하였습니다😅",
          });
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
