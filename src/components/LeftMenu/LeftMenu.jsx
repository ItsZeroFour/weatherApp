import {
  faGear,
  faLocationDot,
  faTableCellsLarge,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

const LeftMenu = () => {
  return (
    <div className="left-menu">
      <ul>
        {[
          { icon: faTableCellsLarge, url: "/weatherapp/" },
          { icon: faLocationDot, url: "/weatherapp/location" },
          { icon: faGear, url: "/weatherapp/settings" },
        ].map((item, index) => (
          <li key={index + Math.random()}>
            <Link to={item.url}>
              <FontAwesomeIcon icon={item.icon} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeftMenu;
