import time
import random

from flask import Flask, make_response, Response, stream_with_context, request, jsonify
from flask_cors import CORS
from datetime import timedelta
import datetime
import Ch_api

from websocket import WebSocket
from cmd_type import CHZZK_CHAT_CMD

import requests as requests
import json
import pytchat
import re
from werkzeug.exceptions import ClientDisconnected
from datetime import datetime
from googleapiclient.discovery import build
from flask_restful import Resource, Api
from top10 import top10
from dotenv import load_dotenv
import os
import certifi
import ssl
import asyncio
import websockets
from afreecatv_api import get_player_live
from categoryTop10 import categoryTop10
from myVideo import myVideo
from edit import download_video_with_range
from content import content


def create_app():
    app = Flask(__name__)
    return app


app = create_app()

api = Api(app)
app.config['JSON_AS_ASCII'] = False
CORS(app, supports_credentials=True)

running = True
print("실행레쓰고")

load_dotenv()
youtube_api_key = os.environ.get('youtube_api_key')
topic_IP = os.environ.get('topic_IP')
spring_IP = os.environ.get('spring_server_IP')

# 카테고리 맞춤형 콘텐츠
api.add_resource(content, '/content')
# 인기 급상승 10위
api.add_resource(top10, '/po')
# 카테고리 키워드 10위
api.add_resource(categoryTop10, '/categoryTop10')
# 자신의 채널 정보 및 동영상 가져오기
api.add_resource(myVideo, '/myVideo')


@app.route('/saveshorts/<BCID>/<starttime>/<endtime>')
def saveshorts(BCID, starttime, endtime):
    title = BCID
    print("https://www.youtube.com/watch?v=" + title)
    download_video_with_range("https://www.youtube.com/watch?v=" + title, "00:2:38", "00:3:38",
                              "./shorts")
    return make_response(title, 200)


# 감정 분석
def emotionai(sen):
    IP = os.environ.get('server_IP')
    emotion = requests.get(
        IP + sen
    ).json()
    tmp = json.loads(str(emotion['emotion7P']).replace('\'', '\"'))
    emotion['emotion7'] = int(emotion['emotion7'])
    emotion['emotion3'] = float(emotion['emotion3'])
    emotion['emotion7P'] = tmp
    if emotion['emotion7'] == 4 or (emotion['emotion3'] > 0.45 and emotion['emotion3'] < 0.55):
        emotion['emotion3'] = 2
    elif emotion['emotion3'] > 0.5:
        emotion['emotion3'] = 1
    else:
        emotion['emotion3'] = 0

    return emotion


@app.route('/test')
def test():
    return "test"


def generate(BCID, Email):
    chat = pytchat.create(video_id=BCID)

    # 방송 시작시간 가져오기
    video_url = 'https://www.googleapis.com/youtube/v3/videos'
    video_params = {
        'part': 'snippet',
        'id': BCID,
        'key': youtube_api_key
    }
    video_r = requests.get(video_url, video_params)
    video_data = json.loads(json.dumps(video_r.json()))
    published = video_data["items"][0]["snippet"]["publishedAt"]
    # datetime.timedelta타입으로 변환
    published = datetime.strptime(published, '%Y-%m-%dT%H:%M:%SZ')
    preName = ""
    preDate = ""
    while chat.is_alive():
        try:
            data = chat.get()
            items = data.items
            for c in items:
                if not (preDate == c.datetime and preName == c.author.name):
                    mes = re.sub(r':[^:]+:', '', c.message)

                    # data2 = {
                    #     "author": c.author.name,
                    #     "user_id": c.author.channelId,
                    #     "dateTime": c.datetime,
                    #     "message": mes,
                    #     "emotion3": random.randint(0, 2),
                    #     "emotion7": random.randint(0, 6),
                    #     "emotion7p": "{'Nervous': 0.0002247557567898184, 'Embrrassed': 0.000452860607765615,"
                    #                  " 'Angry': 0.00013303376908879727, 'Sadness' :0.00041099119698628783,"
                    #                  " 'Neutral': 0.8828464150428772, 'Happiness': 0.0006854483508504927,"
                    #                  " 'Disgust': 0.11524643748998642}",
                    #     "platform": 0
                    # }
                    # yield f'data:{data2}\n\n'

                    emotion = emotionai(mes)

                    data2 = {
                        "author": c.author.name,
                        "user_id": c.author.channelId,
                        "dateTime": c.datetime,
                        "message": mes,
                        "emotion3": emotion['emotion3'],
                        "emotion7": emotion['emotion7'],
                        "emotion7P": emotion['emotion7P'],
                        "platform": 0
                    }
                    yield f"data:{data2}\n\n"
                    # URI = "http://localhost:8080/broadcast/chat?email=" + Email + "&BCID=" + BCID + "&name=" + c.author.name
                    # do_async(URI, data2)
                    preName = c.author.name
                    preDate = c.datetime

        except ClientDisconnected as e:
            print(f"youtube 에러 : {e}")
            break


