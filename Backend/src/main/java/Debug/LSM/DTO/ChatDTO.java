package Debug.LSM.DTO;

import lombok.Builder;
import lombok.Getter;
import Debug.LSM.domain.User;

@Builder
@Getter
public class ChatDTO {
    private User user;
    private String BCID;
    private String name;
    private Chat chat;
}
