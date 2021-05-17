import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { Chart } from "react-google-charts";
import L from "leaflet";
import Select from "react-select";
import Axios from "axios";

import { baseURL } from "../components/app/baseURL";
import iconShopImg from "../assets/shop.png";
import loadingImg from "../assets/Loading.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import monthsData from "../components/home/months.json";
import Modal from "../components/Modal";
import notifyImg from "../assets/notify.svg";

import "./style/Home.css";
import { tiendasData } from "../components/home/tiendasData";

const Home = () => {
  const [isShopClicked, setIsShopClicked] = useState<boolean>(false);
  const [infoShopClicked, setInfoShopClicked] = useState({ id: "", name: "" });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dataDatesFilter, setDataDatesFilter] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>("");
  const [percentageSales, setPercentageSales] = useState([["Shop", "Ventas"]]);
  const dashboardPieUrl: string = baseURL + "api/dashboard_pie";
  const dashboardDateFilterURL: string = baseURL + "api/dashboard_date_filter";

  useEffect(() => {
    Axios.post(dashboardPieUrl, {
      mes: "05",
    }).then((response: any) => {
      setPercentageSales(response.data);
    });
  }, []);

  function getIcon() {
    return L.icon({
      iconUrl: iconShopImg,
      iconSize: [30, 30],
    });
  }

  const handleChange = (optionSelected: any) => {
    const monthValue = optionSelected.value;
    Axios.post(dashboardPieUrl, {
      mes: monthValue,
    }).then((response: any) => {
      setPercentageSales(response.data);
    });
  };

  const handleFilter = () => {
    const startDateRef = document.getElementById(
      "start-date-picker"
    ) as HTMLInputElement;
    const endDateRef = document.getElementById(
      "end-date-picker"
    ) as HTMLInputElement;

    if (startDateRef.value !== "" || endDateRef.value !== "") {
      Axios.post(dashboardDateFilterURL, {
        fecha_inicial: startDateRef.value,
        fecha_final: endDateRef.value,
        idTienda: infoShopClicked.id,
      }).then((response: any) => {
        const dataDates = response.data;
        console.log(dataDates);
        if (dataDates.length > 1) {
          setDataDatesFilter(response.data);
        } else {
          setDataDatesFilter([]);
          setModalContent("No hay ventas en ese rango de fecha");
          setIsModalOpen(true);
        }
      });
    } else {
      setModalContent("Por favor, digite las fechas bien");
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent("");
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
            En este apartado puedes puedes ver las tiendas en el mapa. Si das
            click en una de las tiendas, en la esquina inferior derecha
            aparecerá información de las ventas de esta.
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
            En este apartado puedes ver el porcentaje de ventas de cada tienda.
            Además, puedes filtrar por mes.
          </p>
          <div className="month-filter-pie-chart-container">
            <div className="month-select-container">
              <Select
                options={monthsData}
                placeholder="Filtrar por mes"
                className="month-select-container__select"
                onChange={handleChange}
              />
            </div>
            <div className="pie-chart-container">
              <Chart
                width={"100%"}
                height={"100%"}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={percentageSales}
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
                  {infoShopClicked.name}. Para ver el gráfico de barras, utiliza
                  el filtro.
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
                    Filtrar por fecha
                  </button>
                </div>
                {dataDatesFilter.length === 0 && (
                  <div className="bar-chart-img-container">
                    <img src={loadingImg} alt="loading" />
                  </div>
                )}
                {dataDatesFilter.length !== 0 && (
                  <div className="bar-chart-container">
                    <Chart
                      width={"500px"}
                      height={"300px"}
                      chartType="Bar"
                      loader={<div>Loading Chart</div>}
                      data={dataDatesFilter}
                      options={{
                        chart: {
                          title:
                            "Gráfico de barras de las ventas de la tienda ",
                        },
                      }}
                      rootProps={{ "data-testid": "2" }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} closeModal={closeModal}>
        <h1 className="modalHome">{modalContent}</h1>
        <img className="modalHomeImg" src={notifyImg} alt="modalImg" />
      </Modal>
    </div>
  );
};

export default withRouter(Home);