class ChzzkChat:
    def __init__(self, streamer, cookies):
        self.streamer = streamer
        self.cookies = cookies
        self.sid = None
        self.userIdHash = Ch_api.fetch_userIdHash(self.cookies)
        self.chatChannelId = Ch_api.fetch_chatChannelId(self.streamer)
        self.channelName = Ch_api.fetch_channelName(self.streamer)
        self.accessToken, self.extraToken = Ch_api.fetch_accessToken(self.chatChannelId, self.cookies)
        self.connect()

    def connect(self):
        self.chatChannelId = Ch_api.fetch_chatChannelId(self.streamer)
        self.accessToken, self.extraToken = Ch_api.fetch_accessToken(self.chatChannelId, self.cookies)
        sock = WebSocket()
        sock.connect('wss://kr-ss1.chat.naver.com/chat')
        print(f'{self.channelName} 채팅창에 연결 중 .', end="")
        default_dict = {
            "ver": "2",
            "svcid": "game",
            "cid": self.chatChannelId,
        }
        send_dict = {
            "cmd": CHZZK_CHAT_CMD['connect'],
            "tid": 1,
            "bdy": {
                "uid": self.userIdHash,
                "devType": 2001,
                "accTkn": self.accessToken,
                "auth": "SEND"
            }
        }
        sock.send(json.dumps(dict(send_dict, **default_dict)))
        sock_response = json.loads(sock.recv())
        self.sid = sock_response['bdy']['sid']
        print(f'\r{self.channelName} 채팅창에 연결 중 ..', end="")
        send_dict = {
            "cmd": CHZZK_CHAT_CMD['request_recent_chat'],
            "tid": 2,
            "sid": self.sid,
            "bdy": {
                "recentMessageCount": 50
            }
        }
        sock.send(json.dumps(dict(send_dict, **default_dict)))
        sock.recv()
        print(f'\r{self.channelName} 채팅창에 연결 중 ...')
        self.sock = sock
        if self.sock.connected:
            print('연결 완료')
        else:
            raise ValueError('오류 발생')

    async def send(self, message: str):
        default_dict = {
            "ver": 2,
            "svcid": "game",
            "cid": self.chatChannelId,
        }
        extras = {
            "chatType": "STREAMING",
            "emojis": "",
            "osType": "PC",
            "extraToken": self.extraToken,
            "streamingChannelId": self.chatChannelId
        }
        send_dict = {
            "tid": 3,
            "cmd": CHZZK_CHAT_CMD['send_chat'],
            "retry": False,
            "sid": self.sid,
            "bdy": {
                "msg": message,
                "msgTypeCode": 1,
                "extras": json.dumps(extras),
                "msgTime": int(datetime.now().timestamp())
            }
        }
        self.sock.send(json.dumps(dict(send_dict, **default_dict)))

    def run(self):
        while True:
            try:
                try:
                    raw_message = self.sock.recv()
                except KeyboardInterrupt:
                    break
                except:
                    self.connect()
                    raw_message = self.sock.recv()

                raw_message = json.loads(raw_message)
                chat_cmd = raw_message['cmd']

                if chat_cmd == CHZZK_CHAT_CMD['ping']:
                    self.sock.send(
                        json.dumps({
                            "ver": "2",
                            "cmd": CHZZK_CHAT_CMD['pong']
                        })
                    )

                    if self.chatChannelId != api.fetch_chatChannelId(self.streamer):
                        self.connect()

                    continue

                if chat_cmd == CHZZK_CHAT_CMD['chat']:
                    chat_type = '채팅'
                elif chat_cmd == CHZZK_CHAT_CMD['donation']:
                    chat_type = '후원'
                else:
                    continue

                for chat_data in raw_message['bdy']:
                    if chat_data['uid'] == 'anonymous':
                        nickname = '익명의 후원자'
                    else:
                        try:
                            profile_data = json.loads(chat_data['profile'])
                            nickname = profile_data["nickname"]
                            if 'msg' not in chat_data:
                                continue
                        except:
                            continue

                    now = datetime.fromtimestamp(chat_data['msgTime'] / 1000)
                    now = datetime.strftime(now, '%Y-%m-%d %H:%M:%S')

                    emotion = emotionai(chat_data["msg"])

                    data2 = {
                        "author": nickname,
                        "user_id": profile_data["userIdHash"],
                        "dateTime": now,
                        "message": chat_data["msg"],
                        "emotion3": emotion['emotion3'],
                        "emotion7": emotion['emotion7'],
                        "emotion7P": emotion['emotion7P'],
                        "platform": 1
                    }
                    yield f'data:{data2}\n\n'
            except Exception as e:
                print(f"치지직 에러: {e}")


