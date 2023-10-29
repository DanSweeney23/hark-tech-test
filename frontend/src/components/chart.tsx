import { ConsolidatedDataResponse } from "../api/models"
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function isAnomaly(time: number, data: ConsolidatedDataResponse) {
  const dataPoint = data.energy.filter(item => item.time === time)[0];
  if (dataPoint == undefined) return false;
  return dataPoint.isAnomaly;
}

function getValueSuffix(columnName: string) {
  switch (columnName) {
    case 'energy consumption':
      return 'kW';
    case 'temperature':
      return '°C';
    case 'humidity':
      return 'g/m3';
  }
  return '';
}

export default function (props: { data: ConsolidatedDataResponse }) {
  const getChartOptions = (data: ConsolidatedDataResponse) => ({
    title: {
      text: 'Energy Consumption & Weather Data'
    },
    tooltip: {
      formatter: function (this: Highcharts.TooltipFormatterContextObject) {
        const currentDatetime = parseInt(this.points![0].x!.toString())
        const anomaly = isAnomaly(currentDatetime, data);

        const lines = this.points!.map(p => `
          <br>
          <span style="font-weight: bold;color: ${p.series.color}">${p.series.name}:</span> 
          ${p.y} ${getValueSuffix(p.series.name)}
          </span>`
        )

        const dateText = `<span>${new Date(currentDatetime).toLocaleString()}</span><br>`;
        const valuesText = lines.reduce((total, current) => total += current, '');
        const anomalyText = anomaly ? `<br><br> <span style="color:red;font-weight:bold">Anomaly</span>` : '';
        const text = dateText + valuesText + anomalyText;

        console.log(text)
        return text;
      },
      shared: true
    },
    xAxis: {
      type: 'datetime'
    },
    series: [
      { name: 'energy consumption', data: data.energy.map(item => [item.time, item.consumption]) },
      { name: 'temperature', data: data.weather.map(item => [item.time, item.averagetemperature]) },
      { name: 'humidity', data: data.weather.map(item => [item.time, item.averagehumidity]) }
    ]
  });

  return (
    <>
      <div style={{ width: '800px' }}>
        {props.data ? <HighchartsReact
          highcharts={Highcharts}
          options={getChartOptions(props.data)}
        /> : ''}
      </div>
    </>
  )
}