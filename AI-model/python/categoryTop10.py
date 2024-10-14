import json
from collections import Counter
from datetime import datetime, timedelta

from flask import request, Response
from flask_restful import Resource
import requests
from dotenv import load_dotenv
import os

load_dotenv()

class categoryTop10(Resource):
    # 최신 인기 동영상을 카테고리별로 가져오기
    def get_recent_popular_videos(self, api_key, category_id, region='KR', max_results=50):
        # 지난 7일 동안의 인기 동영상을 검색
        days_ago = 7
        start_date = datetime.now() - timedelta(days=days_ago)
        start_date_rfc3339 = start_date.isoformat("T") + "Z"  # RFC 3339 형식

        url = "https://www.googleapis.com/youtube/v3/videos"
        params = {
            'part': 'snippet,contentDetails,statistics',
            'chart': 'mostPopular', # 인기 동영상을 검색하기 위한 매개변수
            'regionCode': region,   # 검색할 지역 또는 국가 코드
            'videoCategoryId': category_id, # 카테고리 별 동영상을 검색하기 위한 매개변수
            'maxResults': max_results,
            'key': api_key,
            'publishedAfter': start_date_rfc3339    # 지난 7일 동안의 인기 동영상을 검색하기 위한 매개변수
        }
        response = requests.get(url, params=params)
        return response.json()

    # 해시태그 기호("#") 제거
    def normalize_tags(self, tags):
        normalized_tags = [tag.replace("#", "") for tag in tags]
        return normalized_tags

    # 각 영상의 채널 정보 가져오기
    def get_channel_data(self, api_key, video_data):
        channel_ids = {video['snippet']['channelId'] for video in video_data}
        url = "https://www.googleapis.com/youtube/v3/channels"
        params = {
            'key': api_key,
            'part': 'snippet',
            'id': ','.join(channel_ids)
        }
        response = requests.get(url, params=params)
        channels_response = response.json()

        # 채널 상세 정보 저장
        channel_details = {}
        for channel in channels_response.get('items', []):
            channel_id = channel['id']
            snippet = channel['snippet']
            channel_details[channel_id] = {
                'channelTitle': snippet['title'],
                'channelImage': snippet['thumbnails']['default']['url'],
                'customUrl': snippet.get('customUrl', '')
            }

        return channel_details

    def get(self):
        youtube_api_key = os.environ.get('youtube_api_key')
        video_category_id = request.args.get('videoCategoryId', type=int)

        # 카테고리별 최신 인기 동영상 정보 가져오기
        videos_response = self.get_recent_popular_videos(youtube_api_key, video_category_id)

        video_data = videos_response.get('items', [])
        video_details = {video['id']: {
            'title': video['snippet']['title'],
            'thumbnails_Url': video['snippet']['thumbnails']['medium']['url'],
            'views': video['statistics']['viewCount'],
            'tags': self.normalize_tags(video['snippet'].get('tags', [])),
            'channelId': video['snippet'].get('channelId', [])
        } for video in video_data}

        # 각 비디오의 채널 정보 가져오기
        channel_details = self.get_channel_data(youtube_api_key, video_data)

        # 비디오와 채널 정보 결합
        combined_data = []
        tag_original = {}
        all_tags = []
        for video_id, details in video_details.items():
            tags = video_details[video_id]['tags']
            for tag in tags:
                normalized_tag = tag.replace(" ", "").lower()
                all_tags.append(normalized_tag)
                if normalized_tag not in tag_original:
                    tag_original[normalized_tag] = tag

            combined_data.append({
                'url': f"https://www.youtube.com/watch?v={video_id}",
                'title': video_details[video_id]['title'],
                'thumbnails_Url': video_details[video_id]['thumbnails_Url'],
                'views': video_details[video_id]['views'],
                'tags': video_details[video_id]['tags'],
                'channelTitle': channel_details[details['channelId']]['channelTitle'],
                'channelImage': channel_details[details['channelId']]['channelImage'],
                'channelUrl': f"https://www.youtube.com/channel/{details['channelId']}"
            })

        # 태그 빈도수 계산 및 상위 10개 태그 추출
        tag_counts = Counter(all_tags)
        most_common_tags = tag_counts.most_common(10)
        # 원본 태그 복원
        top_tags_original = [(tag_original[tag], count) for tag, count in most_common_tags]

        # 최종 데이터 생성
        data = {
            'videos': combined_data,
            'Top10Tags': top_tags_original
        }

        res = json.dumps(data, ensure_ascii=False).encode('utf8')
        return Response(res, content_type='application/json; charset=utf8')
