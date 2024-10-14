package Debug.LSM.DTO;

import jakarta.validation.constraints.Email;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ViewersignupDTO {

    private String id;
    private String pw;
    private String name;
    private String birth;
    private boolean sex;
    private int[] category;
    @Email
    private String email;
}
