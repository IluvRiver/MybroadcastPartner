package Debug.LSM.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "BlackList")
@Builder
@Getter
public class BlackList {
    @Id
    //BCID
    private String user_id;
    private Integer platform;
    @DBRef
    private User user;
}
