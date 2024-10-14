package Debug.LSM.repository.mongoCBrepository;

import Debug.LSM.domain.Chzzk_BroadCast;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface Chzzk_BroadCastRepository extends MongoRepository<Chzzk_BroadCast, String> {
    Chzzk_BroadCast findOneBy_id(String id);
}
