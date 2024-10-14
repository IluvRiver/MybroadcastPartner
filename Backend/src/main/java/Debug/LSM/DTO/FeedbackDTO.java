package Debug.LSM.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackDTO {
    @Builder.Default
    public Map<String, Integer> Viewer = new HashMap<>();

    private String published;

    @Builder.Default
    public List<Chat> chats = new ArrayList<Chat>();
}
