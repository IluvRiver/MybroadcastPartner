package Debug.LSM.repository.mongoCBrepository;

import Debug.LSM.domain.User;
import Debug.LSM.domain.YearTotalData;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface YearRepositoy extends MongoRepository<YearTotalData, String> {
    List<YearTotalData> findByUser(User user);
}