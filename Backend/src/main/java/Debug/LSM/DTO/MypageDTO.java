package Debug.LSM.DTO;

import Debug.LSM.domain.BroadCast;
import Debug.LSM.domain.YearTotalData;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Builder
@Getter
@Setter
public class MypageDTO {

    private List<BroadCast> broadCasts = new ArrayList<BroadCast>();

    private List<YearTotalData> years = new ArrayList<YearTotalData>();
}
