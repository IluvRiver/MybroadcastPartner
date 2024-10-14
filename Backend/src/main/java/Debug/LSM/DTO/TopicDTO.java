package Debug.LSM.DTO;


import lombok.Builder;

@Builder
public class TopicDTO {
    private TopicData positive_topicData;
    private TopicData negative_topicData;
    private TopicData emotion7_topicData;
    private int emotion7;
}
