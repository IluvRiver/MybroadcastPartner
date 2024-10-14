package Debug.LSM.DTO;

import Debug.LSM.domain.Purchase_History;
import lombok.Builder;
import lombok.Getter;
import Debug.LSM.domain.User;
import lombok.Setter;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
public class PurchaseHistoryDTO {
    private String apply_num;
    private String name;
    private String amount;
    private String merchant_uid;
    private User user;

    public Purchase_History toEntity(){
        return Purchase_History.builder()._id(this.apply_num).name(this.name).amount(this.amount).
                merchant_uid(this.merchant_uid).start_date(LocalDateTime.now()).
                end_date(LocalDateTime.now().plusMonths(1)).user(this.user).build();
    }
}
