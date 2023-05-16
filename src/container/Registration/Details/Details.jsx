import React, { useState } from "react";
import MobileLogin from "../../../images/registration/Mobil-login.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase/firebase-config";
import Header from "../../../components/header/Header";

const Details = () => {
  const [userName, setUserName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userPicture, setUserPicture] = useState("");
  const [maxFileSize, setMaxFileSize] = useState(false);
  const [wait, setWait] = useState(false);
  // const [users, setUsers] = useState([]);
  const userCollectionRef = collection(db, "users");

  if (JSON.parse(localStorage.getItem("codeAuthIsTyped")) === false) {
    window.location.href = "/weatherApp";

    console.log('f');
  }

  const fileReader = new FileReader();
  fileReader.onloadend = () => {
    setUserPicture(fileReader.result);
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

  const registrationUser = async (event) => {
    event.preventDefault();

    setWait(true);

    await addDoc(userCollectionRef, {
      email: localStorage.getItem("userEmail"),
      password: localStorage.getItem("password"),
      picture: userPicture,
      name: userName,
      lastName: userLastName,
    });

    // // Set user id on local storage
    // const data = await getDocs(userCollectionRef);
    // setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

    // localStorage.setItem(
    //   "userId",
    //   users.find((data) => data?.email === localStorage.getItem("userEmail")).id
    // );

    // Other
    localStorage.removeItem("password");
    // localStorage.removeItem("userEmail");
    localStorage.setItem("codeAuthIsTyped", false);

    setWait(false);

    window.location.href = "/weatherApp";
  };

  return (
    <div className="details">
      <Header />
      <form className="details__form">
        <div className="detaild__form-inputs">
          <input
            id="file"
            type="file"
            accept=".jpg, .png, .jpeg"
            style={{ display: "none" }}
            onChange={handleSubmit}
          />
          <label className="details__picture" htmlFor="file">
            {userPicture !== "" ? (
              <img src={userPicture} alt="user picture" />
            ) : (
              <FontAwesomeIcon icon={faCamera} />
            )}
          </label>

          <div className="input__wrapper">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              onChange={(event) => setUserName(event.target.value)}
              value={userName}
            />
          </div>

          <div className="input__wrapper">
            <label htmlFor="lastname">Last Name</label>
            <input
              id="lastname"
              type="text"
              onChange={(event) => setUserLastName(event.target.value)}
              value={userLastName}
            />
          </div>

          {userName !== "" &&
          userLastName !== "" &&
          userPicture !== "" &&
          !maxFileSize ? (
            <button
              type="submit"
              onClick={!wait ? registrationUser : console.log("")}
            >
              {!wait ? "SIGN UP" : "Plase wait..."}
            </button>
          ) : (
            <button type="submit" disabled style={{ opacity: 0.8 }}>
              SIGN UP
            </button>
          )}

          {maxFileSize && (
            <p style={{ marginTop: "1rem", textAlign: "center" }}>
              max file size!
            </p>
          )}

          <a
            className="code-auth__link"
            href="https://vk.com/nullbebra"
            target="_blank"
          >
            Zero Dev
          </a>
        </div>

        <img src={MobileLogin} alt="Details Img" />
      </form>
    </div>
  );
};

export default Details;
