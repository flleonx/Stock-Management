interface ITiendas {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export const tiendasData: ITiendas[] = [
  {
    id: 1,
    name: 'Tienda Sur',
    latitude: 11.001643604812687,
    longitude: -74.81665954890138,
  },
  {
    id: 0,
    name: 'Tienda Norte',
    latitude: 11.009774250972912,
    longitude: -74.81215193217375,
  },
];
