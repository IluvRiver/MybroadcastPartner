package Debug.LSM.repository.mongoCBrepository;

import Debug.LSM.domain.BlackList;
import Debug.LSM.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BlackListRepository extends MongoRepository<BlackList,String> {
    List<BlackList> findByUser(User user);
}
