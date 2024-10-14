package Debug.LSM.service;

import Debug.LSM.DTO.LoginResponseDTO;
import Debug.LSM.DTO.RefreshTokenDTO;
import Debug.LSM.domain.RefreshTokenEntity;
import Debug.LSM.repository.mongoCBrepository.RefreshTokenRepository;
import Debug.LSM.repository.mongoCBrepository.UserRepository;
import Debug.LSM.repository.postgrerepository.ViewerRepository;
import Debug.LSM.utils.JwtUtil;
import Debug.LSM.utils.YoutubeUtil;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import Debug.LSM.domain.User;


import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Service
@Transactional
public class UserService {

    @Value("${jwt.secret}")
    private String secretKey;

    //30분
    private Long accessTokenExpiredMs = 1000 * 60 * 60 * 30L;

    //1일
    private Long refreshTokenExpiredMs = 1000 * 60 * 60 * 24L;


    private final UserRepository user_repository;

    private final RefreshTokenRepository refreshTokenRepository;


    @Autowired
    public UserService(UserRepository user_repository, RefreshTokenRepository refreshTokenRepository,
                       ViewerRepository viewerRepository) {
        this.user_repository = user_repository;
        this.refreshTokenRepository = refreshTokenRepository;
    }


    public ResponseEntity<LoginResponseDTO> test() {
        LoginResponseDTO loginResponseDTO = LoginResponseDTO.builder()
                .accessToken(JwtUtil.creatAccessToken("qkrodyd306@gmail.com", secretKey, accessTokenExpiredMs))
                .refreshToken(JwtUtil.createRefreshToken(secretKey, accessTokenExpiredMs)).build();

        RefreshTokenEntity refreshTokenEntity = RefreshTokenEntity.builder()
                ._id("qkrodyd306@gmail.com")
                .refreshToken(loginResponseDTO.getRefreshToken()).build();

        refreshTokenRepository.save(refreshTokenEntity);

        return ResponseEntity.ok(loginResponseDTO);
    }

    //사용자 정보 가져오기
    public ResponseEntity<LoginResponseDTO> find_User(String token, String access_token) {
        String channels_Id = YoutubeUtil.getChannelId(access_token);
        //바디 디코딩 후 json형태로 변환
        Base64.Decoder decoder = Base64.getUrlDecoder();
        String subject = new String(decoder.decode(token));
        JSONObject payload = new JSONObject(subject);
        //값 가져오기
        User user = User.builder().name(payload.getString("name"))
                .email(payload.getString("email")).picture(payload.getString("picture")).channels_Id(channels_Id).build();

        User u = user_repository.findOneByEmail(payload.getString("email"));

        if(u != null){
            user.setImage(u.getImage());
            user.setCategory(u.getCategory());
        }

        if (u == null || u.getDate() == null || u.getDate().isBefore(LocalDateTime.now())) {
            user.setClass_name("basic");
            user.setDate(null);
        } else {
            user.setClass_name(u.getClass_name());
            user.setDate(u.getDate());
        }
        user_repository.save(user);

        //accessToken,refreshToken 생성
        String accessToken = JwtUtil.creatAccessToken(user.getEmail(), secretKey, accessTokenExpiredMs);
        String refreshToken = JwtUtil.createRefreshToken(secretKey, refreshTokenExpiredMs);

        LoginResponseDTO loginResponseDTO = LoginResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(user).build();

        RefreshTokenEntity refreshTokenEntity = RefreshTokenEntity.builder()
                ._id(user.getEmail())
                .refreshToken(refreshToken).build();

        refreshTokenRepository.save(refreshTokenEntity);

        return ResponseEntity.ok(loginResponseDTO);
    }


    //구글 사용자 정보 가져오기
    public String google(String access_token) {
        String url = "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + access_token;

        HttpClient httpClient = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("accept", "application/json")
                .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            String jsonString = response.body();
            return jsonString;
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            return null;
        }
    }

    //로그아웃
    //refreshToken 삭제
    public ResponseEntity logout(RefreshTokenDTO refreshTokenDTO) {

        RefreshTokenEntity refreshTokenEntity = refreshTokenRepository.findOneByRefreshToken(refreshTokenDTO.getRefreshToken());
        if (refreshTokenEntity == null) return ResponseEntity.ok().build();
        refreshTokenRepository.delete(refreshTokenEntity);
        return ResponseEntity.ok().build();
    }

    //refreshToken 재발급
    public ResponseEntity<LoginResponseDTO> refreshToken(RefreshTokenDTO refreshTokenDTO) {
        RefreshTokenEntity refreshTokenEntity = refreshTokenRepository.findOneByRefreshToken(refreshTokenDTO.getRefreshToken());
        if (refreshTokenEntity == null) return ResponseEntity.badRequest().build();
        User user = user_repository.findOneByEmail(refreshTokenEntity.get_id());
        String accessToken = JwtUtil.creatAccessToken(user.getEmail(), secretKey, accessTokenExpiredMs);

        LoginResponseDTO loginResponseDTO = LoginResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenEntity.getRefreshToken())
                .user(user).build();

        return ResponseEntity.ok(loginResponseDTO);
    }

    public ResponseEntity saveCategory(String email, List<Integer> category) {
        User user = user_repository.findOneByEmail(email);
        user.setCategory(category);
        user_repository.save(user);
        return ResponseEntity.ok().build();

    }

    public ResponseEntity saveImage(String email, List<String> values) {
        try{
            User tmpuser = user_repository.findOneByEmail(email);
            tmpuser.setImage(values);
            user_repository.save(tmpuser);
            return ResponseEntity.ok().build();
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    public ResponseEntity<User> reget(String email) {
        try {
            User user = user_repository.findOneByEmail(email);
            return ResponseEntity.ok(user);
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
}
