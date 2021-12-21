#!/bin/bash
cd /home/ubuntu/handleAPI/server

sudo apt install awscli
export ALIGO_KEY=$(aws ssm get-parameters --region ap-northeast-2 --names ALIGO_KEY --query Parameters[0].Value | sed 's/"//g')
export ALIGO_USERID=$(aws ssm get-parameters --region ap-northeast-2 --names ALIGO_USERID --query Parameters[0].Value | sed 's/"//g')
export SENDER=$(aws ssm get-parameters --region ap-northeast-2 --names SENDER --query Parameters[0].Value | sed 's/"//g')
export LOG_URL=$(aws ssm get-parameters --region ap-northeast-2 --names LOG_URL --query Parameters[0].Value | sed 's/"//g')
export ORANGE_AUTH=$(aws ssm get-parameters --region ap-northeast-2 --names ORANGE_AUTH --query Parameters[0].Value | sed 's/"//g')
export NAVER_CLIENT_ID=$(aws ssm get-parameters --region ap-northeast-2 --names NAVER_CLIENT_ID --query Parameters[0].Value | sed 's/"//g')
export NAVER_CLIENT_SECRET=$(aws ssm get-parameters --region ap-northeast-2 --names NAVER_CLIENT_SECRET --query Parameters[0].Value | sed 's/"//g')
export NCLOUD_URL_API_KEY_ID=$(aws ssm get-parameters --region ap-northeast-2 --names NCLOUD_URL_API_KEY_ID --query Parameters[0].Value | sed 's/"//g')
export NCLOUD_URL_API_KEY=$(aws ssm get-parameters --region ap-northeast-2 --names NCLOUD_URL_API_KEY --query Parameters[0].Value | sed 's/"//g')
export NCLOUD_CAPTCHA_CLIENT_ID=$(aws ssm get-parameters --region ap-northeast-2 --names NCLOUD_CAPTCHA_CLIENT_ID --query Parameters[0].Value | sed 's/"//g')
export NCLOUD_CAPTCHA_CLIENT_SECRET=$(aws ssm get-parameters --region ap-northeast-2 --names NCLOUD_CAPTCHA_CLIENT_SECRET --query Parameters[0].Value | sed 's/"//g')
export KAKAO_REST_API_KEY=$(aws ssm get-parameters --region ap-northeast-2 --names KAKAO_REST_API_KEY --query Parameters[0].Value | sed 's/"//g')
export KAKAO_AK=$(aws ssm get-parameters --region ap-northeast-2 --names KAKAO_AK --query Parameters[0].Value | sed 's/"//g')

sudo authbind --deep pm2 start app.js