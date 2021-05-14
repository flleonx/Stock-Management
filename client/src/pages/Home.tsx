import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import {Chart} from 'react-google-charts';

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
            eventHandlers={{
              click: () => {
                console.log(tienda);
              },
            }}
          />
        ))}
      </MapContainer>
      <Chart
        width={"500px"}
        height={"300px"}
        chartType="Bar"
        loader={<div>Loading Chart</div>}
        data={[
          ["Year", "Sales"],
          ["2000", 1000],
          ["2001", 1170],
          ["2002", 660],
          ["2003", 1030],
          ["2014", 1000],
          ["2015", 1170],
          ["2016", 660],
          ["2017", 1030],
          ["2014", 1000],
          ["2015", 1170],
          ["2016", 660],
          ["2017", 1030],
          ["2014", 1000],
          ["2015", 1170],
          ["2016", 660],
          ["2017", 1030],
          ["2014", 1000],
          ["2015", 1170],
          ["2016", 660],
          ["2017", 1030],
          ["2014", 1000],
          ["2015", 1170],
          ["2016", 660],
          ["2017", 1030],
          ["2014", 1000],
          ["2015", 1170],
          ["2016", 660],
          ["2017", 1030],
        ]}
        options={{
          // Material design options
          chart: {
            title: "Company Performance",
            subtitle: "Sales, Expenses, and Profit: 2014-2017",
          },
        }}
        // For tests
        rootProps={{ "data-testid": "2" }}
      />
    </div>
  );
};

export default withRouter(Home);
