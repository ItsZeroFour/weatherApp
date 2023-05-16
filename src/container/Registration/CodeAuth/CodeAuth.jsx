import React, { useEffect, useState } from "react";
import { db } from "../../../firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";

const CodeAuth = () => {
  const [getUserInputCode, setGetUserInputCode] = useState("");
  const [codes, setCodes] = useState([]);
  const [codeAndEmail, setCodeAndEmail] = useState({});
  const [uncurrentCode, setUncurrentCode] = useState(false);
  const registrationCodeCollectionRef = collection(db, "registrationCode");

  useEffect(() => {
    const getCodes = async () => {
      const data = await getDocs(registrationCodeCollectionRef);
      setCodes(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getCodes();
  }, []);

  useEffect(() => {
    Object.keys(codes).length !== 0 &&
      setCodeAndEmail(codes.find((data) => data.code === getUserInputCode));
  }, [getUserInputCode]);

  const submitCode = (event) => {
    event.preventDefault();

    if (
      codeAndEmail !== undefined &&
      codeAndEmail.code === getUserInputCode &&
      codeAndEmail.email === localStorage.getItem("userEmail")
    ) {
      setCodeAndEmail(false);
      localStorage.setItem("codeAuthIsTyped", true);
      window.location.href = "/weatherApp/registration/details";
    } else {
      setUncurrentCode(true);
    }
  };

  return (
    <div className="code-auth">
      <h2>Enter Code</h2>
      <p>
        We sent the code to <span>{localStorage.getItem("userEmail")}</span> .
        Please enter it below for identification
      </p>

      <form className="code-auth__form">
        <input
          type="text"
          placeholder="Example: ABC123"
          onChange={(event) => setGetUserInputCode(event.target.value)}
          value={getUserInputCode}
        />
        <button type="submit" onClick={submitCode}>
          Next
        </button>
      </form>

      {uncurrentCode && (
        <p style={{ marginTop: "1rem" }}>Uncurrent code or try again later.</p>
      )}

      <a
        className="code-auth__link"
        href="https://vk.com/nullbebra"
        target="_blank"
      >
        Zero Dev
      </a>
    </div>
  );
};

export default CodeAuth;
