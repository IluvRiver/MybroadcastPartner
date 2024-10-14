package Debug.LSM.DTO;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ViewerDTO {
    private String BCID;
    private String sec;
    private Integer viewer;

}
