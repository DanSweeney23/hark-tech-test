import { useConsolidatedDataRequest } from "../api/requests";

export default function () {
  const { data } = useConsolidatedDataRequest();

  return (
    <>
      {
        data !== null ?
          <div>
          <p>Average consumption: {data?.averageconsumption.toFixed(1)} kW</p>
            <p>Total consumption: {data?.totalconsumption.toFixed(1)} kWh</p>
            <p>Average temperature: {data?.averagetemperature.toFixed(1)} °C</p>
            <p>Average humidity: {data?.averagehumidity.toFixed(1)} g/m3</p>
          </div>
          : ''
      }
    </>

  )
}