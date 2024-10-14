package Debug.LSM.controller;


import Debug.LSM.DTO.*;
import Debug.LSM.domain.BlackList;
import Debug.LSM.service.BroadCastService;
import Debug.LSM.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/broadcast")
@CrossOrigin("*")
public class BroadCastController {
    @Autowired
    public BroadCastController(BroadCastService broadCastService) {
        this.broadCastService = broadCastService;
    }

    private final BroadCastService broadCastService;

    //방송정보 저장, 있으면 반환
    //계정 맞는지 확인하는 인증 추가 예정
    @GetMapping("/identification")
    public ResponseEntity<BCIDDTO> identification(Authentication authentication,
                                                  @RequestParam("URI") String URI) {

        User user = new User();
        user.setEmail(authentication.getName());

        //URI에서 BCID추출
        String[] URIs = URI.split("https://");
        BCIDDTO bcid = new BCIDDTO();

        for (int i = 0; i < URIs.length; i++) {
            if (URIs[i].contains("youtube.com")) {
                String tmp = URIs[i].replace("https://", "").replace("www.", "")
                        .replace("youtube.com/watch?v=", "");
                bcid.setYoutubeBCID(tmp);
            } else if (URIs[i].contains("chzzk.naver.com")) {
                String tmp = URIs[i].replace("https://", "").replace("www.", "")
                        .replace("chzzk.naver.com/live/", "");
                bcid.setChzzk(tmp);
            } else if (URIs[i].contains("play.afreecatv.com")) {
                String[] tmp = URIs[i].replace("https://", "").replace("www.", "")
                        .split("/");
                bcid.setAfreecaBID(tmp[1]);
                bcid.setAfreecaBNO(tmp[2]);
            }
        }

        return broadCastService.identification(user, bcid);
    }

    //채팅 저장 및 전달
    @PostMapping("/chat")
    public ResponseEntity saveChat(Authentication authentication,
                                   @RequestParam("BCID") String BCID,
                                   @RequestParam("name") String name,
                                   @RequestBody Chat chat) {
        ChatDTO chatDTO = ChatDTO.builder().user(User.builder().email(authentication.getName()).build())
                .BCID(BCID).name(name).chat(chat).build();
        return broadCastService.saveChat(chatDTO);
    }

    //시청자수 저장
    @PostMapping("/saveViewer")
    public ResponseEntity saveViewer(@RequestParam("BCID") String BCID,
                                     @RequestParam("sec") String sec,
                                     @RequestParam("viewer") String viewer) {

        return broadCastService.saveViewer(ViewerDTO.builder().BCID(BCID).sec(sec)
                .viewer(Integer.parseInt(viewer)).build());
    }

    @GetMapping("/getChat")
    public ResponseEntity<FeedbackDTO> getChat(@RequestParam("BCID") String BCID) {
        return broadCastService.getChat(BCID);
    }

    @GetMapping("/getTopic")
    public ResponseEntity<TopicDTO> getTopic(@RequestParam("BCID") String BCID) {
        return broadCastService.getTopic(BCID);
    }

    @PostMapping("/addBlackList")
    public ResponseEntity addBlacklist(Authentication authentication,
                                       @RequestParam("user_id") String user_id,
                                       @RequestParam("platform") Integer platform) {
        BlackList blackList = BlackList.builder().user_id(user_id)
                .user(User.builder().email(authentication.getName()).build())
                .platform(platform).build();
        return broadCastService.addBlacklist(blackList);
    }

    @DeleteMapping("/removeBlackList")
    public ResponseEntity removeBlackList(Authentication authentication,
                                          @RequestParam("user_id") String user_id) {
        BlackList blackList = BlackList.builder().user(User.builder().email(authentication.getName()).build())
                .user_id(user_id).build();
        return broadCastService.removeBlackList(blackList);
    }

    @GetMapping("/getBlackList")
    public ResponseEntity<List<BlackList>> getBlackList(Authentication authentication) {

        return broadCastService.getBlackList(authentication.getName());
    }


}
