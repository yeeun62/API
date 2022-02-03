const axios = require("axios");

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

    if (TmapRes) {
      let totalDistance =
        TmapRes.data.features[0].properties.totalDistance / 1000;
      let totalTime = TmapRes.data.features[0].properties.totalTime;

      res.status(200).json({
        거리: `${totalDistance}km`,
        시간: totalTime,
      });
    } else {
      res.status(400);
    }
  } catch (err) {
    console.log(err);
    res.status(400);
  }
};
