import {
  faBars,
  faGear,
  faLocationDot,
  faRightToBracket,
  faTableCellsLarge,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase/firebase-config";

const BurgerMenu = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);

  const usersCollectionRef = collection(db, "users");

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

  return (
    <div className="burger-menu">
      <FontAwesomeIcon
        className="burger-menu__open"
        icon={faBars}
        onClick={() => setOpenMenu(!openMenu)}
      />

      {openMenu && (
        <div className="burger-menu__content">
          <div className="burger-menu__icon">
            <FontAwesomeIcon
              icon={faBars}
              onClick={() => setOpenMenu(!openMenu)}
            />
          </div>

          <div className="burger-menu__account">
            {user ? (
              <div className="burger-menu__account-content">
                <Link to="/weatherApp/settings">
                  <img src={user.picture} alt="user picture" />
                  <p>
                    {user.name} {user.lastName}
                  </p>
                </Link>
              </div>
            ) : (
              <div className="burger-menu__registration">
                <Link to="/weatherApp/registration">
                  <FontAwesomeIcon icon={faRightToBracket} />
                </Link>
              </div>
            )}
          </div>

          <ul>
            <li>
              <FontAwesomeIcon icon={faTableCellsLarge} />
              <Link to="/weatherApp/">Dashboard</Link>
            </li>

            <li>
              <FontAwesomeIcon icon={faGear} />
              <Link to="/weatherApp/settings">Settings</Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faLocationDot} />
              <Link to="/weatherApp/location">Location</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default BurgerMenu;
