import json

from flask import Response
from flask_restful import Resource
import requests
from dotenv import load_dotenv
import os

load_dotenv()

#인기 급상승 10위
class top10(Resource):
    def get(self):
        youtube_api_key = os.environ.get('youtube_api_key')
        api_url = 'https://www.googleapis.com/youtube/v3/videos'
        params = {
            'key': youtube_api_key,
            'part': 'snippet,statistics',
            'chart': 'mostPopular',  # 인기 동영상을 검색하기 위한 매개변수
            'regionCode': 'KR',  # 검색할 지역 또는 국가 코드
            'maxResults': 10  # 가져올 결과의 최대 수 (10개로 설정)
        }
        response = requests.get(api_url, params=params).json()
        print(response)
        popular_videos = response.get('items', [])
        data = {'data': []}
        for video in popular_videos:
            tmp = {}
            tmp['url'] = 'https://www.youtube.com/watch?v=' + video['id']
            tmp['title'] = video['snippet']['title']
            tmp['thumbnails_Url'] = video['snippet']['thumbnails']['medium']['url']
            tmp['views'] = video['statistics']['viewCount']
            data['data'].append(tmp)
        res = json.dumps(data, ensure_ascii=False).encode('utf8')
        return Response(res, content_type='application/json; charset=utf-8')
