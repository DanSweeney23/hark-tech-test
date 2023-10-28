import { ConsolidatedDataResponse, useConsolidatedDataRequest } from "../api/requests";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function parseTimestamp(timestamp: string) {
  return new Date(timestamp.substring(0, 23)).getTime();
}

function getValueSuffix(columnName: string) {
  switch (columnName) {
    case 'energy consumption':
      return 'kWh';
    case 'temperature':
      return '°C';
    case 'humidity':
      return 'g/m3';
  }
  return '';
}

export default function () {
  const { data, loading, error } = useConsolidatedDataRequest();

  const getChartOptions = (data: ConsolidatedDataResponse) => ({
    title: {
      text: 'Energy Consumption & Weather Data'
    },
    tooltip: {
      formatter: function (this: Highcharts.TooltipFormatterContextObject) {
        const lines = this.points!.map(p => `
          </br>
            <span style="font-weight: bold;color: ${p.series.color}">${p.series.name}:</span> 
            ${p.y} ${getValueSuffix(p.series.name)}
          </span>`
        )
        const text = lines.reduce((total, current) => total += current, '');
        console.log(text)
        return `<span>${new Date(this.x!).toLocaleString()}</span>${text}`;
      },
      shared: true
    },
    xAxis: {
      type: 'datetime' // Other types are "logarithmic", "datetime" and "category"
    },
    series: [
      { name: 'energy consumption', data: data.energy.map(item => [parseTimestamp(item.timestamp), item.consumption]) },
      { name: 'temperature', data: data.weather.map(item => [parseTimestamp(item.timestamp), item.averagetemperature]) },
      { name: 'humidity', data: data.weather.map(item => [parseTimestamp(item.timestamp), item.averagehumidity]) }
    ]
  });

  return (
    <>
      <div>
        {error ? <p>An error has occured. Please try again.</p> : ''}
        {loading ? <p>Loading, please wait...</p> : ''}
        {data ? <HighchartsReact
          highcharts={Highcharts}
          options={getChartOptions(data)}
        /> : ''}
      </div>
    </>
  )
}