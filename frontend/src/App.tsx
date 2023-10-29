import './App.css'
import { useConsolidatedDataRequest } from './api/requests';
import Chart from './components/chart'
import Stats from './components/stats'

function App() {
  const { loading, error } = useConsolidatedDataRequest();

  return (
    <>
      {error ? <p>An error has occured. Please try again.</p> : ''}
      {loading ? <p>Loading, please wait...</p> : ''}

      <Chart />
      <Stats />
    </>
  )
}

export default App
