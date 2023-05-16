import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase/firebase-config";
import { days, months, ruDays, ruMonths } from "../../data/main/data";
import {
  faBell,
  faLocationDot,
  faMagnifyingGlass,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BurgerMenu from "../BurgerMenu/BurgerMenu";

const Header = ({ setQuery }) => {
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [currentTime, setCurrentTime] = useState("");
  const usersCollectionRef = collection(db, "users");

  const [city, setCity] = useState("");

  const handleSearchClick = (event) => {
    event.preventDefault();
    if (city !== "") setQuery({ q: city });
  };

  useEffect(() => {
    setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("ru"));
    }, 1000);
  }, []);

  // Date
  const daysOfTheWeek = new Date().getDay();
  const day = new Date().getDate();
  const month = new Date().getMonth();
  const year = new Date().getFullYear();

  // Get users and search current user
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

  const language = localStorage.getItem("language");

  return (
    <header className="main__header">
      <BurgerMenu />
      {currentTime !== "" ? (
        <div className="main__date">
          <h1>{currentTime.slice(0, -3)}</h1>
          <h3>
            {language === "russian"
              ? `${ruDays[daysOfTheWeek]}, ${day} ${ruMonths[month]}, ${year}`
              : `${days[daysOfTheWeek]}, ${day} ${months[month]}, ${year}`}
          </h3>
        </div>
      ) : (
        <p>{language === "russian" ? "Загрузка" : "Loading"}...</p>
      )}

      <form className="main__form">
        <div className="main__form-search">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <input
            className="main__search"
            type="text"
            placeholder={language === "russian" ? "Поиск" : "Search"}
            onChange={(event) => setCity(event.target.value)}
            value={city}
          />

          <button onClick={handleSearchClick}>
            {language === "russian" ? "Поиск" : "Search"}
          </button>
        </div>

        <div className="main__form-locate">
          <Link to="/location">
            <FontAwesomeIcon icon={faLocationDot} />
          </Link>
        </div>
      </form>
      {!localStorage.getItem("userEmail") ? (
        <div className="main__login-button">
          <Link to="/registration">
            <FontAwesomeIcon icon={faRightToBracket} />
          </Link>
        </div>
      ) : user?.picture !== "" ? (
        <div className="main__account">
          <FontAwesomeIcon icon={faBell} />
          <Link to="/settings">
            <img src={user?.picture} alt="avatar" />
          </Link>
        </div>
      ) : (
        <p>{language === "russian" ? "Загрузка" : "Loading"}...</p>
      )}
    </header>
  );
};

export default Header;
