import './App.css'
import { useConsolidatedDataRequest } from './api/requests';
import Chart from './components/chart'
import Stats from './components/stats'

function App() {
  const { data, loading, error } = useConsolidatedDataRequest();

  return (
    <>
      {error ? <p>An error has occured. Please try again.</p> : ''}
      {loading ? <p>Loading, please wait...</p> : ''}

      {data ? <Chart data={data} /> : ''}
      {data ? <Stats data={data} /> : ''}
    </>
  )
}

export default App
