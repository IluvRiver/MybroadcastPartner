
import boto3
from botocore.client import Config
from dotenv import load_dotenv
import os
load_dotenv()

BUCKET_NAME = os.environ.get('BUCKET')
ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID') #s3 관련 권한을 가진 IAM계정 정보
ACCESS_SECRET_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
AWS_DEFAULT_REGION= os.environ.get('AWS_DEFAULT_REGION')

def download_file(f): #f는 파일name

    client = boto3.client('s3',
                          aws_access_key_id=ACCESS_KEY_ID,
                          aws_secret_access_key=ACCESS_SECRET_KEY,
                          region_name=AWS_DEFAULT_REGION
                          )

    file_name = f  # 다운될 동영상 이름
    bucket = BUCKET_NAME  # 버켓 주소
    key = f  # s3 동영상

    client.download_file(bucket, key, file_name)

