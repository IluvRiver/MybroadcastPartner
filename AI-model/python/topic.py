from keybert import KeyBERT
from kiwipiepy import Kiwi
from transformers import BertModel
from youtube_transcript_api import YouTubeTranscriptApi

from pytube import YouTube

# 모델 및 객체 초기화
model = BertModel.from_pretrained('skt/kobert-base-v1')
kw_model = KeyBERT(model)
kiwi = Kiwi()


def topic(BCID, time):
    url = f'https://youtu.be/{BCID}'

    yt = YouTube(url)

    # YOUTUBE SCRIPT
    srt = YouTubeTranscriptApi.get_transcript(BCID, languages=["ko"])

    # spring에서 넘어온 긍정이 가장 많은 시간대

    def get_topic(emotionhour, videohour):
        for i in srt:
            absNum = abs(i['start'] - emotionhour)
            if absNum < videohour:
                videohour = absNum
                # 근삿값
                nearhour = i['start']

        # 영상 스크립트 추출시간
        durationEndhour = nearhour + 100
        durationStarthour = nearhour - 50
        data = []
        start_t = 0
        end_t = 0
        for i in srt:
            if (i['start'] >= durationStarthour and i['start'] < durationEndhour):
                if start_t == 0:
                    start_t = i['start']
                end_t = i['start'] + i['duration']
                data.append(i['text'].replace('[ __ ]', ''))

        # 리스트 to string
        result = ' '.join(s for s in data)

        no = ['올해', '하루', '년도', '내일', '지금', '그거', '이것', '이번',
              '때문', '만약', '쓰고', '오늘', '근래', '그때', '정도', '이거',
              '여기', '우리', '저기', '아니', '진짜']

        # 명사 추출 함수
        def noun_extractor(text):
            results = []
            result = kiwi.analyze(text)
            for token, pos, _, _ in result[0][0]:
                if len(token) != 1 and pos.startswith('N') or pos.startswith('SL'):
                    if not token in no:
                        results.append(token)

            return results

        text = ' '.join(noun_extractor(result))
        keywords = kw_model.extract_keywords(text, keyphrase_ngram_range=(1, 1), stop_words=None, top_n=3)
        data = {
            'keywords': keywords,
            'start_t': start_t,
            'end_t': end_t
        }
        return data

    videohour = yt.length
    topic_data = {}
    for key, val in time.items():
        topic_data[key] = get_topic(int(val), videohour)

    return topic_data

d ={'positive': 1400, "negative": 2000, "emotion7": 3000}

print(topic("nAK6IWev38E",d ))
