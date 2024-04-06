import { useState, useEffect } from 'react'
import './App.css'
import { getCounter, incrementCounter } from './counter';

const useCounter = (): [number, () => void] => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    getCounter().then(count => setCounter(count));
  }, []);

  const increment = () => {
    incrementCounter().then(count => setCounter(count));
  }

  return [counter, increment];
}

function App() {
  const [counter, increment] = useCounter();

  return (
    <>
      <div>
        <button onClick={() => increment()}>
            count is {counter}
          </button>
      </div>
    </>
  )
}

export default App
