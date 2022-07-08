const aligoapi = require("aligoapi");
require("dotenv").config();

//! 사용하지 않음

module.exports = async (req, res) => {
  // const { receiver, template, message, date } = req.body;

  const AuthData = {
    apikey: process.env.ALIGO_KEY,
    userid: process.env.ALIGO_USERID,
  };

  let message = `안녕하세요 #{피드백명}님

	고객님께서 #{사용자아이디} 님께 요청한 내용에 대한 처리가 완료 되었습니다.
	
	아래의 주소에서 피드백 내용 확인 가능합니다.
	
	https://handle.im/f/#{요청번호}`;

  req.body = {
    token: process.env.ALIGO_TOKEN,
    senderkey: process.env.ALIGO_SENDER_KEY,
    sender: process.env.SENDER,
    receiver_1: "",
    tpl_code: "TA_8614",
    subject_1: "알림톡입니다",
    message_1: message,
    button: JSON.stringify({
      name: "나의 handle 주소",
      linkType: "WL",
      linkTypeName: "웹링크",
      linkP: "https://handle.im/my/#{고객아이디}",
      linkM: "https://handle.im/my/#{고객아이디}",
    }),
  };

  // req.body = {
  // 	token: process.env.ALIGO_TOKEN,
  // 	senderkey: process.env.ALIGO_SENDER_KEY,
  // 	sender: process.env.SENDER,
  // 	receiver_1: receiver,
  // 	tpl_code: template,
  // 	subject_1: "알림톡입니다",
  // 	message_1: message,
  // 	senddate: date,
  // };

  aligoapi
    .alimtalkSend(req, AuthData)
    .then((r) => {
      console.log(r);
      res.send(r);
    })
    .catch((e) => {
      res.send(e);
    });
};
