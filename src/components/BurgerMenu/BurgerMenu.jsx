import {
  faBars,
  faGear,
  faLocationDot,
  faTableCellsLarge,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const BurgerMenu = () => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="burger-menu">
      <FontAwesomeIcon icon={faBars} onClick={() => setOpenMenu(!openMenu)} />

      {openMenu && (
        <div className="burger-menu__content">
          <div className="burger-menu__icon">
            <FontAwesomeIcon
              icon={faBars}
              onClick={() => setOpenMenu(!openMenu)}
            />
          </div>

          <ul>
            <li>
              <FontAwesomeIcon icon={faTableCellsLarge} />
              <Link to="/">Dashboard</Link>
            </li>

            <li>
              <FontAwesomeIcon icon={faLocationDot} />
              <Link to="/settings">Settings</Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faGear} />
              <Link to="/location">Location</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default BurgerMenu;
