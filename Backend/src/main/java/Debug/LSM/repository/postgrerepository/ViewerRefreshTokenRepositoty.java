package Debug.LSM.repository.postgrerepository;

import Debug.LSM.domain.ViewerRefreshTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ViewerRefreshTokenRepositoty extends JpaRepository<ViewerRefreshTokenEntity, String> {
    ViewerRefreshTokenEntity findOneByRefreshToken(String refreshToken);
}
