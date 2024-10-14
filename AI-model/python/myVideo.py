import json

from flask import request, Response
from flask_restful import Resource
import requests
from dotenv import load_dotenv
import os

load_dotenv()

class myVideo(Resource):

    # 자신의 채널 정보 가져오기
    def get_channel_data(self, api_key, channel_id):
        url = "https://www.googleapis.com/youtube/v3/channels"
        params = {
            'key': api_key,
            'part': 'snippet, statistics',
            'forHandle': channel_id,
        }
        response = requests.get(url, params=params)
        channels_response = response.json()

        # 채널 상세 정보 저장
        channel_details = {}
        for channel in channels_response.get('items', []):
            channel_id = channel['id']
            snippet = channel['snippet']
            statistics = channel['statistics']
            channel_details = {
                'channel_id': channel_id,
                'channelTitle': snippet['title'],
                'channelDescription': snippet['description'],
                'channelImage': snippet['thumbnails']['medium']['url'],
                'customUrl': snippet.get('customUrl', ''),
                'subscriberCount': statistics['subscriberCount'],
                'videoCount': statistics['videoCount']
            }

        return channel_details

    # 자신의 채널 영상 가져오기
    def get_videos(self, api_key, channel_id, sequence, videoType):
        url = "https://www.googleapis.com/youtube/v3/search"
        params = {
            'key': api_key,
            'part': 'snippet',
            'channelId': channel_id,
            'type': 'video',
            'order': sequence,  # 사용자가 원하는 순서
            'videoDuration': videoType  # 숏폼을 제외한 보통 길이의 영상 가져오기
        }
        response = requests.get(url, params=params)
        videos_response = response.json()
        print(videos_response)

        videos = []
        for item in videos_response.get('items', []):
            if item['id'].get('videoId'):
                videos.append({
                    'videoId': item['id']['videoId'],
                    'title': item['snippet']['title'],
                    'thumbnails_Url': item['snippet']['thumbnails']['medium']['url'],
                    'publishedAt': item['snippet']['publishedAt']
                })

        video_ids = [video['videoId'] for video in videos]
        video_data = self.get_video_data(api_key, video_ids)

        # 각 비디오 정보에 조회수와 태그를 추가합니다.
        for video in videos:
            data = video_data.get(video['videoId'])
            if data:
                video['views'] = data['statistics'].get('viewCount', '0')  # 조회수 추가
                video['tags'] = self.normalize_tags(data['snippet'].get('tags', []))  # 태그 추가

        return videos

    # 각 비디오 ID에 대해 조회수를 가져오는 함수
    def get_video_data(self, api_key, video_ids):
        video_params = {
            'key': api_key,
            'part': 'snippet,contentDetails,statistics',
            'id': ','.join(video_ids)
        }
        video_response = requests.get("https://www.googleapis.com/youtube/v3/videos", params=video_params).json()
        return {item['id']: item for item in video_response.get('items', [])}

    # 해시태그 기호("#") 제거
    def normalize_tags(self, tags):
        normalized_tags = [tag.replace("#", "") for tag in tags]
        return normalized_tags

    def get(self):
        youtube_api_key = os.environ.get('youtube_api_key')
        channel_id = request.args.get('channel_id', type=str)
        sequence = request.args.get('sequence', type=str)
        videoType = request.args.get('videoType', type=str)

        # 자신의 채널 정보 가져오기
        channel_info = self.get_channel_data(youtube_api_key, channel_id)

        # 채널의 영상 가져오기
        videos = self.get_videos(youtube_api_key, channel_info['channel_id'], sequence, videoType)

        # 최종 데이터 생성
        data = {
            'videos': videos,
            'channel_info': channel_info
        }

        res = json.dumps(data, ensure_ascii=False).encode('utf8')
        return Response(res, content_type='application/json; charset=utf8')
