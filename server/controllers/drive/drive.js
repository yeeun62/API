const axios = require("axios");
const msToTime = require("../../func/msToTime");
require("dotenv").config();

module.exports = async (req, res) => {
	const { platform, start, goal, option } = req.body;

	let searchOption;
	if (option === "traoptimal") {
		searchOption = 0;
	} else if (option === "traavoidtoll") {
		searchOption = 1;
	} else if (option === "trafast") {
		searchOption = 2;
	} else if (option === "tracomfort") {
		searchOption = 3;
	} else if (option === "traavoidcaronly") {
		searchOption = 12;
	}

	if (platform === "tmap") {
		let location = {
			startX: start.split(",")[0],
			startY: start.split(",")[1],
			endX: goal.split(",")[0],
			endY: goal.split(",")[1],
			searchOption,
		};

		try {
			let TmapRes = await axios.post(
				`https://apis.openapi.sk.com/tmap/routes?version=2`,
				location,
				{
					headers: {
						appKey: process.env.TMAP_KEY,
					},
				}
			);

			res.status(200).json({
				거리: `${TmapRes.data.features[0].properties.totalDistance / 1000}km`,
				시간: msToTime(TmapRes.data.features[0].properties.totalTime * 1000),
				요금: `${TmapRes.data.features[0].properties.totalFare}원`,
			});
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: "tmap 서버오류입니다" });
		}
	} else if (platform === "ncloud") {
		try {
			let drive = await axios.get(
				`https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start=${start}&goal=${goal}&option=${option}`,
				{
					headers: {
						"X-NCP-APIGW-API-KEY-ID": process.env.NCLOUD_DRIVE_CLIENT_ID,
						"X-NCP-APIGW-API-KEY": process.env.NCLOUD_DRIVE_CLIENT_SECRET,
					},
				}
			);

			res.status(200).json({
				거리: `${drive.data.route[option][0].summary.distance / 1000}km`,
				시간: msToTime(drive.data.route[option][0].summary.duration),
				요금: `${drive.data.route[option][0].summary.tollFare}원`,
			});
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: "ncloud 서버오류입니다" });
		}
	}
};
