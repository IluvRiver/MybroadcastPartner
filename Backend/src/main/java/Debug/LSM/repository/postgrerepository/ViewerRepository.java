package Debug.LSM.repository.postgrerepository;

import Debug.LSM.domain.Viewer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ViewerRepository extends JpaRepository<Viewer, String> {

}
