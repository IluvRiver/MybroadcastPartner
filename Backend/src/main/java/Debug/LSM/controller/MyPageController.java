package Debug.LSM.controller;

import Debug.LSM.service.MyPageService;
import Debug.LSM.domain.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mypage")
@CrossOrigin("*")
public class MyPageController {

    private final MyPageService myPageService;

    public MyPageController(MyPageService myPageService) {
        this.myPageService = myPageService;
    }

    //마이페이지 데이터
    @GetMapping("/getInfo")
    public ResponseEntity mypage(Authentication authentication) {

        User user = User.builder().email(authentication.getName()).build();
        return myPageService.mypageData(user);
    }

    @PostMapping("/saveshorts")
    public ResponseEntity saveShorts(Authentication authentication, String title){
        User user = User.builder().email(authentication.getName()).build();
        return myPageService.saveShorts(user,title);
    }
}
