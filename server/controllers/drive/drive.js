const axios = require("axios");
const msToTime = require("../../func/msToTime");
const { handle_api_url_count } = require("../../models");
require("dotenv").config();

module.exports = async (req, res) => {
	const { platform, start, goal, option } = req.body;
	let today = new Date().toLocaleDateString();

	if (platform === "tmap") {
		tmap(start, goal, option);
	} else if (platform === "ncloud") {
		ncloud(start, goal, option);
	}

	async function tmap(start, goal, option) {
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

			const findUrl = await handle_api_url_count.findOne({
				where: {
					date: today,
					url: "https://apis.openapi.sk.com/tmap/routes?version=2",
				},
			});
			if (findUrl) {
				handle_api_url_count.update(
					{ count: findUrl.count + 1 },
					{
						where: {
							date: today,
							url: "https://apis.openapi.sk.com/tmap/routes?version=2",
						},
					}
				);
			} else {
				handle_api_url_count.create({
					date: today,
					url: "https://apis.openapi.sk.com/tmap/routes?version=2",
					count: 1,
				});
			}

			res.status(200).json({
				거리: `${TmapRes.data.features[0].properties.totalDistance / 1000}km`,
				시간: msToTime(TmapRes.data.features[0].properties.totalTime * 1000),
				요금: `${TmapRes.data.features[0].properties.totalFare}원`,
			});
		} catch (err) {
			console.log("tmap 에러!", err);
			ncloud(start, goal, option);
		}
	}

	async function ncloud(start, goal, option) {
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

			const findUrl = await handle_api_url_count.findOne({
				where: {
					date: today,
					url: "https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving",
				},
			});
			if (findUrl) {
				handle_api_url_count.update(
					{ count: findUrl.count + 1 },
					{
						where: {
							date: today,
							url: "https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving",
						},
					}
				);
			} else {
				handle_api_url_count.create({
					date: today,
					url: "https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving",
					count: 1,
				});
			}

			res.status(200).json({
				거리: `${drive.data.route[option][0].summary.distance / 1000}km`,
				시간: msToTime(drive.data.route[option][0].summary.duration),
				요금: `${drive.data.route[option][0].summary.tollFare}원`,
			});
		} catch (err) {
			console.log("ncloud 에러!", err);
			tmap(start, goal, option);
		}
	}
};
