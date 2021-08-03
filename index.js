const express = require('express');
const app = express();
const port = 4000;
const axios = require('axios');
const API_KEY = '08ccfeacf7ec9884fbc4a65036e055fc'
const cors = require('cors')

app.use(cors())


app.get('/get-weather', async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${'current,minutely,alerts'}&units=metric&appid=${API_KEY}`);
    res.json({
      name: '',
      data
    })
  } catch (error) {
    res.status(404)
  }
});


app.get('/search', async (req, res) => {
  const { q } = req.query;
  try {
    const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${q}&appid=${API_KEY}`);
    const { lat, lon } = response.data[0];
    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${'current,minutely,alerts'}&units=metric&appid=${API_KEY}`);
    res.json({
      name: response.data[0].name,
      data
    })
  } catch (error) {
    res.status(404)
  }
});


app.listen(port, () => console.log(`Weather App is running on port ${port}!`))