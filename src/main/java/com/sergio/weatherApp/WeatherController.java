package com.sergio.weatherApp;

import com.jayway.jsonpath.JsonPath;

import org.springframework.ui.Model;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.client.RestTemplate;

import io.github.cdimascio.dotenv.Dotenv;

@Controller
public class WeatherController {

    @GetMapping("/")
    public String getWeather(Model model){
        List<Integer> temperatures = new ArrayList<>();
        List<String> times = new ArrayList<>();
        RestTemplate restTemplate = new RestTemplate();
        Dotenv dotenv = Dotenv.load();
        String url = "http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/213490?apikey=" + dotenv.get("WEATHER_API_KEY");
        try {
            String rawResponse = restTemplate.getForObject(url, String.class);
            for (int i = 0; i < 12; i++) {
                String jsonPathTemp = "$[" + i + "].Temperature.Value";
                temperatures.add(fahrenheitToCelsius(JsonPath.read(rawResponse, jsonPathTemp)));
                String jsonPathDate = "$[" + i + "].DateTime";
                times.add(JsonPath.read(rawResponse, jsonPathDate).toString().substring(11, 16));
            }
            model.addAttribute("temperature" ,temperatures);
            model.addAttribute("times" ,times);
            return "index";
            
        } catch (Exception e) {
            return "Error al obtener datos: " + e.getMessage();
        }
    }


    private Integer fahrenheitToCelsius(Double temp){
        return (int) (((temp - 32) * 5) / 9);
    }
}
