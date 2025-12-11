import { useMemo } from 'react'
import { DataTable } from './components/DataTable'
import { generateUsers } from './utils/generateData'
import './App.css'

function App() {
  const data = useMemo(() => generateUsers(500), []);

  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '1400px',
      margin: '0 auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: '0 0 8px 0', color: '#333' }}>
          User Data Table
        </h1>
      </div>
      <DataTable data={data} />
    </div>
  )
}

export default App
