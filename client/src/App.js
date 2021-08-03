import React, { useState, useEffect } from 'react';
import moment from 'moment';

const App = () => {

  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [hourlyData, setHourlyData] = useState(false);
  const [inputValue, setInputValue] = useState('');


  const getData = async () => {
    if (lat && long) {
      await fetch(`http://localhost:4000/get-weather?lat=${lat}&lon=${long}`)
        .then(res => res.json())
        .then(result => {
          setFullData(result)
        });
    }
  };


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLat(position.coords.latitude);
      setLong(position.coords.longitude);
    });
    getData()
  }, [lat, long]);

  const showHourlyData = (timestamp) => {
    const fData = fullData.data;
    const d = fData?.hourly?.filter(hd => moment.unix(timestamp).isSame(moment.unix(hd.dt), "day"));
    setShowModal(true);
    setHourlyData(d)
  }

  const onCloseIconClick = () => {
    setShowModal(false)
  }

  const onInputValueChange = (e) => {
    setInputValue(e.target.value)
  }

  const onSearchSubmit = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:4000/search?q=${inputValue}`)
      .then(res => res.json())
      .then(result => {
        setFullData(result)
        setInputValue('')
      });
  }

  return (
    <div className="weather_app">

      <div className="search">
        <form onSubmit={onSearchSubmit}>
          <input type="text" value={inputValue} onChange={onInputValueChange} placeholder="Search for city name or state code or country code" />
          <button type="submit">Search</button>
        </form>
      </div>

      <div>
        <h1 style={{ textAlign: 'center' }}>{fullData?.name}</h1>
      </div>

      <div className="weather_card_container">
        {
          fullData?.data?.daily?.map(data =>
            <div className="weather_card">
              <div> {new Date(data.dt * 1000).toLocaleDateString("en", { weekday: "long", })}</div>
              <div>{new Date(data.dt * 1000).toLocaleDateString('en-GB')}</div>
              <img src={`http://openweathermap.org/img/w/${data.weather[0].icon}.png`} alt="" />
              <div>{data.temp.day.toFixed(0)} °C</div>

              <button onClick={() => showHourlyData(data.dt)}>Show hourly Data</button>
            </div>
          )
        }


        {showModal &&
          <div className="modal_backdrop">
            <div className="modal_container">
              <span className="modal_close" onClick={onCloseIconClick}>X</span>
              <div className="modal_body">
                {hourlyData.length > 0 ? hourlyData.map(hd =>
                  <div className="hourly_data_list">
                    <span>{moment.unix(hd.dt).format("LLL")}</span>
                    <span className="hourly_data_list_desc">{hd.weather[0].description} <img src={`http://openweathermap.org/img/w/${hd.weather[0].icon}.png`} alt="" /></span>
                  </div>
                ) :
                  <div className="no_data_available">
                    <h3>No hourly forecast available for this day.</h3>
                  </div>
                }
              </div>
            </div>
          </div>
        }

      </div>
    </div>
  )
}

export default App
