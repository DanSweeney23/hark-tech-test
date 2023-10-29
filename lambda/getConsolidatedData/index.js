const AWS = require("aws-sdk");
const AthenaExpress = require("athena-express");
const athenaExpressConfig = { aws: AWS };
const athenaExpress = new AthenaExpress(athenaExpressConfig);

function parseTimestamp(timestamp) {
  return new Date(timestamp.substring(0, 23)).getTime();
}

exports.handler = async function (event) {
  const energyQuery = `
    SELECT 
      from_iso8601_timestamp(ed.timestamp) as timestamp, 
      ed.consumption, 
      CASE WHEN a.consumption IS NULL THEN 0 ELSE 1 END as isAnomaly
     FROM "hark_database"."half_hourly_energy_data" ed
     LEFT OUTER JOIN "hark_database"."half_hourly_energy_data_anomalies" a
      ON a.timestamp = ed.timestamp;
  `;

  const weatherQuery = `
    SELECT
      parse_datetime(date,'dd/MM/yyyy H:m') as timestamp,
      averagetemperature,
      averagehumidity
    FROM "hark_database"."weather";
  `;

  const averageConsumptionQuery = `
    SELECT
      SUM(consumption)/COUNT(*) as averageconsumption
    FROM "hark_database"."half_hourly_energy_data"
  `;

  const averageTemperatureQuery = `
    SELECT 
      SUM(averagetemperature)/COUNT(*) as averagetemperature,
      SUM(averagehumidity)/COUNT(*) as averagehumidity
    FROM "hark_database"."weather"
  `

  const promises = [
    athenaExpress.query(energyQuery),
    athenaExpress.query(weatherQuery),
    athenaExpress.query(averageConsumptionQuery),
    athenaExpress.query(averageTemperatureQuery)
  ];

  const results = await Promise.all(promises);

  console.log(JSON.stringify(results))

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      energy: results[0].Items.map(item => ({ ...item, time: parseTimestamp(item.timestamp) })),
      weather: results[1].Items.map(item => ({ ...item, time: parseTimestamp(item.timestamp) })),
      averageconsumption: results[2].Items[0].averageconsumption,
      averagetemperature: results[3].Items[0].averagetemperature,
      averagehumidity: results[3].Items[0].averagehumidity
    })
  };

  return response;
}