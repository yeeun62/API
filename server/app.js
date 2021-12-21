const express = require("express");
const app = express();
const cors = require("cors");
const server = require("http").createServer(app);

app.use(express.json());
app.use(
	cors({
		origin: true,
		credentials: true,
		methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
	})
);

const router = require("./routes/route");

app.get("/", (req, res) => {
	res.send("api 서버");
});

app.use("/v1", router);

server.listen(80, () => console.log("api 서버 실행"));
