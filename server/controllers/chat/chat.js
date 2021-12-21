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

		res.status(200).json({
			message: "짝짝짝 성공입니다! 채팅방 생성이 완료되었습니다🥳",
			code: uuid.data.data.uuid,
			member: { name: userName, phoneNumber: userPhoneNumber, id: userId },
			room: { title: roomTitle, time: time },
		});
	},

	//! 채팅방 조회
	read: async (req, res) => {
		const db = getDatabase();
		const dbRef = ref(db, "chat");
		const newdbRef = push(dbRef);
		const handleId = newdbRef._path;

		onValue(dbRef, (snapshot) => {
			const data = snapshot.val();
			console.log("!!", data);
			//set(newdbRef, test);
		});
	},

	//! 채팅방 초대
	invite: async (req, res) => {
		//update(member, { b: "b" });
	},
};
