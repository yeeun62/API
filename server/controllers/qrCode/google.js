require("dotenv").config();

module.exports = async (req, res) => {
  try {
    let qrCode = `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${req.body.url}`;
    res.status(200).json({
      statusCode: 200,
      message: "짝짝짝 성공입니다! QR코드 생성이 완료되었습니다🥳",
      handleTip: "url을 이미지 태그에 넣어주세요👍",
      url: qrCode,
    });
  } catch (err) {
    res.status(200).json({
      statusCode: 400,
      message: "삐빅 QR코드 요청이 실패하였습니다😅 handleTip을 확인해주세요",
      handleTip: "url을 확인후, 다시 요청부탁드립니다👍",
    });
  }
};
