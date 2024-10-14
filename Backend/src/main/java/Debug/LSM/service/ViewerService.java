package Debug.LSM.service;

import Debug.LSM.DTO.RefreshTokenDTO;
import Debug.LSM.DTO.ViewerLoginResponseDTO;
import Debug.LSM.DTO.ViewersignupDTO;
import Debug.LSM.domain.Viewer;
import Debug.LSM.domain.ViewerRefreshTokenEntity;
import Debug.LSM.repository.postgrerepository.ViewerRefreshTokenRepositoty;
import Debug.LSM.repository.postgrerepository.ViewerRepository;
import Debug.LSM.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class ViewerService {
    @Value("${jwt.secret}")
    private String secretKey;

    //30분
    private Long accessTokenExpiredMs = 1000 * 60 * 30L;

    //1일
    private Long refreshTokenExpiredMs = 1000 * 60 * 60 * 24L;

    private final ViewerRepository viewerRepository;
    private final ViewerRefreshTokenRepositoty viewerRefreshTokenRepositoty;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public ViewerService(ViewerRepository viewerRepository,
                         ViewerRefreshTokenRepositoty viewerRefreshTokenRepositoty,
                         PasswordEncoder passwordEncoder) {
        this.viewerRepository = viewerRepository;
        this.viewerRefreshTokenRepositoty = viewerRefreshTokenRepositoty;
        this.passwordEncoder = passwordEncoder;

    }

    //시청자 회원가임
    public ResponseEntity signup(ViewersignupDTO form) {
        try {
            Viewer viewer = new Viewer();
            viewer.setId(form.getId());
            viewer.setPw(passwordEncoder.encode(form.getPw()));
            viewer.setName(form.getName());
            viewer.setBirth(form.getBirth());
            viewer.setSex(form.isSex());
            viewer.setEmail(form.getEmail());
            viewer.setCategory(form.getCategory());

            viewerRepository.save(viewer);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    //시청자 로그인
    public ResponseEntity<ViewerLoginResponseDTO> findViewer(String ID, String password) {

        try {

            Optional<Viewer> OPviewer = viewerRepository.findById(ID);
            if (OPviewer.isPresent() && passwordEncoder.matches(password, OPviewer.get().getPw())) {

                Viewer viewer = OPviewer.get();
                //accessToken,refreshToken 생성
                String accessToken = JwtUtil.creatAccessToken(ID, secretKey, accessTokenExpiredMs);
                String refreshToken = JwtUtil.createRefreshToken(secretKey, refreshTokenExpiredMs);

                ViewerLoginResponseDTO viewerLoginResponseDTO = ViewerLoginResponseDTO.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .viewer(viewer).build();

                ViewerRefreshTokenEntity viewerRefreshToken = new ViewerRefreshTokenEntity();
                viewerRefreshToken.setId(ID);
                viewerRefreshToken.setRefreshToken(refreshToken);

                viewerRefreshTokenRepositoty.save(viewerRefreshToken);


                return ResponseEntity.ok(viewerLoginResponseDTO);
            } else {
                return ResponseEntity.ok().build();
            }

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }

    }

    //아이디 중복확인
    public ResponseEntity idCheck(String ID) {
        try {

            Optional<Viewer> viewer = viewerRepository.findById(ID);
            if (!viewer.isPresent()) {
                return ResponseEntity.ok(true);
            } else {
                return ResponseEntity.ok(false);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }

    }

    //사용자 비밀번호 변경
    public ResponseEntity changePW(String id, String pw) {
        Optional<Viewer> viewerOP = viewerRepository.findById(id);
        if (viewerOP.isPresent()) {
            Viewer viewer = viewerOP.get();
            viewer.setPw(passwordEncoder.encode(pw));
            viewerRepository.save(viewer);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    //로그아웃
    public ResponseEntity logout(RefreshTokenDTO refreshTokenDTO) {
        ViewerRefreshTokenEntity viewerRefreshToken = viewerRefreshTokenRepositoty
                .findOneByRefreshToken(refreshTokenDTO.getRefreshToken());
        if (viewerRefreshToken == null) return ResponseEntity.ok().build();
        viewerRefreshTokenRepositoty.delete(viewerRefreshToken);
        return ResponseEntity.ok().build();
    }
}
