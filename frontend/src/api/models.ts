export type EnergyDatapoint = {
  timestamp: string,
  time: number,
  consumption: number,
  isAnomaly: number
};

export type WeatherDatapoint = {
  timestamp: string,
  time: number,
  averagetemperature: number,
  averagehumidity: number
};

export type ConsolidatedDataResponse = {
  energy: EnergyDatapoint[],
  weather: WeatherDatapoint[],
  averageconsumption: number,
  totalconsumption: number,
  averagetemperature: number,
  averagehumidity: number
};