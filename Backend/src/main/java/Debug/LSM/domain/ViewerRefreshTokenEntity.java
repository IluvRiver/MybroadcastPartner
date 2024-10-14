package Debug.LSM.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import lombok.Data;
import lombok.Setter;


@Entity
@Table(name = "viewerRefreshTokenEntity")
@Data
@Setter
public class ViewerRefreshTokenEntity {

    @Id
    private String id;
    private String refreshToken;
}
