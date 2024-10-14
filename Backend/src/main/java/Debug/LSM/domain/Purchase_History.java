package Debug.LSM.domain;

import lombok.Builder;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "Purchase_History")
@Builder
@Getter
public class Purchase_History {
    @Id
    //apply_num
    private String _id;
    private String name;
    private String amount;
    private String merchant_uid;
    private LocalDateTime start_date;
    private LocalDateTime end_date;
    @DBRef
    private User user;


}
