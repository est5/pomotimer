import { useCallback, useEffect, useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [timer, setTimer] = useState(false);
  const [reset, setReset] = useState(false);
  const [result, setResult] = useState('0:00');

  let timeoutId: number = 0;

  useEffect(() => {
    if (reset) {
      setCount(0);
      return;
    }
    if (timer && !reset) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setCount(count + 1), 1000);
    }
  }, [timer, count, reset]);

  const resetTimer = () => {
    setReset(true);
    setTimer(false);
  };

  useEffect(() => {
    const minutes = Math.floor(count / 60);
    const seconds = count % 60;

    function padTo2Digits(num: number) {
      return num.toString().padStart(2, '0');
    }

    setResult(`${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`);
    console.log(result);
  }, [count]);

  return (
    <>
      <h1>Timer</h1>
      <p>{result}</p>
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
