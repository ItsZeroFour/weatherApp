import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Map, YMaps } from "@pbe/react-yandex-maps";
import React from "react";
import Header from "../../components/header/Header";

const MapLocation = () => {
  return (
    <YMaps>
      <Header />
      <div className="map__conatiner">
        <h2>
          Choose the location you need <FontAwesomeIcon icon={faLocationDot} />
        </h2>
        <Map
          className="map__location"
          defaultState={{ center: [55.75, 37.57], zoom: 9 }}
        />
      </div>
    </YMaps>
  );
};

export default MapLocation;
