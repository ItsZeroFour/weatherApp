import React, { useEffect, useState } from "react";
import signInImg from "../../../images/signIn/signIn.png";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebase-config";

const SingIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [getUser, setGetUser] = useState({});
  const [uncurrentPassword, setUncurrentPassword] = useState();

  const userCollectionRef = collection(db, "users");

  useEffect(() => {
    const getCodes = async () => {
      const data = await getDocs(userCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getCodes();
  }, []);

  const signInOnClick = (event) => {
    event.preventDefault();

    Object.keys(users).length !== 0
      ? setGetUser(users.find((data) => data.email === email))
      : setGetUser(undefined);

    if (getUser !== undefined && getUser.password === password) {
      localStorage.setItem("userEmail", email);
      window.location.href = "/weatherApp/";
    } else {
      setUncurrentPassword(true);
    }
  };

  return (
    <div className="signIn">
      <form className="signIn__form">
        <img src={signInImg} alt="signIn img" />

        <div className="signin__form-block">
          <label htmlFor="signin-email">Email</label>
          <input
            id="signin-email"
            type="email"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
          />
        </div>

        <div className="signin__form-block">
          <label htmlFor="signin-password">Password</label>
          <input
            id="signin-password"
            type="password"
            onChange={(event) => setPassword(event.target.value)}
            value={password}
          />
          <Link to="/signIn/forgot-password">Forgot password</Link>
        </div>

        {email !== "" && password !== "" ? (
          <button onClick={signInOnClick}>Sign In</button>
        ) : (
          <button disabled style={{ opacity: 0.8, cursor: "auto" }}>
            Sign In
          </button>
        )}

        {getUser === undefined && <p>User not found!</p>}

        {uncurrentPassword && getUser !== undefined && (
          <p>Uncurrent password!</p>
        )}
      </form>
    </div>
  );
};

export default SingIn;
