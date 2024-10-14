package Debug.LSM.domain;

import Debug.LSM.DTO.MonthTotalData;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Year_Total_Data")
@NoArgsConstructor
@Getter
@Setter
public class YearTotalData {
    @Id
    private String _id;
    public int[] All_Emotion3 = new int[3];
    public int[] All_Emotion7 = new int[7];
    public MonthTotalData[] monthTotalData = new MonthTotalData[12];
    @DBRef
    private User user;
}
