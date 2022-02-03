const axios = require("axios");
const msToTime = require("../../func/msToTime");

module.exports = async (req, res) => {
	let location = req.body;

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

		let totalDistance =
			TmapRes.data.features[0].properties.totalDistance / 1000;
		let totalTime = TmapRes.data.features[0].properties.totalTime * 1000;

		res.status(200).json({
			거리: `${totalDistance}km`,
			시간: msToTime(totalTime),
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "서버오류입니다" });
	}
};