# 유니코드 및 기타 상수
F = "\x0c"
ESC = "\x1b\t"
SEPARATOR = "+" + "-" * 70 + "+"


def create_ssl_context():
    ssl_context = ssl.create_default_context()
    ssl_context.load_verify_locations(certifi.where())
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    return ssl_context


def decode_message(bytes):
    parts = bytes.split(b'\x0c')
    messages = [part.decode('UTF-8') for part in parts]
    if len(messages) > 5 and messages[1] not in ['-1', '1'] and '|' not in messages[1]:
        user_id, comment, user_nickname = messages[2], messages[1], messages[6]
        if 'fw=' not in user_nickname and "1" not in user_nickname:
            emotion = emotionai(comment)

            data2 = {
                "author": user_nickname,
                "user_id": user_id,
                "dateTime": time.strftime('%Y-%m-%d %H:%M:%S'),
                "message": comment,
                "emotion3": emotion['emotion3'],
                "emotion7": emotion['emotion7'],
                "emotion7P": emotion['emotion7P'],
                "platform": 2
            }
            return f'{data2}'

    else:
        return None


def calculate_byte_size(string):
    return len(string.encode('UTF-8')) + 6


async def fetch_messages(BID, BNO, ssl_context):
    # 여기에 실제 get_player_live(BNO, BID) 함수의 로직을 구현해야 합니다.
    # 이 예제에서는 해당 함수가 미리 정의되었다고 가정합니다.
    CHDOMAIN, CHATNO, FTK, TITLE, BJID, CHPT = get_player_live(BNO, BID)

    async with websockets.connect(
            f"wss://{CHDOMAIN}:{CHPT}/Websocket/{BID}",
            subprotocols=['chat'],
            ssl=ssl_context,
            ping_interval=None
    ) as websocket:
        CONNECT_PACKET = f'{ESC}000100000600{F * 3}16{F}'
        JOIN_PACKET = f'{ESC}0002{calculate_byte_size(CHATNO):06}00{F}{CHATNO}{F * 5}'
        PING_PACKET = f'{ESC}000000000100{F}'

        await websocket.send(CONNECT_PACKET)
        await asyncio.sleep(2)
        await websocket.send(JOIN_PACKET)

        while True:
            count = 0
            try:
                data = await websocket.recv()

                mes = decode_message(data)
                if mes:
                    count = 0
                    yield f'data:{mes}\n\n'
            except Exception as e:
                print(f"afreeca: {e}")
                count += 1
                if count > 5:
                    break


def stream_messages(BID, BNO):
    ssl_context = create_ssl_context()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    async_gen = fetch_messages(BID, BNO, ssl_context)

    try:
        while True:
            message = loop.run_until_complete(async_gen.__anext__())
            yield f'{message}\n\n'
    except StopAsyncIteration:
        pass


# 아프리카 채팅 가져오기
@app.route('/afreecaTV/<BID>/<BNO>')
def afreecaTV_sse(BID, BNO):
    return Response(stream_with_context(stream_messages(BID, BNO)), content_type='text/event-stream; charset=utf-8')


# 치지직 실시간 댓글 분석
@app.route('/Chlive/<BCID>')
def Ch_sse(BCID):
    with open('./cookies.json') as f:
        cookies = json.load(f)

    chzzkchat = ChzzkChat(BCID, cookies)
    return Response(chzzkchat.run(), content_type='text/event-stream; charset=utf-8')


# 유튜브 실시간 댓글 분석
@app.route('/live/<BCID>/<Email>')
def sse(BCID, Email):
    return Response(generate(BCID, Email), content_type='text/event-stream; charset=utf-8')


# 실시간 구독자 수
@app.route('/subcnt/<channel_ID>')
def subcnt(channel_ID):
    youtube = build('youtube', 'v3', developerKey=youtube_api_key)
    request = youtube.channels().list(
        part='statistics',
        forHandle=channel_ID
    )
    response = request.execute()
    if 'items' in response:
        statistics = response['items'][0]['statistics']
        subscriber_count = statistics['subscriberCount']
        return subscriber_count
    else:
        return "400"


