package Debug.LSM.domain;

import jakarta.validation.constraints.Email;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "RefreshToken")
@Builder
@Getter
public class RefreshTokenEntity {

    @Id
    @Email
    //사용자 Email
    private String _id;
    private String refreshToken;

}
