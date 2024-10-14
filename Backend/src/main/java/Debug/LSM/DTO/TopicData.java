package Debug.LSM.DTO;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TopicData {
    private String[] topic;
    private int start_time;
    private int end_time;
}
