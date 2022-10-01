import { useEffect, useState } from 'react';
import './App.css';

enum Focus {
  WORK,
  CHILL,
  LONG_CHILL,
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
  const [longChill, setLongChill] = useState(chillTime * 3);
  const [cicleCounter, setCicleCouter] = useState(0);

  useEffect(() => {
    if (count == 0) {
      return;
    }
    switch (focusType) {
      case 2:
        {
          if (minutes == longChill) {
            setFocusType(0);
            setCicleCouter(0);
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

      case 0:
        {
          if (minutes == workTime) {
            if (cicleCounter == 4) {
              setFocusType(2);
              resetTimer();
              break;
            }
            setCicleCouter(cicleCounter + 1);
            setFocusType(1);
            resetTimer();
          }
        }
        break;
    }
  }, [count]);

  let timeoutId: number = 0;

  useEffect(() => {
    setLongChill(chillTime * 3);
  }, [chillTime]);

  useEffect(() => {
    if (reset) {
      setCount(0);
      return;
    }
    if (timer && !reset) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setCount(count + 1), 10);
    }
  }, [count, reset, timer]);

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

  const validateInput = (n: number) => {
    if (n >= 60) {
      return 60;
    } else if (n <= 1) {
      return 1;
    }
    return n;
  };

  const getFocus = () => {
    switch (focusType) {
      case 0:
        return 'Work';
      case 1:
        return 'Chill';
      case 2:
        return 'Long Chill';
    }
  };

  useEffect(() => {}, [focusType]);

  return (
    <>
      <h1>{getFocus()}</h1>
      <p>{cicleCounter}</p>
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
          if (focusType == 2) {
            setCicleCouter(0);
          }
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
