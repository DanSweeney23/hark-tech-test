const AWS = require("aws-sdk");
const AthenaExpress = require("athena-express");
const athenaExpressConfig = { aws: AWS }; 
const athenaExpress = new AthenaExpress(athenaExpressConfig);

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

  const promises = [
    athenaExpress.query(energyQuery),
    athenaExpress.query(weatherQuery)
  ];

  const results = await Promise.all(promises);
  
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      energy: results[0].Items,
      weather: results[1].Items
    })
  };

  return response;
}