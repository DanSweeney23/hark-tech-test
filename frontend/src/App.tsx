import './App.css'
import { useConsolidatedDataRequest } from './api/requests'

function App() {
  const { data, loading, error } = useConsolidatedDataRequest();

  return (
    <>
      <div>
        {error ? <p>An error has occured. Please try again.</p> : ''}
        {loading ? <p>Loading, please wait...</p> : ''}
        {data ? <p>{JSON.stringify(data)}</p> : ''}
      </div>
    </>
  )
}

export default App
