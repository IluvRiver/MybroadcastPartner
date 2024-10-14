package Debug.LSM.DTO;

import Debug.LSM.domain.User;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
public class LoginResponseDTO {
    private String accessToken;
    private String refreshToken;
    private User user;

}
