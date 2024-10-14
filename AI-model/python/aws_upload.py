
import boto3
from botocore.client import Config
from dotenv import load_dotenv
import os
load_dotenv()

BUCKET_NAME = os.environ.get('BUCKET')
ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID') #s3 관련 권한을 가진 IAM계정 정보
ACCESS_SECRET_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
def upload_file(f): #f는 파일name

    data = open('./shorts/' + f, 'rb')
    # '로컬의 해당파일경로'+ 파일명 + 확장자
    s3 = boto3.resource(
        's3',
        aws_access_key_id=ACCESS_KEY_ID,
        aws_secret_access_key=ACCESS_SECRET_KEY,
        config=Config(signature_version='s3v4')
    )
    s3.Bucket(BUCKET_NAME).put_object(
        Key=f, Body=data, ContentType='mp4')
    return 200