package Debug.LSM.repository.mongoCBrepository;

import Debug.LSM.domain.BroadCast;
import Debug.LSM.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BroadCastRepository extends MongoRepository<BroadCast,String> {
    BroadCast findOneBy_id(String id);
    List<BroadCast> findByUser(User user);
}