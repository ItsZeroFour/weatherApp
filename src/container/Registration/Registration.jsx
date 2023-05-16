import React, { useEffect, useRef, useState } from "react";
import checklist from "../../images/registration/Checklist.png";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { uppercaseLetters, figures } from "../../data/registration";
import { db } from "../../firebase/firebase-config";
import { addDoc, collection, getDocs } from "firebase/firestore";
import Header from "../../components/header/Header";

const Registration = () => {
  const [password, setPassword] = useState(() => {
    const getSavedValue = localStorage.getItem("password");
    const initialValue = getSavedValue;
    return initialValue || "";
  });
  const [userEmail, setUserEmail] = useState(() => {
    const getSavedValue = localStorage.getItem("userEmail");
    const initialValue = getSavedValue;
    return initialValue || "";
  });
  const [randomCode, setRandomCode] = useState("");
  const [wait, setWait] = useState(false);
  const [users, setUsers] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);

  // Collections
  const registrationCodeCollectionRef = collection(db, "registrationCode");
  const usersCollectionRef = collection(db, "users");

  const form = useRef();

  const lettersAndFigures = uppercaseLetters.concat(figures);

  // Create random code generator
  useEffect(() => {
    let randomCode = "";

    for (let i = 0; i < 6; i++) {
      let generateRandomIndex = Math.floor(
        Math.random() * lettersAndFigures.length
      );
      randomCode += lettersAndFigures[generateRandomIndex];
    }

    setRandomCode(randomCode);
  }, []);

  // Found current user
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
  }, []);

  useEffect(() => {
    Object.keys(users).length !== 0 &&
    users.find((data) => data.email === userEmail) === undefined
      ? setIsRegistered(false)
      : setIsRegistered(true);
  }, [userEmail]);

  // Registration button
  const registerButtonOnClick = async (event) => {
    event.preventDefault();

    if (!isRegistered) {
      setWait(true);

      localStorage.setItem("password", password);
      localStorage.setItem("userEmail", userEmail);

      await addDoc(registrationCodeCollectionRef, {
        email: localStorage.getItem("userEmail"),
        code: randomCode,
      });

      emailjs
        .sendForm(
          "service_5zogeac",
          "template_kcrn6mh",
          form.current,
          "Bte1EjapjDkuVt8Kb"
        )
        .then(
          () => {
            window.location.href = "/weatherApp/registration/codeauth";
          },
          (error) => {
            console.log(error.text);
          }
        );
    } else {
      return;
    }
  };

  return (
    <div className="registartion">
      <Header />
      <form className="registartion__form" ref={form}>
        <img src={checklist} alt="registration img" />

        <div className="registration__content">
          <div className="registration__text">
            <h3>Start for free</h3>
            <h1>Sign up to WeatherApp🚪.</h1>
            <h3>
              Already a member? <Link to="/signin">Log in</Link>
            </h3>
          </div>

          <div className="registration__inputs">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              name="to_name"
              onChange={(event) => setUserEmail(event.target.value)}
              value={userEmail}
              placeholder="name@mail.com"
            />

            {isRegistered && <p>Account with this email already registered</p>}

            <input
              type="text"
              name="code"
              value={randomCode}
              style={{ display: "none" }}
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              onChange={(event) => setPassword(event.target.value)}
              value={password}
              placeholder="6+ Characters"
            />

            {password.length >= 6 &&
            userEmail.includes("@") &&
            !isRegistered ? (
              <button
                onClick={!wait ? registerButtonOnClick : console.log("")}
                // disabled={wait}
                type="submit"
              >
                {!wait ? "Create account" : "Plase wait..."}
              </button>
            ) : (
              <button disabled style={{ opacity: 0.8 }}>
                Create an account
              </button>
            )}
          </div>

          <p className="sign-in__text">
            Already have an account? <Link to="/signIn">Sign In</Link>
          </p>

          <p className="registration__bottom-text">
            Please read <Link to="/privacyPolicy">Privacy policy</Link> and{" "}
            <Link to="/terms">Terms of service</Link> before proceeding with
            your registration.
          </p>
        </div>
      </form>
    </div>
  );
};

export default Registration;
