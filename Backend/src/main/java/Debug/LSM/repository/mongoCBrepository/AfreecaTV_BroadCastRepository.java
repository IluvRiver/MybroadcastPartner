package Debug.LSM.repository.mongoCBrepository;

import Debug.LSM.domain.AfreecaTV_BroadCast;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AfreecaTV_BroadCastRepository extends MongoRepository<AfreecaTV_BroadCast, String> {
    AfreecaTV_BroadCast findOneBy_id(String id);
}
