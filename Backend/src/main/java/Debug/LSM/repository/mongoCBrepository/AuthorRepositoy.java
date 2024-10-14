package Debug.LSM.repository.mongoCBrepository;

import Debug.LSM.domain.Author;
import Debug.LSM.domain.BroadCast;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AuthorRepositoy extends MongoRepository<Author,String> {
    List<Author> findByBroadCast(BroadCast broadcast);
}
