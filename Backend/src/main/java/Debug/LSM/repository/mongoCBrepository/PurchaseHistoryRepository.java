package Debug.LSM.repository.mongoCBrepository;

import Debug.LSM.domain.Purchase_History;
import Debug.LSM.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PurchaseHistoryRepository extends MongoRepository<Purchase_History, String> {
    List<Purchase_History> findByUser(User user);
}
