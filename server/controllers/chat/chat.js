const {
  getDatabase,
  set,
  ref,
  onValue,
  push,
  update,
} = require("firebase/database");
const config = require("./config");
const axios = require("axios");

//! 사용하고 있지 않습니다.

module.exports = {
  //! 채팅방 생성
  create: async (req, res) => {
    const { siteName, roomTitle, userName, userPhoneNumber, userId } = req.body;

    const db = getDatabase();
    const dbRef = ref(db, "chat");
    const newdbRef = push(dbRef);
    const chatId = newdbRef._path;

    const member = ref(db, `${chatId}/member`);
    const memberRef = push(member);

    const uuid = await axios.get(process.env.UUID, {
      headers: {
        "HANDLE-API-KEY": process.env.HANDLE_API_KEY,
      },
    });
    const time = Date.parse(new Date().toLocaleString()) / 1000;

    let chat = {
      room: { title: roomTitle, siteCode: uuid.data.data.uuid, regDate: time },
      site: { name: siteName, color: "#E0DE1B", code: uuid.data.data.uuid },
    };

    set(newdbRef, chat);
    set(memberRef, { userName, userPhoneNumber, userId });

    res
      .cookie("sender", userName, {
        httpOnly: true,
        secure: true,
      })
      .status(200)
      .json({
        message: "짝짝짝 성공입니다! 채팅방 생성이 완료되었습니다🥳",
        code: uuid.data.data.uuid,
        member: { name: userName, phoneNumber: userPhoneNumber, id: userId },
        room: { title: roomTitle, time: time },
      });
  },

  //! 채팅방 초대
  invite: async (req, res) => {
    const code = req.params.code;
    const { userName, userPhoneNumber, userId } = req.body;

    const db = getDatabase();
    const dbRef = ref(db, "chat");

    onValue(
      dbRef,
      async (snapshot) => {
        let data = snapshot.val();
        for (let el in data) {
          if (data[el].site.code === code) {
            const member = ref(db, `chat/${el}/member`);
            const memberRef = push(member);
            update(memberRef, { userName, userPhoneNumber, userId });
            break;
          }
        }
      },
      {
        onlyOnce: true,
      }
    );
    res
      .cookie("sender", userName, { httpOnly: true })
      .status(200)
      .json({ message: "짝짝짝 성공입니다! 채팅방 초대에 성공하였습니다🥳" });
  },

  //! 채팅 보내기
  send: async (req, res) => {
    const { message, read, sender } = req.body;
    const code = req.params.code;

    const db = getDatabase();
    const dbRef = ref(db, "chat");

    const time = Date.parse(new Date().toLocaleString()) / 1000;
    let msg = { message, read, sender, time };

    onValue(
      dbRef,
      async (snapshot) => {
        let data = snapshot.val();
        for (let el in data) {
          if (data[el].site.code === code) {
            const send = ref(db, `chat/${el}/send/${time}`);
            set(send, msg);
          }
        }
      },
      {
        onlyOnce: true,
      }
    );
  },

  //! 채팅방 조회
  read: async (req, res) => {
    const code = req.params.code;

    const db = getDatabase();
    const dbRef = ref(db, "chat");

    onValue(
      dbRef,
      (snapshot) => {
        let chatData;
        const data = snapshot.val();
        for (let el in data) {
          if (data[el].site.code === code) {
            chatData = data[el];
            break;
          }
        }
        res.status(200).json({
          message: "짝짝짝 성공입니다! 채팅방 정보 요청에 성공하였습니다🥳",
          chatData: chatData,
        });
      },
      {
        onlyOnce: true,
      }
    );
  },

  uuid: async (req, res) => {
    const uuid = await axios.get(process.env.UUID, {
      headers: {
        "HANDLE-API-KEY": process.env.HANDLE_API_KEY,
      },
    });
    res.status(200).json({ code: uuid.data.data.uuid });
  },
};
