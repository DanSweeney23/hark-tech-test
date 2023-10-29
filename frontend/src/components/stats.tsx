import { ConsolidatedDataResponse } from "../api/models";

export default function (props: { data: ConsolidatedDataResponse }) {

  return (
    <>
      {
        props.data !== null ?
          <div>
          <p>Average consumption: {props.data.averageconsumption.toFixed(1)} kW</p>
            <p>Total consumption: {props.data.totalconsumption.toFixed(1)} kWh</p>
            <p>Average temperature: {props.data.averagetemperature.toFixed(1)} °C</p>
            <p>Average humidity: {props.data.averagehumidity.toFixed(1)} g/m3</p>
          </div>
          : ''
      }
    </>

  )
}