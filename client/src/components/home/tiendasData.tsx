interface ITiendas {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export const tiendasData: ITiendas[] = [
  {
    id: 1,
    name: 'Tienda Barranquilla Principal',
    latitude: 11.001643604812687,
    longitude: -74.81665954890138,
  },
  {
    id: 2,
    name: 'Tienda Barranquilla Plaza Catalunya',
    latitude: 11.009774250972912,
    longitude: -74.81215193217375,
  },
  {
    id: 3,
    name: 'Tienda Cartagena',
    latitude: 10.483448416336916,
    longitude: -75.54792403322622,
  },
  {
    id: 4,
    name: 'Tienda Santa Marta',
    latitude: 11.25103483392713,
    longitude: -74.20306641370196,
  },
  {
    id: 5,
    name: 'Tienda Montería',
    latitude: 8.864643815918871,
    longitude: -75.89430520648305,
  },
  {
    id: 6,
    name: 'Tienda Cali',
    latitude: 3.4133032622546957,
    longitude: -76.52924430521858,
  },
];
