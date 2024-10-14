package Debug.LSM.DTO;

import Debug.LSM.DTO.DayTotalData;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class MonthTotalData {
    public int[] All_Emotion3 = new int[3];
    public int[] All_Emotion7 = new int[7];
    public DayTotalData[] day_total_data = new DayTotalData[31];
}
