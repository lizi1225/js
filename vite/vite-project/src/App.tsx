import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import Header from './Header'
import styles from './index.module.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className={`App`}>
      <Header/>
      <button 
        bg="blue-400 hover:blue-500 dark:blue-500 dark:hover:blue-600"
        text="sm white"
        font="mono light"
        p="y-2 x-4"
        border="2 rounded blue-200"
      >
        Button
      </button>
      <div className="flex-c"></div>
    </div>
  )
}

export default App
