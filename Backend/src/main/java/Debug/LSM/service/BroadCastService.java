package Debug.LSM.service;


import Debug.LSM.DTO.*;
import Debug.LSM.domain.*;
import Debug.LSM.repository.mongoCBrepository.*;
import Debug.LSM.utils.YoutubeUtil;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class BroadCastService {

    @Value("${java.file.youtubeAPIKey}") // 변수 파일에 등록된 java.file.test 값 가져오기
    private String youtubeAPIKey;

    @Value("${java.file.flask_ip}")
    private String flask_ip;

    //몽고디비 연결
    private final BroadCastRepository broadCastRepository;
    private final YearRepositoy yearRepositoy;
    private final AuthorRepositoy authorRepositoy;
    private final AfreecaTV_BroadCastRepository afreecaTVBroadCastRepository;
    private final Chzzk_BroadCastRepository chzzkBroadCastRepository;
    private final BlackListRepository blackListRepository;


    @Autowired
    public BroadCastService(BroadCastRepository broadCastRepository,
                            YearRepositoy yearRepositoy,
                            AuthorRepositoy authorRepositoy,
                            AfreecaTV_BroadCastRepository afreecaTVBroadCastRepository,
                            Chzzk_BroadCastRepository chzzkBroadCastRepository,
                            BlackListRepository blackListRepository) {
        this.broadCastRepository = broadCastRepository;
        this.yearRepositoy = yearRepositoy;
        this.authorRepositoy = authorRepositoy;
        this.afreecaTVBroadCastRepository = afreecaTVBroadCastRepository;
        this.chzzkBroadCastRepository = chzzkBroadCastRepository;
        this.blackListRepository = blackListRepository;
    }

    //방송정보 저장, 있으면 반환
    //계정 맞는지 확인하는 인증 추가 예정
    public ResponseEntity<BCIDDTO> identification(User user, BCIDDTO BCID) {

        //유저가 없으면 반환
        if (user == null) return ResponseEntity.badRequest().build();

        Chzzk_BroadCast chzzkBroadCast = new Chzzk_BroadCast();
        AfreecaTV_BroadCast afreecaTVBroadCast = new AfreecaTV_BroadCast();


        if (BCID.getChzzk() != null) {
            chzzkBroadCast.set_id(BCID.getChzzk());
            Chzzk_BroadCast tmpCh = chzzkBroadCastRepository.findOneBy_id(chzzkBroadCast.get_id());
            if (tmpCh == null) {
                chzzkBroadCast.setUser(user);
                chzzkBroadCastRepository.save(chzzkBroadCast);
            }
        }

        if (BCID.getAfreecaBNO() != null) {
            afreecaTVBroadCast.set_id(BCID.getAfreecaBNO());
            AfreecaTV_BroadCast tmpAf = afreecaTVBroadCastRepository.findOneBy_id(afreecaTVBroadCast.get_id());
            if (tmpAf == null) {
                afreecaTVBroadCast.setBID(BCID.getAfreecaBID());
                afreecaTVBroadCast.setUser(user);
                afreecaTVBroadCastRepository.save(afreecaTVBroadCast);
            }
        }


        if (BCID.getYoutubeBCID() != null) {
            try {
                //유튜브 데이터 가져오기
                JSONObject json = YoutubeUtil.getYouTubeBCData(BCID.getYoutubeBCID(), youtubeAPIKey);
                if (json == null) return ResponseEntity.badRequest().build();
                //방송정보 담기
                BroadCast BC = BroadCast.builder()._id(BCID.getYoutubeBCID()).URI(BCID.getYoutubeBCID()).Title(json.getString("title")).
                        ThumbnailsUrl(json.getJSONObject("thumbnails").getJSONObject("default").getString("url")).
                        user(user).published(json.getString("publishedAt")).build();
                try {
                    BroadCast TMP = broadCastRepository.findOneBy_id(BC.get_id());
                    if (TMP != null) {
                        return ResponseEntity.ok(BCID);
                    }
                    broadCastRepository.save(BC);
                    return ResponseEntity.ok(BCID);
                } catch (Exception e) {
                    System.out.println(e.getMessage());
                    return ResponseEntity.badRequest().build();
                }
            } catch (Exception e) {
                System.out.println(e.getMessage());
                return ResponseEntity.badRequest().build();
            }
        }
        return ResponseEntity.ok(BCID);
    }

    //채팅 데이터 저장
    public ResponseEntity saveChat(ChatDTO chatDTO) {

        Chat chat = chatDTO.getChat();

        //날짜 년,월,일 자르기
        String[] date = chat.getDateTime().split("-| ");
        String[] time = date[3].split(":");

        //유저 정보로 년 정보 찾기
        User user = chatDTO.getUser();
        List<YearTotalData> yearList = yearRepositoy.findByUser(chatDTO.getUser());
        YearTotalData yearTotalData = new YearTotalData();
        yearTotalData.set_id(date[0] + user.getEmail());
        yearTotalData.setUser(user);
        LocalDate now = LocalDate.now();

        String cury = now.getYear() + user.getEmail();

        for (int i = 0; i < yearList.size(); i++) {
            if (yearList.get(i).get_id().equals(cury)) {
                yearTotalData = yearList.get(i);
                yearTotalData.setUser(user);
                break;
            }
        }

        yearTotalData.All_Emotion3[chat.getEmotion3()]++;
        yearTotalData.All_Emotion7[chat.getEmotion7()]++;
        int month = Integer.parseInt(date[1]) - 1;
        int day = Integer.parseInt(date[2]) - 1;
        if (yearTotalData.monthTotalData[month] == null) {
            yearTotalData.monthTotalData[month] = new MonthTotalData();
        }
        yearTotalData.monthTotalData[month].getAll_Emotion3()[chat.getEmotion3()]++;
        yearTotalData.monthTotalData[month].getAll_Emotion7()[chat.getEmotion7()]++;
        if (yearTotalData.monthTotalData[month].getDay_total_data()[day] == null) {
            yearTotalData.monthTotalData[month].getDay_total_data()[day] = new DayTotalData();
        }
        yearTotalData.monthTotalData[month].getDay_total_data()[day].getAll_Emotion3()[chat.getEmotion3()]++;
        yearTotalData.monthTotalData[month].getDay_total_data()[day].getAll_Emotion7()[chat.getEmotion7()]++;

        int hour = Integer.parseInt(time[0]) - 1;

        if (yearTotalData.monthTotalData[month].getDay_total_data()[day].
                One_Hour_Emotion[hour] == null) {
            yearTotalData.monthTotalData[month].getDay_total_data()[day].
                    One_Hour_Emotion[hour] = new HourData();
        }
        yearTotalData.monthTotalData[month].getDay_total_data()[day].
                One_Hour_Emotion[hour].All_Emotion3[chat.getEmotion3()]++;
        yearTotalData.monthTotalData[month].getDay_total_data()[day].
                One_Hour_Emotion[hour].All_Emotion7[chat.getEmotion7()]++;

        yearTotalData.setUser(user);
        yearRepositoy.save(yearTotalData);

        //방송 정보 저장
        BroadCast BC = broadCastRepository.findById(chatDTO.getBCID()).get();
        BC.All_Emotion3[chat.getEmotion3()]++;
        BC.All_Emotion7[chat.getEmotion7()]++;
        broadCastRepository.save(BC);


        //방송 정보로 시청자 정보 가져오기
        BroadCast sampleBC = BroadCast.builder()._id(chatDTO.getBCID()).build();
        List<Author> authorList = authorRepositoy.findByBroadCast(sampleBC);

        //시청자 채팅 저장
        for (int i = 0; i < authorList.size(); i++) {
            Author author = authorList.get(i);
            if (author.getName().equals(chatDTO.getName())) {
                return save_chat(author, chat);
            }
        }

        Author author = Author.builder().broadCast(sampleBC).name(chatDTO.getName()).build();
        return save_chat(author, chat);
    }

    //시청자 수 저장
    public ResponseEntity saveViewer(ViewerDTO viewerDTO) {
        try {
            BroadCast BC = broadCastRepository.findOneBy_id(viewerDTO.getBCID());
            BC.Viewer.put(viewerDTO.getSec(), viewerDTO.getViewer());

            broadCastRepository.save(BC);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println("error");
            return ResponseEntity.badRequest().build();
        }
    }

    public ResponseEntity<FeedbackDTO> getChat(String BCID) {

        BroadCast BC = broadCastRepository.findOneBy_id(BCID);
        FeedbackDTO feedbackDTO = FeedbackDTO.builder().published(BC.getPublished()).Viewer(BC.getViewer()).build();
        List<Author> Authors = authorRepositoy.findByBroadCast(BC);
        for (Author Author : Authors) {
            for (Chat chat : Author.getChat()) {
                feedbackDTO.chats.add(chat);
            }
        }
        return ResponseEntity.ok(feedbackDTO);
    }

    //토픽
    public ResponseEntity<TopicDTO> getTopic(String BCID) {
        TopicDTO topic = null;
        BroadCast BC;
        try {
            BC = broadCastRepository.findOneBy_id(BCID);
            topic = BC.getTopic();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
        if (topic == null) {
            String url = flask_ip + "/feedback/" + BCID;

            HttpClient httpClient = HttpClient.newHttpClient();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("accept", "application/json")
                    .build();

            try {
                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
                String jsonString = response.body();

                TopicData po = new TopicData();
                TopicData ne = new TopicData();
                TopicData emo7 = new TopicData();

                topic = TopicDTO.builder().positive_topicData(po).
                        negative_topicData(ne).
                        emotion7_topicData(emo7)
                        .emotion7(2).build();

                //토픽 저장
                BC.setTopic(topic);
                broadCastRepository.save(BC);
                return ResponseEntity.ok(topic);

            } catch (Exception e) {
                System.err.println("Error: " + e.getMessage());
                return ResponseEntity.badRequest().build();
            }
        } else {
            return ResponseEntity.ok(topic);
        }
    }

    //정보 저장
    private ResponseEntity save_chat(Author author, Chat chat) {
        author.chat.add(chat);
        author.All_Emotion3[chat.getEmotion3()]++;
        author.All_Emotion7[chat.getEmotion7()]++;
        try {
            authorRepositoy.save(author);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println("채팅 저장 실패");
            return ResponseEntity.badRequest().build();
        }
    }

    public ResponseEntity addBlacklist(BlackList blackList) {

        try {
            blackListRepository.save(blackList);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    public ResponseEntity removeBlackList(BlackList blackList) {
        try {
            blackListRepository.delete(blackList);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    public ResponseEntity<List<BlackList>> getBlackList(String name) {
        try {
            List<BlackList> blackLists = blackListRepository.findByUser(User.builder().email(name).build());

            return ResponseEntity.ok(blackLists);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

}
