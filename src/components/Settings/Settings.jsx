import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faMoon,
  faThermometer3,
} from "@fortawesome/free-solid-svg-icons";
import useTheme from "../../hooks/useTheme";

const Settings = ({ setUnits, units, setLanguage, language, children }) => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [newPicture, setNewPicture] = useState("");
  const [maxFileSize, setMaxFileSize] = useState(false);
  const [compliteChanges, setCompliteChanges] = useState(false);
  const [wait, setWait] = useState(false);
  const [switchTheme, setSwitchTheme] = useState(() => {
    const getSavedValue = localStorage.getItem("themeSwitched");
    const initialValue = JSON.parse(getSavedValue);
    return initialValue || false;
  });
  const usersCollectionRef = collection(db, "users");

  const { typeTheme, setTypeTheme } = useTheme();

  useEffect(() => {
    localStorage.setItem("themeSwitched", switchTheme);
  }, [switchTheme]);

  useEffect(() => {
    if (switchTheme === true) {
      setTypeTheme("dark");
    } else {
      setTypeTheme("light");
    }
  }, [switchTheme]);

  const fileReader = new FileReader();
  fileReader.onloadend = () => {
    setNewPicture(fileReader.result);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const file = event.target.files[0];

    // If file size is larger than max file size
    if (file?.size < 1048487) {
      fileReader.readAsDataURL(file);
      setMaxFileSize(false);
    } else {
      setMaxFileSize(true);
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
  }, []);

  useEffect(() => {
    Object.keys(users).length !== 0 &&
      localStorage.getItem("userEmail") &&
      setUser(
        users.find((data) => data.email === localStorage.getItem("userEmail"))
      );
  }, [users]);

  const updateUserData = async (id, docData) => {
    const getUser = doc(usersCollectionRef, id);
    await setDoc(getUser, docData, { merge: true });
  };

  const editDoc = async () => {
    setWait(true);

    name !== "" && (await updateUserData(user.id, { name: name }));
    lastName !== "" && (await updateUserData(user.id, { lastName: lastName }));
    newPassword.length >= 6
      ? await updateUserData(user.id, { password: newPassword })
      : setError(true);
    newPicture !== "" &&
      (await updateUserData(user.id, { picture: newPicture }));

    name !== "" && setCompliteChanges(true);
    lastName !== "" && setCompliteChanges(true);
    newPassword.length >= 6 && setCompliteChanges(true);
    newPicture !== "" && setCompliteChanges(true);

    setWait(false);
  };

  const signOutHandleSubmit = () => {
    localStorage.removeItem("userEmail");
    window.location.href = "/weatherApp/";
  };

  return (
    <div className="settings">
      <Header />

      <div className="settings__container">
        <div className="settings__left-menu">
          {localStorage.getItem("userEmail") && user ? (
            <div>
              <label htmlFor="settings-file">
                {newPicture !== "" ? (
                  <img src={newPicture} alt="new user picture" />
                ) : (
                  <img src={user.picture} />
                )}
              </label>
              <input
                id="settings-file"
                type="file"
                accept=".png, .jpg, .jpeg"
                style={{ display: "none" }}
                onChange={handleSubmit}
              />

              {maxFileSize && <p>Max file size!</p>}
              <h2>
                {user.name} {user.lastName}
              </h2>
              <p>{user.email}</p>
              <button onClick={signOutHandleSubmit}>
                {language === "russian" ? "Выйти" : "Sign out"}
              </button>
            </div>
          ) : !localStorage.getItem("userEmail") ? (
            <p className="login-text">
              {language === "russian"
                ? "Пожалуйста, войдиет в аккаунт"
                : "Please log in"}
            </p>
          ) : (
            <p>{language === "russian" ? "Загрузка" : "Loading"}...</p>
          )}
        </div>

        <div className="settings__settings">
          {localStorage.getItem("userEmail") && user ? (
            <div>
              <div className="settings__inputs">
                <div className="settings__input">
                  <label htmlFor="name">
                    {language === "russian" ? "Имя" : "Name"}
                  </label>
                  <input
                    id="name"
                    type="text"
                    onChange={(event) => setName(event.target.value)}
                    placeholder={user.name}
                  />
                </div>

                <div className="settings__input">
                  <label htmlFor="lastname">
                    {language === "russian" ? "Фамилия" : "Last name"}
                  </label>
                  <input
                    id="lastname"
                    type="text"
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder={user.lastName}
                  />
                </div>
              </div>

              <div className="settings__new-password">
                <label htmlFor="new-password">
                  {language === "russian" ? "Новый пароль" : "New password"}
                </label>
                <input
                  type="password"
                  id="new-password"
                  placeholder="********"
                  onChange={(event) => setNewPassword(event.target.value)}
                />

                {error && (
                  <p>
                    {language === "russian"
                      ? "Такой пароль не поддерживается"
                      : "This password unsupported"}
                  </p>
                )}
              </div>
            </div>
          ) : !localStorage.getItem("userEmail") ? (
            <p className="login-text">
              {language === "russian"
                ? "Пожалуйста, войдите в аккаунт"
                : "Please log in"}
            </p>
          ) : (
            <p>{language === "russian" ? "Загрузка" : "Loading"}...</p>
          )}

          <div className="settings__language">
            <label htmlFor="settings-select">
              <FontAwesomeIcon icon={faGlobe} />{" "}
              {language === "russian" ? "Язык" : "Language"}
            </label>

            <select
              id="settings-select"
              onChange={(event) => setLanguage(event.target.value)}
            >
              <option value="english" selected={language === "english"}>
                English
              </option>
              <option value="russian" selected={language === "russian"}>
                Russian
              </option>
            </select>
          </div>

          <div className="settings__dark-mode">
            <label htmlFor="settings-dark-mode">
              <FontAwesomeIcon icon={faMoon} />{" "}
              {language === "russian" ? "Темная тема" : "Dark mode"}
            </label>
            <input
              id="settings-dark-mode"
              type="checkbox"
              onClick={() => setSwitchTheme(!switchTheme)}
              checked={switchTheme ? true : false}
            />
          </div>

          <div className="settings__units">
            <p>
              <FontAwesomeIcon icon={faThermometer3} />{" "}
              {language === "russian" ? "Единицы измерения" : "Units"}
            </p>
            <select onChange={(event) => setUnits(event.target.value)}>
              <option value="metric" selected={units === "metric"}>
                {language === "russian" ? "Цельсия" : "Celsius"}
              </option>
              <option value="standart" selected={units === "standart"}>
                {language === "russian" ? "Фаренгейты" : "Fahrenheit"}
              </option>
            </select>
          </div>

          {user && (
            <button
              className="settings__save"
              onClick={
                !wait
                  ? () => editDoc({ name: name, id: user.id })
                  : console.log("please wait")
              }
            >
              {!wait
                ? `${language === "russian" ? "Сохранить" : "Save"}`
                : `${language === "russian" ? "Подождите..." : "Wait..."}`}
            </button>
          )}

          {compliteChanges && (
            <p className="settings__alert">
              {" "}
              {language === "russian"
                ? "Все изменения были сохранены!"
                : "All changes has been saved!"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
