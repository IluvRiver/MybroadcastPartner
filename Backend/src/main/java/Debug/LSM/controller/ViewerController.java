package Debug.LSM.controller;

import Debug.LSM.DTO.RefreshTokenDTO;
import Debug.LSM.DTO.ViewerLoginResponseDTO;
import Debug.LSM.DTO.ViewersignupDTO;
import Debug.LSM.service.ViewerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/viewer")
@CrossOrigin("*")
public class ViewerController {
    @Autowired
    public ViewerController(ViewerService viewerService) {
        this.viewerService = viewerService;
    }

    private final ViewerService viewerService;

    @PostMapping("/signup")
    public ResponseEntity newViewer(@RequestBody ViewersignupDTO form) {
        return viewerService.signup(form);
    }

    @GetMapping("/login")
    public ResponseEntity<ViewerLoginResponseDTO> findViewer(@RequestParam("ID") String ID,
                                                             @RequestParam("password") String password) {
        return viewerService.findViewer(ID, password);
    }

    @DeleteMapping("/logout")
    public ResponseEntity logout(@RequestBody RefreshTokenDTO refreshTokenDTO) {
        return viewerService.logout(refreshTokenDTO);
    }

    @GetMapping("/idCheck")
    public ResponseEntity<Boolean> idCheck(@RequestParam("ID") String ID) {
        return viewerService.idCheck(ID);
    }

    @PostMapping("/changePW")
    public ResponseEntity changePW(Authentication authentication,
                                   @RequestParam("password") String pw) {
        String id = authentication.getName();
        System.out.println();
        return viewerService.changePW(id,pw);
    }
}
