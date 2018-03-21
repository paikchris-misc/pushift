package pickupmyshift;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.*;


import javax.net.ssl.HttpsURLConnection;

public class PickupUtilities {

    private static final String USER_AGENT = "Mozilla/5.0";
    private static final String GOOGLE_API_SERVER_KEY = "AIzaSyAPhPsyAMszGMEDVE6-l2WwXrr-R2hvyG0";

    static public String getTimezoneName1(String latlng) throws Exception{
        //(38.839645,-77.42234599999999)
        System.out.println(System.currentTimeMillis());
        double seconds = System.currentTimeMillis() / 1000.0;
        System.out.println(seconds);
        String formattedLatLng = latlng.replaceAll("[()]", "").replaceAll("lat/lng: ", "");
        System.out.println(formattedLatLng);
        String url = "https://maps.googleapis.com/maps/api/timezone/json" +
                "?location=" + formattedLatLng +
                "&timestamp=" + seconds +
                "&key=" + GOOGLE_API_SERVER_KEY;


        URL obj = new URL(url);
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();

        // optional default is GET
        con.setRequestMethod("GET");

        //add request header
        con.setRequestProperty("User-Agent", USER_AGENT);

        int responseCode = con.getResponseCode();
        System.out.println("\nSending 'GET' request to URL : " + url);
        System.out.println("Response Code : " + responseCode);

        BufferedReader in = new BufferedReader(
                new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuffer response = new StringBuffer();

        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();

        //print result

        JSONObject jsonObj = new JSONObject(response.toString());
        System.out.println(jsonObj );
        Double rawOffset = jsonObj.getDouble("rawOffset");
        String tzName = jsonObj.getString("timeZoneName");
//        String dstOffset = jsonObj.getString("dstOffset");

        double UTC= rawOffset/60/60;
        System.out.println("Hours: " + Double.toString(UTC) );
        return tzName;
    }

    static public String getUTCoffset(String latlng) throws Exception{
        //(38.839645,-77.42234599999999)
        System.out.println(System.currentTimeMillis());
        double seconds = System.currentTimeMillis() / 1000.0;
        System.out.println(seconds);
        String formattedLatLng = latlng.replaceAll("[()]", "").replaceAll("lat/lng: ", "");
        System.out.println(formattedLatLng);
        String url = "https://maps.googleapis.com/maps/api/timezone/json" +
                "?location=" + formattedLatLng +
                "&timestamp=" + seconds +
                "&key=" + GOOGLE_API_SERVER_KEY;


        URL obj = new URL(url);
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();

        // optional default is GET
        con.setRequestMethod("GET");

        //add request header
        con.setRequestProperty("User-Agent", USER_AGENT);

        int responseCode = con.getResponseCode();
        System.out.println("\nSending 'GET' request to URL : " + url);
        System.out.println("Response Code : " + responseCode);

        BufferedReader in = new BufferedReader(
                new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuffer response = new StringBuffer();

        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();

        //print result

        JSONObject jsonObj = new JSONObject(response.toString());
        System.out.println(jsonObj );
        Double rawOffset = jsonObj.getDouble("rawOffset");
        String tzName = jsonObj.getString("timeZoneName");
//        String dstOffset = jsonObj.getString("dstOffset");

        double UTC= rawOffset/60/60;
        System.out.println("Hours: " + Double.toString(UTC) );
        return tzName + ", GMT" + Double.toString(UTC);
    }



    // SAMPLE HTTP GET request
    private void sendGet() throws Exception {

        String url = "http://www.google.com/search?q=mkyong";

        URL obj = new URL(url);
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();

        // optional default is GET
        con.setRequestMethod("GET");

        //add request header
        con.setRequestProperty("User-Agent", USER_AGENT);

        int responseCode = con.getResponseCode();
        System.out.println("\nSending 'GET' request to URL : " + url);
        System.out.println("Response Code : " + responseCode);

        BufferedReader in = new BufferedReader(
                new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuffer response = new StringBuffer();

        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();

        //print result
        System.out.println(response.toString());

    }

    // HTTP POST request
    private void sendPost() throws Exception {

        String url = "https://selfsolve.apple.com/wcResults.do";
        URL obj = new URL(url);
        HttpsURLConnection con = (HttpsURLConnection) obj.openConnection();

        //add reuqest header
        con.setRequestMethod("POST");
        con.setRequestProperty("User-Agent", USER_AGENT);
        con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");

        String urlParameters = "sn=C02G8416DRJM&cn=&locale=&caller=&num=12345";

        // Send post request
        con.setDoOutput(true);
        DataOutputStream wr = new DataOutputStream(con.getOutputStream());
        wr.writeBytes(urlParameters);
        wr.flush();
        wr.close();

        int responseCode = con.getResponseCode();
        System.out.println("\nSending 'POST' request to URL : " + url);
        System.out.println("Post parameters : " + urlParameters);
        System.out.println("Response Code : " + responseCode);

        BufferedReader in = new BufferedReader(
                new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuffer response = new StringBuffer();

        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();

        //print result
        System.out.println(response.toString());

    }




}
