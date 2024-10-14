package Debug.LSM.DTO;


import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DayTotalData {

    public int[] All_Emotion3 = new int[3];
    public int[] All_Emotion7 = new int[7];
    public HourData[] One_Hour_Emotion = new HourData[24];
}
