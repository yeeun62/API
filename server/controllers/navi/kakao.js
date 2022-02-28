const axios = require("axios");
require("dotenv").config();

function msToTime(duration) {
  let minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24);
  if (hours === 0) {
    return `${minutes}분`;
  }
  return `${hours}시간 ${minutes}분`;
}

module.exports = {
  //! 길찾기
  navi: async (req, res) => {
    try {
      const { start, end, priority, wayPoint, avoid } = req.body;
      let url = encodeURI(
        `https://apis-navi.kakaomobility.com/v1/directions?origin=${start}&destination=${end}&priority=${priority}${wayPoint}&avoid=${avoid}`
      );
      let navi = await axios.get(url, {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        },
      });
      if (navi.status === 200) {
        if (navi.data.routes[0].result_code === 0) {
          let route = {
            duration: msToTime(navi.data.routes[0].sections[0].duration * 1000),
            distance: `${navi.data.routes[0].sections[0].distance / 1000}km`,
          };
          if (wayPoint) {
            let distance = navi.data.routes[0].sections.reduce(
              (acc, cur) => acc + cur.distance,
              0
            );
            let duration = navi.data.routes[0].sections.reduce(
              (acc, cur) => acc + cur.duration,
              0
            );
            route = {
              duration: msToTime(duration * 1000),
              distance: `${distance / 1000}km`,
            };
          }
          res.status(200).json({
            data: navi.data,
            route,
          });
        } else {
          res.status(400).json({
            data: navi.data.routes[0],
          });
        }
      } else {
        res.status(500).json({ message: "에러에러" });
      }
    } catch (err) {
      console.log("navi 에러", err);
    }
  },

  //! 선 그리기 좌표
  position: async (req, res) => {
    try {
      let position = await axios.get(
        encodeURI(
          `https://dapi.kakao.com/v2/local/search/address.json?query=${req.body.address}`
        ),
        {
          headers: {
            Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
          },
        }
      );
      let data = {
        lat: Number(position.data.documents[0].y),
        lng: Number(position.data.documents[0].x),
      };
      res.status(200).json({ data });
    } catch (err) {
      console.log("position 에러", err);
    }
  },

  //! 좌표를 주소로 변환
  coord: async (req, res) => {
    try {
      let coord = await axios.get(
        `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${req.body.lng}&y=${req.body.lat}`,
        {
          headers: {
            Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
          },
        }
      );
      res
        .status(200)
        .json({ address: coord.data.documents[0].address.address_name });
    } catch (err) {
      console.log("coord 에러", err);
    }
  },
};
