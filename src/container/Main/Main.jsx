import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import Header from "../../components/header/Header";
import getFormattedWeatherData, {
  formatToLocalTime,
} from "../../data/main/weatherService";
import { iconUrlFromCode } from "../../data/main/weatherService";
// Images
import sunriseImg from "../../images/main/sunrise.png";
import sunsetImg from "../../images/main/sunset.png";
import noonImg from "../../images/main/noon.png";
import dayclockImg from "../../images/main/dayclock.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDroplet, faWind } from "@fortawesome/free-solid-svg-icons";

const Main = ({ setQuery, weather, units, language }) => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});

  const [sunrise, setSunrise] = useState(null);

  const usersCollectionRef = collection(db, "users");

  // Sunrise data
  useEffect(() => {
    const fetchSunrise = async () => {
      await fetch(
        `https://api.sunrise-sunset.org/json?lat=${weather.lat}&lng=${weather.lon}`
      )
        .then((res) => res.json())
        .then((json) => setSunrise(json.results));
    };

    fetchSunrise();
  }, [weather]);

  // Get users and get current user
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
  }, []);

  useEffect(() => {
    Object.keys(users).length !== 0 && localStorage.getItem("userEmail");
    setUser(
      users.find((data) => data.email === localStorage.getItem("userEmail"))
    );
  }, [users]);

  return (
    <div className="main">
      {weather ? (
        <div>
          <Header weather={weather} setQuery={setQuery} language={language} />
          <main className="main__main">
            <div>
              <h1 className="main__title">
                {user !== undefined
                  ? `Good morning, ${user.name}!`
                  : "Good morning!"}
              </h1>

              <ul className="main__list-daily">
                {weather.daily.map((data) => (
                  <li>
                    <img src={iconUrlFromCode(data.icon)} alt={data.main} />
                    <h2>{data.title}</h2>
                    <h3>
                      {data.temp.toFixed(0)}°{units === "metric" ? "C" : "F"}
                    </h3>
                  </li>
                ))}
              </ul>

              <div className="main__other">
                <div className="main__hourly">
                  <p>Hourly weather forecast</p>

                  <ul className="main__list-hourly">
                    {weather.hourly.map((data) => (
                      <li>
                        <img src={iconUrlFromCode(data.icon)} alt={data.main} />
                        <h2>{data.title}</h2>
                        <h3>
                          {data.temp.toFixed(0)}°
                          {units === "metric" ? "C" : "F"}
                        </h3>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="main__sunrise">
                  <p>Sunrise</p>

                  {sunrise ? (
                    <ul className="main__sunrise-list">
                      <li>
                        <img src={sunriseImg} alt="sunrise img" />

                        <div>
                          <p>Sunrise</p>
                          <h3>{sunrise.sunrise}</h3>
                        </div>
                      </li>

                      <li>
                        <img src={sunsetImg} alt="sunset img" />

                        <div>
                          <p>Sunset</p>
                          <h3>{sunrise.sunset}</h3>
                        </div>
                      </li>

                      <li>
                        <img src={noonImg} alt="solar noon img" />

                        <div>
                          <p>Solar noon</p>
                          <h3>{sunrise.solar_noon}</h3>
                        </div>
                      </li>

                      <li>
                        <img src={dayclockImg} alt="day length img" />

                        <div>
                          <p>Day length</p>
                          <h3>{sunrise.day_length}</h3>
                        </div>
                      </li>
                    </ul>
                  ) : (
                    <p>Loading...</p>
                  )}
                </div>
              </div>
            </div>

            <div className="main__right-panel">
              <h2>
                {weather.name}, {weather.country}
              </h2>

              <div className="main__right-panel--content">
                <img
                  src={iconUrlFromCode(weather.icon)}
                  alt={weather.details}
                />
                <p className="main__time">
                  {formatToLocalTime(weather.dt, weather.timezone)}
                </p>
                <h1 className="main__temp">
                  {weather.temp.toFixed(0)}°{units === "metric" ? "C" : "F"}
                </h1>
                <h2 className="main__details">{weather.details}</h2>

                <ul className="main__right-panel--list">
                  <li>
                    <span>
                      <FontAwesomeIcon icon={faWind} /> Wind
                    </span>
                    <p>{weather.speed} km/h</p>
                  </li>
                  <li>
                    <span>
                      <FontAwesomeIcon icon={faDroplet} /> Hum
                    </span>
                    <p>{weather.humidity} %</p>
                  </li>
                </ul>
              </div>
            </div>
          </main>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Main;
