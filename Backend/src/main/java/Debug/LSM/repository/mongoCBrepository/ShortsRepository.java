package Debug.LSM.repository.mongoCBrepository;

import Debug.LSM.domain.Shorts;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ShortsRepository extends MongoRepository<Shorts, String> {
}
