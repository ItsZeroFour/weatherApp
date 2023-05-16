import React, { useEffect, useRef, useState } from "react";
import forgotpasswordImg from "../../../../images/forgotpassword/forgotpassword.png";
import emailjs from "@emailjs/browser";
import { uppercaseLetters, figures } from "../../../../data/registration";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase/firebase-config";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [accountIsRegistered, setAccountIsRegistered] = useState(false);
  const [wait, setWait] = useState(false);
  const [users, setUsers] = useState([]);
  const [randomCode, setRandomCode] = useState("");

  const form = useRef();

  const userCollectionRef = collection(db, "users");
  const forgotPasswordCodeCollectionRef = collection(db, "forgotPasswordCode");

  useEffect(() => {
    const getCodes = async () => {
      const data = await getDocs(userCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getCodes();
  }, []);

  // Check if user not registered
  useEffect(() => {
    Object.keys(users).length !== 0 &&
    users.find((data) => data?.email === email)?.id !== undefined
      ? setAccountIsRegistered(true)
      : setAccountIsRegistered(false);
  }, [users, email]);

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

  const submitButton = async (event) => {
    event.preventDefault();

    if (accountIsRegistered) {
      setWait(true);

      localStorage.setItem("forgotPasswordEmail", email);

      await addDoc(forgotPasswordCodeCollectionRef, {
        email: email,
        code: randomCode,
      });

      // Send Email
      emailjs
        .sendForm(
          "service_5zogeac",
          "template_kcrn6mh",
          form.current,
          "Bte1EjapjDkuVt8Kb"
        )
        .then(
          () => {
            setWait(false);
            window.location.href = "/weatherApp/signIn/forgot-password/code";
          },
          (error) => {
            console.log(error.text);
          }
        );
    }
  };

  return (
    <div className="forgotpassword">
      <form className="forgotpassword__form" ref={form}>
        <img src={forgotpasswordImg} alt="forgotpassword Img" />

        <div className="forgotpassword__form--block">
          <h1>Forgot password?</h1>
          <p>Enter the email addres associated with your account</p>
          <input
            type="email"
            name="to_name"
            placeholder="Enter Email Addres"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
          />

          <input
            type="text"
            name="code"
            value={randomCode}
            style={{ display: "none" }}
          />

          {!accountIsRegistered && (
            <p className="account-not-registered">
              An account with such an email was not found! Enter your email or{" "}
              <Link to="/weatherapp/registration">register</Link>
            </p>
          )}

          {accountIsRegistered && email !== "" ? (
            <button onClick={!wait ? submitButton : console.log("")}>
              {!wait ? "Next" : "Wait..."}
            </button>
          ) : (
            <button style={{ opacity: 0.8 }} disabled>
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
