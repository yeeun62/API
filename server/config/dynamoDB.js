module.exports = {
  aws_table_name: "canvas_storage",
  aws_remote_config: {
    accessKeyId: process.env.AWS_ACCESSKEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESSKEY,
    region: "us-east-1",
  },
};
