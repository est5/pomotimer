import { useEffect, useState } from 'react';
import './App.css';

enum Focus {
  WORK,
  CHILL,
}

function App() {
  const [count, setCount] = useState(0);
  const [timer, setTimer] = useState(false);
  const [reset, setReset] = useState(false);
  const [result, setResult] = useState('0:00');
  const [focusType, setFocusType] = useState(Focus.WORK);
  const [minutes, setMinutes] = useState(0);
  const [workTime, setWorkTime] = useState(40);
  const [chillTime, setChillTime] = useState(10);

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
    setResult('00:00');
    setReset(true);
    setTimer(false);
  };

  useEffect(() => {
    setMinutes(Math.floor(count / 60));
    const seconds = count % 60;

    function padTo2Digits(num: number) {
      return num.toString().padStart(2, '0');
    }

    reset
      ? setResult('00:00')
      : setResult(`${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`);
  }, [count]);

  useEffect(() => {
    switch (focusType) {
      case 0:
        {
          if (minutes == workTime) {
            setFocusType(1);
            resetTimer();
          }
        }
        break;

      case 1:
        {
          if (minutes == chillTime) {
            setFocusType(0);
            resetTimer();
          }
        }
        break;
    }
  }, [count]);

  const validateInput = (n: number) => {
    if (n >= 60) {
      return 60;
    } else if (n <= 1) {
      return 1;
    }
    return n;
  };

  return (
    <>
      <h1>{focusType == 0 ? 'Work' : 'Chill'}</h1>
      <p>{result}</p>
      <button
        onClick={() => {
          setTimer(!timer);
          setReset(false);
        }}
      >
        {!timer ? 'Start' : 'Stop'}
      </button>
      <button onClick={resetTimer}>Reset</button>
      <button
        onClick={() => {
          resetTimer();
          setFocusType(focusType == 0 ? 1 : 0);
        }}
      >
        Skip to {focusType == 0 ? 'Chill' : 'Work'}
      </button>

      <div>
        <label htmlFor="work">Work timer(min)</label>
        <input
          type="number"
          name="work"
          id="work"
          max={60}
          min={1}
          value={workTime}
          onChange={(e: React.FormEvent<HTMLInputElement>) =>
            setWorkTime(validateInput(Number.parseInt(e.currentTarget.value)))
          }
        />
      </div>
      <div>
        <label htmlFor="chill">Chill timer(min)</label>
        <input
          type="number"
          name="chill"
          id="chill"
          max={60}
          min={1}
          value={chillTime}
          onChange={(e: React.FormEvent<HTMLInputElement>) =>
            setChillTime(validateInput(Number.parseInt(e.currentTarget.value)))
          }
        />
      </div>
    </>
  );
}

export default App;
