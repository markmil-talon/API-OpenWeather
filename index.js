import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const apiKey = "681e00f761c84989d889fbe011394228";
const weatherURL = "https://api.openweathermap.org/"

// Geo url:
// "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}"
// Weather url:
// "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}"

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
   extended: true
}));

app.get("/", (req, res) => {
   res.render("index.ejs");
});

app.post("/", async (req, res) => {
   const cityI = req.body.city;
   if (cityI.trim() == "") {
      res.render("index.ejs", {
         htmlJSON: "Cannot find data."
      });
   } else {
      try {
         const geoResult = await axios.get(weatherURL + `geo/1.0/direct?q=${cityI}&limit=5&appid=${apiKey}`);
         const weatherResult = await axios.get(weatherURL + `data/2.5/weather?lat=${geoResult.data[0].lat}&lon=${geoResult.data[0].lon}&appid=${apiKey}`);
         res.render("index.ejs", {
            htmlCity: cityI,
            htmlJSON: weatherResult.data
         });
      } catch (error) {
         res.render("index.ejs", {
            htmlJSON: "Cannot find data."
         });
      }
   }
});

app.listen(port, () => {
   console.log(`Listening on port ${port}.`);
});