import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { Chart } from "react-google-charts";
import L from "leaflet";
import iconShopImg from "../assets/shop.png";
import loadingImg from "../assets/Loading.svg";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import monthsData from "../components/home/months.json";

import "./style/Home.css";
import { tiendasData } from "../components/home/tiendasData";

const Home = () => {
  const [isShopClicked, setIsShopClicked] = useState<boolean>(false);
  const [infoShopClicked, setInfoShopClicked] = useState({ id: "", name: "" });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  function getIcon() {
    return L.icon({
      iconUrl: iconShopImg,
      iconSize: [30, 30],
    });
  }

  const handleChange = (optionSelected: any) => {
    console.log(optionSelected.value);
  };

  const handleFilter = () => {
    const startDateRef = document.getElementById(
      "start-date-picker"
    ) as HTMLInputElement;
    const endDateRef = document.getElementById(
      "end-date-picker"
    ) as HTMLInputElement;
    console.log(startDateRef.value);
    console.log(endDateRef.value);
    console.log(infoShopClicked.id);
  };

  return (
    <div className="general-container-home">
      <div className="navbar-home">
        <h2 className="navbar-home__h2">Dashboard</h2>
      </div>
      <div className="map-section">
        <div className="map-home-container">
          <h3>Mapa</h3>
          <p>
            En este apartado puedes hacer click sobre alguna de las tiendas para
            desplegar la información de esa tienda en específico.
          </p>
          <MapContainer
            center={[11.004462, -74.814401]}
            zoom={15}
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
                icon={getIcon()}
                eventHandlers={{
                  click: () => {
                    setInfoShopClicked(tienda);
                    setIsShopClicked(true);
                  },
                }}
              />
            ))}
          </MapContainer>
        </div>
        <div className="stats-home-container">
          <h3>Estadísticas</h3>
          <p>
            En este apartado puedes hacer click sobre alguna de las tiendas para
            desplegar la información de esa tienda en específico.
          </p>
          <div className="month-filter-pie-chart-container">
            <div className="month-select-container">
              <Select
                options={monthsData}
                placeholder="Filtrar por mes"
                onChange={handleChange}
              />
            </div>
            <div className="pie-chart-container">
              <Chart
                width={"400px"}
                height={"300px"}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={[
                  ["Shop", "Sales"],
                  ["Norte", 60],
                  ["Sur", 40],
                ]}
                options={{
                  title: "Total ventas",
                  is3D: true,
                }}
                rootProps={{ "data-testid": "1" }}
              />
            </div>
          </div>
          <div className="specific-stats-for-shops-container">
            {!isShopClicked && (
              <>
                <h3>Estadisticas especificas de la tienda</h3>
                <p>
                  Si haces click en uno de los iconos de tiendas que se
                  encuentran en el mapa, se desplegará aquí un diagrama de
                  barras sobre las ventas de la tienda en específico.
                </p>
                <div className="pie-chart-img-container">
                  <img src={loadingImg} alt="loading" />
                </div>
              </>
            )}
            {isShopClicked && (
              <>
                <h3>Ventas de la {infoShopClicked.name}</h3>
                <p>
                  En este apartado se muestra las ventas de la{" "}
                  {infoShopClicked.name}. Además, puedes filtrar las ventas por
                  fechas.{" "}
                </p>
                <div className="filter-date-container">
                  <DatePicker
                    selected={startDate}
                    onChange={(date: any) => {
                      setStartDate(date);
                    }}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Selecciona la fecha inicial"
                    className="start-date-picker"
                    id="start-date-picker"
                  />
                  <DatePicker
                    selected={endDate}
                    onChange={(date: any) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Selecciona la fecha final"
                    className="end-date-picker"
                    id="end-date-picker"
                  />
                  <button
                    className="btn"
                    id="filter-button"
                    onClick={handleFilter}
                  >
                    Filtrar
                  </button>
                </div>
                <div className="bar-chart-container">
                  <Chart
                    width={"500px"}
                    height={"300px"}
                    chartType="Bar"
                    loader={<div>Loading Chart</div>}
                    data={[
                      ["Fechas", "Ventas"],
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
                        title: "Gráfico de barras de las ventas de la tienda ",
                      },
                    }}
                    // For tests
                    rootProps={{ "data-testid": "2" }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Home);
