import { useConsolidatedDataRequest } from "../api/requests";

export default function () {
  const { data } = useConsolidatedDataRequest();

  return (
    <>
      {
        data !== null ?
          <div>
            <p>Average consumption: {data?.averageconsumption} kWh</p>
            <p>Average temperature: {data?.averagetemperature} °C</p>
            <p>Average humidity: {data?.averagehumidity} g/m3</p>
          </div>
          : ''
      }
    </>

  )
}