import json
import nltk
import os
import asyncio
import aiohttp
import textwrap

from flask import request, Response
from flask_restful import Resource
from dotenv import load_dotenv

from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter

load_dotenv()
# YouTube API Key
YOUTUBE_API_KEY = os.getenv("youtube_api_key")
# OpenAI API Key
OPENAI_API_KEY = os.getenv("openAI_api_key")

class content(Resource):
    # 카테고리에 해당하는 영상 가져오기
    async def fetch_videos(self, video_title, max_results):
        url = "https://www.googleapis.com/youtube/v3/search"
        print(video_title)
        params = {
            'key': YOUTUBE_API_KEY,
            'part': 'snippet',
            'maxResults': max_results,
            'order': 'relevance',
            'location': '35.95,128.25',  # 서울의 위도와 경도
            'locationRadius': '300km',
            'relevanceLanguage': 'ko',  # 한글 자막이 있는 영상을 우선적으로 찾으려 하는 매개변수
            'type': 'video',
            'q': video_title,
            'videoCaption': 'closedCaption',  # 자막이 있는 동영상을     가져오는 매개변수
        }
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                return await response.json()

    # 각 비디오 ID에 대해 조회수를 가져오는 함수
    async def get_video_data(self, video_ids):
        video_params = {
            'key': YOUTUBE_API_KEY,
            'part': 'snippet,contentDetails,statistics',
            'id': ','.join(video_ids)
        }
        async with aiohttp.ClientSession() as session:
            async with session.get("https://www.googleapis.com/youtube/v3/videos", params=video_params) as response:
                video_response = await response.json()
                return {item['id']: item for item in video_response.get('items', [])}

    # 각 영상의 프로필 가져오기
    async def get_channel_data(self, channel_ids):
        channel_params = {
            'key': YOUTUBE_API_KEY,
            'part': 'snippet',
            'id': ','.join(channel_ids)
        }
        async with aiohttp.ClientSession() as session:
            async with session.get("https://www.googleapis.com/youtube/v3/channels", params=channel_params) as response:
                channel_response = await response.json()
                return {item['id']: item for item in channel_response.get('items', [])}

    # 영상의 자막 가져오기
    async def get_videos_subtitle(self, video_id):
        try:
            transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=["ko"])
            text_formatter = TextFormatter()  # SRT 형식으로 출력 지정
            text_formatted = text_formatter.format_transcript(transcript, languages=['ko'])

            # text 전체 출력
            text_info = text_formatted.replace("\n", " ")  # 개행문자 제거

            # text 일부 출력
            shorten_text_info = textwrap.shorten(text_info, 500, placeholder=' [..이하 생략..]')
            return text_info
        except Exception as e:
            return str(e)  # 자막이 없거나 오류 발생 시 오류 메시지 반환

    # 전체 자막 내용을 기반으로 요약 생성
    async def generate_summary(self, text):
        summary = await self.process_videos_with_chatgpt(
            f"'{text}' 이 4개의 영상 자막 내용을 한줄로 요약해줘 :")
        return summary

    # 요약된 내용을 기반으로 동영상 제목 생성
    async def generate_video_titles(self, original_titles):
        generated_titles = await self.process_videos_with_chatgpt(
            f"'{original_titles}' 이 요약을 기준으로, 유튜브 동영상의 제목을 만들어줘 :")
        return generated_titles

    # 시나리오 내용을 기반으로 해시태그 생성
    async def generate_hashtags(self, text):
        hashtags = await self.process_videos_with_chatgpt(
            f"'{text}' 이 시나리오를 기준으로, 유튜브 해시태그 6개를 만들어주는데 숫자 없고 간격은 띄어쓰기로 해시태그만 나오게 해줘")
        return hashtags

    # 입력한 프롬프트를 가지고 비디오 분석 프롬프트 구성
    async def process_videos_with_chatgpt(self, prompt):
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {OPENAI_API_KEY}"
        }
        data = {
            "model": "gpt-4-turbo",
            "messages": [
                {"role": 'system',
                 "content": 'You are a helpful assistant, analyze YouTube videos and provide structured insights.'},
                {"role": 'user', "content": prompt}
            ]
        }
        async with aiohttp.ClientSession() as session:
            async with session.post("https://api.openai.com/v1/chat/completions", headers=headers,
                                    json=data) as response:
                print(f"Status Code: {response.status}, Response Text: {await response.text()}")  # 로그 출력
                if response.status == 200:
                    response_json = await response.json()
                    output = response_json.get('choices', [])[0].get('message', {}).get('content', '').strip()
                    return output
                else:
                    return {"error": "Failed to process videos with OpenAI", "status_code": response.status}

    # 전체 자막에 대해 내용 분석
    async def analyze_content(self, subtitles):
        # None 값을 제거하고 문자열을 결합
        combined_subtitles = ' '.join(filter(None, subtitles))
        print(combined_subtitles)

        # 요약
        summary_result = await self.generate_summary(combined_subtitles);

        # 콘텐츠 제목
        new_titles = await self.generate_video_titles(summary_result)

        # 시나리오 생성
        content_ideas = await self.process_videos_with_chatgpt(f"'{summary_result}' 이 요약을 기준으로, 유튜브 동영상의 시나리오를 작성해줘 :")

        # 해시태그 생성
        hashtags = await self.generate_hashtags(content_ideas)

        return {
            "new_titles": new_titles,
            "hashtags": hashtags,
            "summary": summary_result,
            "content_ideas": content_ideas
        }

    async def get_video_info(self, video_title):
        search_response = await self.fetch_videos(video_title, max_results=4)
        video_ids = [video['id']['videoId'] for video in search_response.get('items', [])]
        video_data = await self.get_video_data(video_ids)
        channel_ids = [video['snippet']['channelId'] for video in search_response.get('items', [])]
        channel_data = await self.get_channel_data(channel_ids)

        combined_data = []
        for video in search_response.get('items', []):
            video_id = video['id']['videoId']
            channel_id = video['snippet']['channelId']
            video_info = video_data.get(video_id)
            channel_info = channel_data.get(channel_id)

            if video_info and channel_info:
                video_snippet = video_info['snippet']
                video_statistics = video_info['statistics']
                channel_snippet = channel_info['snippet']

                video_item = {
                    'url': f"https://www.youtube.com/watch?v={video_id}",
                    'title': video_snippet.get('title'),
                    'thumbnails_Url': video_snippet.get('thumbnails', {}).get('medium', {}).get('url'),
                    'channelTitle': channel_snippet.get('title'),
                    'channelImage': channel_snippet.get('thumbnails', {}).get('default', {}).get('url'),
                    'channelUrl': f"https://www.youtube.com/{channel_snippet.get('customUrl')}",
                    'views': video_statistics.get('viewCount')
                }
                combined_data.append(video_item)
        return combined_data

    async def get_subtitle_analysis(self, video_title):
        search_response = await self.fetch_videos(video_title, max_results=4)
        video_ids = [video['id']['videoId'] for video in search_response.get('items', [])]
        subtitles = [await self.get_videos_subtitle(video_id) for video_id in video_ids]

        if any(subtitles):
            analysis = await self.analyze_content(subtitles)
        else:
            analysis = "No subtitles available"

        return analysis

    def get(self):
        video_title = request.args.get('videoTitle', type=str)

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        video_info = loop.run_until_complete(self.get_video_info(video_title))
        subtitle_analysis = loop.run_until_complete(self.get_subtitle_analysis(video_title))

        data = {
            'videos': video_info,
            'analysis': subtitle_analysis
        }

        return Response(json.dumps(data, ensure_ascii=False).encode('utf8'), mimetype='application/json')
