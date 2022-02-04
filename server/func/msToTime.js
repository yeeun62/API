function msToTime(duration) {
	let seconds = parseInt((duration / 1000) % 60),
		minutes = parseInt((duration / (1000 * 60)) % 60),
		hours = parseInt((duration / (1000 * 60 * 60)) % 24);

	hours = hours < 10 ? "0" + hours : hours;
	minutes = minutes < 10 ? "0" + minutes : minutes;
	seconds = seconds < 10 ? "0" + seconds : seconds;

	if (hours === "00") {
		return `${minutes}분 ${seconds}초`;
	}
	return `${hours}시간 ${minutes}분 ${seconds}초`;
}

module.exports = msToTime;
