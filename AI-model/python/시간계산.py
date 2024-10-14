import requests
import json
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()

#방송id로 방송 정보 가져오기
BCID ="FJfwehhzIhw"
key = os.environ.get('youtube_api_key')
video_url = 'https://www.googleapis.com/youtube/v3/videos'
video_params = {
    'part': 'snippet',
    'id': BCID,
    'key': key
}
video_r = requests.get(video_url, video_params)
video_data = json.loads(json.dumps(video_r.json()))

da = datetime.strptime("20220711", "%Y%m%d")
#방송 시작시간 추출
published = video_data["items"][0]["snippet"]["publishedAt"]
#datetime.timedelta타입으로 변환
published = datetime.strptime(published,'%Y-%m-%dT%H:%M:%SZ')
#datetime.timedelta연산
a = published - da
print(str(a))
print(type(a))
