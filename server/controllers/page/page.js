const axios = require("axios");
const AWS = require("aws-sdk");
const DynamoDB = require("../../config/dynamoDB.js");

AWS.config.update(DynamoDB.aws_remote_config);
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports = {
  //! 캔버스 생성
  postCanvas: async (req, res) => {
    let uuid = await axios.get("https://api.handle.market/v1/uuid", {
      headers: { HANDLE_API_KEY: process.env.HANDLE_API_KEY },
    });

    const params = {
      TableName: DynamoDB.aws_table_name,
      Item: {
        canvas_uuid: uuid.data.code,
        canvas_info: req.body.info,
      },
    };
    docClient.put(params, (err, data) => {
      if (err) {
        console.log("에러", err);
        res.status(400).json({ message: "에러입니다.." });
      } else {
        res.status(200).json({ message: "성공입니다!", uuid: uuid.data.code });
      }
    });
  },

  //! 캔버스 조회
  findCanvas: (req, res) => {
    const params = {
      TableName: DynamoDB.aws_table_name,
      KeyConditionExpression: "canvas_uuid = :i",
      ExpressionAttributeValues: {
        ":i": req.body.uuid,
      },
    };
    docClient.query(params, (err, data) => {
      if (err) {
        console.log("에러", err);
        res.status(400).json({ message: "에러입니다.." });
      } else {
        res
          .status(200)
          .json({ message: "성공입니다!", data: data.Items[0].canvas_info });
      }
    });
  },

  updateCanvas: (req, res) => {},

  getPixabay: async (req, res) => {
    let category = ["backgrounds", "education", "business", "feelings"];
    let key = process.env.PIXABAY_API_KEY;

    try {
      const result = await axios.get(
        `https://pixabay.com/api/?key=${key}&lang=ko&category=${category[0]}`
      );
      if (result.status === 200) {
        res.status(200).json({ category: category[0], data: result.data.hits });
      }
    } catch (err) {
      res.status(400).json({ message: "bad request" });
    }
  },

  searchPixabay: async (req, res) => {
    let q = "flower";

    try {
      const search = await axios.get(
        `https://pixabay.com/api/?key=${key}&q=${q}`
      );
      if (search.status === 200) {
        res.status(200).json({ query: q, data: search.data.hits });
      }
    } catch (err) {
      res.status(400).json({ message: "bad request" });
    }
  },
};
