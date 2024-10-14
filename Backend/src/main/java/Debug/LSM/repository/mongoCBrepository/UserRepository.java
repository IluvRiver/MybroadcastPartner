package Debug.LSM.repository.mongoCBrepository;

import Debug.LSM.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    User findOneByEmail(String id);
}
