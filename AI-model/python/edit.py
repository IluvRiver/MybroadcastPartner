import os
from pytube import YouTube
from moviepy.editor import VideoFileClip
from aws_upload import upload_file
from aws_download import download_file


def download_video_with_range(url, start_time, end_time, output_path):
    yt = YouTube(url)
    basename = os.path.basename(url)
    basename = basename[8:]  # URL에서 동영상 ID 추출

    # 720p 스트림 찾기
    stream = yt.streams.filter(res="720p").first()

    # 시작 및 종료 시간을 초 단위로 변환
    start = start_time.strip().split(':')
    start_seconds = int(start[0]) * 60 * 60 + int(start[1]) * 60 + int(start[2])
    print(start_seconds)
    end = end_time.strip().split(':')
    end_seconds = int(end[0]) * 60 * 60 + int(end[1]) * 60 + int(end[2])
    print(end_seconds)

    # 다운로드 및 자른 파일의 파일명 생성
    downfilename = basename + f".org.{stream.subtype}"
    cutfilename = basename + f".{stream.subtype}"

    # 동영상 다운로드
    stream.download(output_path, downfilename)

    org = os.path.join(output_path, downfilename)
    cut = os.path.join(output_path, cutfilename)

    # 특정 부분 추출 및 저장
    clip = VideoFileClip(org).subclip(start_seconds, end_seconds)
    clip.write_videofile(cut)
    # s3 업로드
    print("파일 네임" + cutfilename)
    print(output_path)
    upload_file(cutfilename)
    # 원본 다운로드 파일 제거
    os.remove(org)

    # download_file(cutfilename)
    print('업로드 완료')
