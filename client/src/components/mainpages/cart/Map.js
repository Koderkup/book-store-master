import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const Map = () => {
  const position = [55.162438, 30.212319];
  return (
    <MapContainer
      className="leaflet-container"
      center={position}
      zoom={23}
      style={{ height: "400px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position}>
        <Popup>Витебск, ул. Воинов-Интернационалистов, 7</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
