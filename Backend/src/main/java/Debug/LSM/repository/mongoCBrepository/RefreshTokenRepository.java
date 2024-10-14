package Debug.LSM.repository.mongoCBrepository;

import Debug.LSM.domain.RefreshTokenEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RefreshTokenRepository extends MongoRepository<RefreshTokenEntity, String> {

    RefreshTokenEntity findOneByRefreshToken(String refreshToken);
}
