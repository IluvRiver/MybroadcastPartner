package Debug.LSM.DTO;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class TokenDTO {

    private String accessToken;
    private String refreshToken;
}