# 시청자 수
@app.route('/concurrentViewers/<BCID>')
def concurrentViewers(BCID):
    def viewer(BCID):
        header = {"Content-type": "application/json", "Accept": "text/plain"}
        URI = "https://www.googleapis.com/youtube/v3/videos?id=" + BCID + \
              "&key=" + youtube_api_key + "&part=snippet,contentDetails,statistics,status"
        res = requests.get(URI).json()
        published = datetime.strptime(res['items'][0]['snippet']['publishedAt'], '%Y-%m-%dT%H:%M:%SZ')
        url = f'https://www.googleapis.com/youtube/v3/videos?id={BCID}&key={youtube_api_key}&part=liveStreamingDetails'

        while 1:
            # YouTube API 호출
            response = requests.get(url)
            data = response.json()
            vi = data['items'][0]['liveStreamingDetails']['concurrentViewers']
            yield f"data:{vi}\n\n"
            t = datetime.now() - published
            spurl = f'http://spring_IP/broadcast/saveViewer?BCID={BCID}&sec={t.seconds}&viewer={vi}'
            requests.get(spurl, headers=header)
            time.sleep(15)

    return Response(viewer(BCID), mimetype='text/event-stream')


@app.route("/feedback/<BCID>")
def feedback(BCID):
    URI = f'http://spring_IP/broadcast/getChat?BCID={BCID}'
    data = requests.get(URI).json()
    published = datetime.strptime(data['published'], '%Y-%m-%dT%H:%M:%SZ')
    published = published + timedelta(hours=9)
    time_data = []
    emotion7 = [0, 0, 0, 0, -999999, 0, 0]
    for key, value in data['viewer'].items():
        time_data.append((int(key) - 32400, [0, 0, [0, 0, 0, 0, 0, 0, 0]]))

    time_data = sorted(time_data)
    for item in data['cd']:
        t = datetime.strptime(item['dateTime'], '%Y-%m-%d %H:%M:%S')
        sec = (t - published).seconds
        pre = 0
        for key, val in enumerate(time_data):
            if sec < val[0]:
                if item['emotion3'] == 0 or item['emotion3'] == 1:
                    time_data[pre][1][item['emotion3']] += 1
                time_data[pre][1][2][item['emotion7']] += 1
                emotion7[item['emotion7']] += 1
                break
            pre = key

    min_Viewr = int(jsonmax(data['viewer']) * 0.7)
    max_emo7 = emotion7.index(max(emotion7))
    emo7_max = 0
    emo7_idx = 0
    po_emo = 0
    po_idx = 0
    na_emo = 0
    na_idx = 0
    for item in time_data:
        if int(item[0]) > min_Viewr:
            if item[1][1] > po_emo:
                po_emo = item[1][1]
                po_idx = item[0]
            if item[1][0] > na_emo:
                na_emo = item[1][0]
                na_idx = item[0]
            if item[1][2][max_emo7] > emo7_max:
                emo7_max = item[1][2][max_emo7]
                emo7_idx = item[0]

    # URI = f'{topic_IP}nAK6IWev38E'
    # print(requests.get(URI).json())
    data = {
        "positive": str(po_idx),
        "negative": str(na_idx),
        "emotion7": (max_emo7, emo7_idx)
    }
    return json.dumps(data)


@app.route('/comment/<BCID>')
def comment(BCID):
    load_dotenv()
    api_key = os.environ.get('youtube_api_key')
    video_id = BCID

    nextPageToken = request.args.get('nextPageToken')
    comments = list()
    api_obj = build('youtube', 'v3', developerKey=api_key)
    response = api_obj.commentThreads().list(part='snippet,replies', pageToken=nextPageToken,
                                             videoId=video_id, maxResults=20).execute()
    if 'nextPageToken' in response:
        nextPageToken = response['nextPageToken']

    for item in response['items']:
        try:
            comment = item['snippet']['topLevelComment']['snippet']
            emo = emotionai(comment['textDisplay'])
            data = {
                'textDisplay': comment['textDisplay'],
                'authorDisplayName': comment['authorDisplayName'],
                'publishedAt': comment['publishedAt'],
                'likeCount': comment['likeCount'],
                "emotion3": emo['emotion3'],
                "emotion7": emo['emotion7'],
            }
            comments.append(data)
            if item['snippet']['totalReplyCount'] > 0:
                for reply_item in item['replies']['comments']:
                    reply = reply_item['snippet']
                    emo = emotionai(comment['textOriginal'])
                    data = {
                        'textDisplay': reply['textDisplay'],
                        'authorDisplayName': reply['authorDisplayName'],
                        'publishedAt': reply['publishedAt'],
                        'likeCount': reply['likeCount'],
                        "emotion3": emo['emotion3'],
                        "emotion7": emo['emotion7'],
                    }
                    comments.append(data)
        except Exception as e:
            print(e)

    data = {
        'comments': comments,
        'nextPageToken': nextPageToken
    }
    return data


def jsonmax(data):
    max_value = max(data.values())
    index = 0
    for key, value in data.items():
        if value == max_value:
            return index
        index += 1


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=8801, threaded=False, processes=10)
