package Debug.LSM.service;


import Debug.LSM.DTO.PurchaseHistoryDTO;
import Debug.LSM.domain.Purchase_History;
import Debug.LSM.repository.mongoCBrepository.PurchaseHistoryRepository;
import Debug.LSM.repository.mongoCBrepository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import Debug.LSM.domain.User;

import java.util.Collections;
import java.util.List;

@Service
@Transactional
public class PayService {

    private final UserRepository userRepository;
    private final PurchaseHistoryRepository purchaseHistoryRepository;

    public PayService(UserRepository userRepository, PurchaseHistoryRepository purchaseHistoryRepository) {
        this.userRepository = userRepository;
        this.purchaseHistoryRepository = purchaseHistoryRepository;
    }

    //결제 정보 저장
    public ResponseEntity saveClass(PurchaseHistoryDTO purchaseHistoryDTO) {

        try {
            User user = userRepository.findOneByEmail(purchaseHistoryDTO.getUser().getEmail());

            Purchase_History purchaseHistory = purchaseHistoryDTO.toEntity();

            user.setDate(purchaseHistory.getStart_date().plusMonths(1));
            user.setClass_name(purchaseHistoryDTO.getName());


            purchaseHistoryRepository.insert(purchaseHistory);
            userRepository.save(user);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    //결제정보 가져오기
    public ResponseEntity<List<Purchase_History>> getPurchaseHistory(String email) {
        List<Purchase_History> list = purchaseHistoryRepository.findByUser(User.builder().email(email).build());
        Collections.reverse(list);
        return ResponseEntity.ok(list);
    }
}
