package Debug.LSM.domain;


import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Shorts")
@Builder
public class Shorts {
    @Id
    private String id;
    @DBRef
    private User user;
}
