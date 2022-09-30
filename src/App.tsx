import { useCallback, useEffect, useState } from 'react';
import './App.css';

const SECOND = 1;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

function App() {
  const [count, setCount] = useState(0);
  const [timer, setTimer] = useState(false);
  const [reset, setReset] = useState(false);

  let timeoutId: number = 0;

  useEffect(() => {
    if (reset) {
      setCount(0);
      return;
    }
    if (timer && !reset) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setCount(count + SECOND), 1000);
    }
  }, [timer, count, reset]);

  const resetTimer = () => {
    setReset(true);
    setTimer(false);
  };

  return (
    <>
      <h1>Timer</h1>
      <p>{count}</p>
      <button
        onClick={() => {
          setTimer(!timer);
          setReset(false);
        }}
      >
        {' '}
        {!timer ? 'Start' : 'Stop'}{' '}
      </button>
      <button onClick={resetTimer}>Reset</button>
    </>
  );
}

export default App;
