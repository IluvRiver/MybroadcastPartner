package Debug.LSM;

import Debug.LSM.DTO.DayTotalData;
import Debug.LSM.DTO.HourData;
import Debug.LSM.DTO.MonthTotalData;
import Debug.LSM.DTO.ViewersignupDTO;
import Debug.LSM.domain.BroadCast;
import Debug.LSM.domain.Shorts;
import Debug.LSM.domain.YearTotalData;
import Debug.LSM.repository.mongoCBrepository.BroadCastRepository;
import Debug.LSM.repository.mongoCBrepository.ShortsRepository;
import Debug.LSM.repository.mongoCBrepository.YearRepositoy;
import Debug.LSM.service.BroadCastService;
import Debug.LSM.service.MyPageService;
import Debug.LSM.service.ViewerService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import Debug.LSM.domain.User;

import java.util.Arrays;
import java.util.List;

@SpringBootTest
class LsmApplicationTests {


    private final ViewerService viewerService;
    private final ShortsRepository shortsRepository;
    private final MyPageService myPageService;

    private final BroadCastRepository broadCastRepository;
    private final YearRepositoy yearRepositoy;

    @Autowired
    public LsmApplicationTests(ViewerService viewerService, ShortsRepository shortsRepository,
                               MyPageService myPageService, BroadCastRepository broadCastRepository,
                               YearRepositoy yearRepositoy) {
        this.viewerService = viewerService;
        this.shortsRepository = shortsRepository;
        this.myPageService = myPageService;
        this.broadCastRepository = broadCastRepository;
        this.yearRepositoy = yearRepositoy;
    }


    @Test
    void contextLoads() {
    }

    @Test
    public void newViewertest() {
        for (int i = 0; i < 10; i++) {
            ViewersignupDTO testViewer = new ViewersignupDTO();
            testViewer.setId("testViewer" + i);
            testViewer.setPw("testPWD" + i);
            testViewer.setSex(true);
            testViewer.setName("testUser" + i);
            testViewer.setBirth("testBirth" + i);
            testViewer.setEmail("testEmail" + i + "@test.com");
            int[] a = {12, 3, 4, 5};
            testViewer.setCategory(a);
            viewerService.signup(testViewer);
        }
    }

    @Test
    public void savashortstest() {

        String test = "testurlz2z";
        User user = User.builder().email("qkrodyd306@gmail.com").build();
        myPageService.saveShorts(user, test);
    }

    @Test
    public void deletetmp() {
        List<BroadCast> br = broadCastRepository.findByUser(User.builder().email("dbsruaqls123@gmail.com").build());
        for (int i = 0; i < br.size(); i++) {
            BroadCast tmp = br.get(i);
            if (Arrays.stream(tmp.All_Emotion3).sum() < 10) {
                broadCastRepository.delete(tmp);
            }
        }
    }

    @Test
    public void insertdata() {
        YearTotalData tmp = new YearTotalData();
        tmp.set_id("2024dbsruaqls123@gmail.com");
        tmp.setUser(User.builder().email("dbsruaqls123@gmail.com").build());
        int[] j = {31, 29, 31, 30, 31};
        MonthTotalData[] md = new MonthTotalData[12];
        for (int i = 1; i < 6; i++) {
            DayTotalData[] dt = new DayTotalData[j[i]];
            for (int p = 0; p < j[i]; p++) {
                HourData[] hd = new HourData[24];
                for (int u = 0; u < 24; i++) {
                    for (int z = 0; z < 3; z++) {
                        hd[u].All_Emotion3[z] = (int) (Math.random() * 100);
                        dt[p].All_Emotion3[z] +=  hd[u].All_Emotion3[z];
                    }
                    for (int x = 0; x < 7; x++) {
                        hd[u].All_Emotion7[x] = (int) (Math.random() * 100);
                        dt[p].All_Emotion7[x] +=  hd[u].All_Emotion7[x];
                    }
                }
            }


        }
    }


}
