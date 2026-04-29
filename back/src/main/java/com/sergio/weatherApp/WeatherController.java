package com.sergio.weatherApp;

import com.jayway.jsonpath.JsonPath;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
public class WeatherController {

    @GetMapping("/weather")
    public Map<String, Object> getWeather() {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://api.open-meteo.com/v1/forecast?latitude=51.50&longitude=-0.12&hourly=temperature_2m&forecast_hours=12&timezone=auto";

        try {
            String rawResponse = restTemplate.getForObject(url, String.class);

            List<String> rawTimes = JsonPath.read(rawResponse, "$.hourly.time");
            List<Double> temperatures = JsonPath.read(rawResponse, "$.hourly.temperature_2m");

            List<String> formattedTimes = rawTimes.stream()
                    .map(time -> time.substring(11, 16))
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("times", formattedTimes);
            response.put("temperatures", temperatures);

            return response;

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("status", "error");
            error.put("message", e.getMessage());
            return error;
        }
    }
}