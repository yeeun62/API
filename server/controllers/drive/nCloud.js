const axios = require("axios");
require("dotenv").config();

module.exports = async (req, res) => {
	try {
		const { start, goal, option } = req.body;
		let drive = await axios.get(
			`https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start=${start}&goal=${goal}&option=${option}`,
			{
				headers: {
					"X-NCP-APIGW-API-KEY-ID": process.env.NCLOUD_DRIVE_CLIENT_ID,
					"X-NCP-APIGW-API-KEY": process.env.NCLOUD_DRIVE_CLIENT_SECRET,
				},
			}
		);

		function msToTime(duration) {
			let seconds = parseInt((duration / 1000) % 60),
				minutes = parseInt((duration / (1000 * 60)) % 60),
				hours = parseInt((duration / (1000 * 60 * 60)) % 24);

			hours = hours < 10 ? "0" + hours : hours;
			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;

			return `${hours}시간 ${minutes}분 ${seconds}초`;
		}

		res.status(200).json({
			message: drive.data.message,
			data: {
				거리: `${drive.data.route.traoptimal[0].summary.distance / 1000}km`,
				시간: msToTime(drive.data.route.traoptimal[0].summary.duration),
			},
		});
	} catch (err) {
		res.status(500).json({ message: "서버오류입니다" });
		console.log(err.response);
	}
};
