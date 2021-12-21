const axios = require("axios");

const log = async (handleSystemId, logContent, returnLogID) => {
	let logSend = await axios.post(`${process.env.LOG_URL}/add`, {
		handleSystemId,
		logContent,
		returnLogID,
	});
	return logSend;
};

module.exports = log;
