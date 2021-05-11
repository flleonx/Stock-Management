import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import "./style/Home.css";
import { tiendasData } from "../components/home/tiendasData";

const Home = () => {
  const [a, setA] = useState("");
  const handleClick = () => {
    console.log("EEEEEEEEEEEEEEEEE");
  };

  return (
    <div className="general-container-home">
      <h2 className="general-container-home__h2">Dashboard</h2>
      <p className="general-container-home__p">
        ¡Bienvenido! En el siguiente mapa hay un marcador para cada de las seis
        tiendas. Utiliza el scroll del mouse para variar el Zoom del mapa y ver
        todos los marcadores.
      </p>
      <MapContainer
        center={[10.9878, -74.7889]}
        zoom={9}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {tiendasData.map((tienda: any) => (
            <Marker
              key={tienda.id}
              position={[tienda.latitude, tienda.longitude]}
            />
        ))}
      </MapContainer>
    </div>
  );
};

export default withRouter(Home);
