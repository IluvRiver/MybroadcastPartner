package Debug.LSM.domain;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Chzzk_BroadCast")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Chzzk_BroadCast {
    @Id
    //BCID
    private String _id;
    @Builder.Default
    public int[] All_Emotion3 = new int[3];
    @Builder.Default
    public int[] All_Emotion7 = new int[7];

    @DBRef
    private User user;
}
