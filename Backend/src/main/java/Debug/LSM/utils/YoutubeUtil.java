package Debug.LSM.utils;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;

public class YoutubeUtil {


    //accessToken으로 구글에서 사용자 정보 가져오기
    public static String getChannelId(String accessToken) {
        String url = "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true";

        HttpClient httpClient = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("accept", "application/json")
                .header("Authorization", "Bearer " + accessToken)
                .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            String jsonString = response.body();
            return extractChannelId(jsonString);
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            return null;
        }
    }

    //채널 아이디 추출
    public static String extractChannelId(String jsonString) {
        try {
            // JSON 문자열을 JSONObject로 파싱
            JSONObject jsonObject = new JSONObject(jsonString);

            // 'items' 배열 접근
            JSONArray itemsArray = jsonObject.getJSONArray("items");

            // 배열의 첫 번째 요소를 JSONObject로 가져옴
            JSONObject firstItem = itemsArray.getJSONObject(0);

            // 'snippet' 오브젝트 접근
            JSONObject snippet = firstItem.getJSONObject("snippet");

            // 'customUrl' 필드의 값을 추출하여 반환
            return snippet.getString("customUrl");
        } catch (Exception e) {
            System.err.println("Error extracting channel ID: " + e.getMessage());
            return null;
        }
    }
    //유튜브 데이터 가져오기
    public static JSONObject getYouTubeBCData(String BCID,String youtubeAPIKey) {
        String API_KEY = youtubeAPIKey;
        String uri = "https://www.googleapis.com/youtube/v3/videos";

        try {
            HttpClient httpClient = HttpClient.newHttpClient();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(uri + "?id=" + BCID +
                            "&key=" + API_KEY + "&part=snippet,contentDetails,statistics,status"))
                    .header("accept", "application/json")
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            String jsonString = response.body();
            return extractBCData(jsonString);
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            return null;
        }
    }

    public static JSONObject extractBCData(String jsonString) {
        try {
            JSONObject json = new JSONObject(jsonString);
            return json.getJSONArray("items").getJSONObject(0).getJSONObject("snippet");
        } catch (Exception e) {
            System.err.println("Error extracting BC data: " + e.getMessage());
            return null;
        }
    }
}
