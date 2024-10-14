package Debug.LSM.DTO;

import Debug.LSM.domain.Viewer;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ViewerLoginResponseDTO {
    private String accessToken;
    private String refreshToken;
    private Viewer viewer;
}
