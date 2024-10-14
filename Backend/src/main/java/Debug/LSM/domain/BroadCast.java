package Debug.LSM.domain;

import Debug.LSM.DTO.TopicDTO;
import lombok.*;
import org.json.JSONObject;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashMap;
import java.util.Map;


@Document(collection = "BroadCast")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class BroadCast {
    @Id
    //BCID
    private String _id;
    private String URI;
    private String Title;
    private String ThumbnailsUrl;
    private String ActualStartTime;
    private String ActualEndTime;
    private Integer HighViewer;
    private Integer LowViewer;
    @Builder.Default
    public int[] All_Emotion3 = new int[3];
    @Builder.Default
    public int[] All_Emotion7 = new int[7];
    private String published;
    @Builder.Default
    public Map<String, Integer> Viewer = new HashMap<>();

    @Builder.Default

    private TopicDTO topic = null;

    @DBRef
    private User user;
}
