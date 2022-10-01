import { useEffect, useState } from 'react';
import './App.css';

enum Focus {
  WORK,
  CHILL,
  LONG_CHILL,
}

function App() {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isTimerUp, setIsTimerUp] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [strTimer, setStrTimer] = useState('0:00');
  const [focusType, setFocusType] = useState(Focus.WORK);
  const [minutes, setMinutes] = useState(0);
  const [workTime, setWorkTime] = useState(40);
  const [chillTime, setChillTime] = useState(10);
  const [longChill, setLongChill] = useState(chillTime * 3);
  const [cycleCounter, setCycleCounter] = useState(0);
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (totalSeconds == 0) {
      return;
    }
    switch (focusType) {
      case 2:
        {
          if (minutes == longChill) {
            setFocusType(0);
            setCycleCounter(0);
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
            if (cycleCounter == 4) {
              setFocusType(2);
              setRound(round + 1);
              resetTimer();
              break;
            }
            setCycleCounter(cycleCounter + 1);
            setFocusType(1);
            resetTimer();
          }
        }
        break;
    }
  }, [totalSeconds]);

  let timeoutId: number = 0;

  useEffect(() => {
    setLongChill(chillTime * 3);
  }, [chillTime]);

  useEffect(() => {
    if (isReset) {
      setTotalSeconds(0);
      return;
    }
    if (isTimerUp && !isReset) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setTotalSeconds(totalSeconds + 1), 10);
    }
  }, [totalSeconds, isReset, isTimerUp]);

  const resetTimer = () => {
    setStrTimer('00:00');
    setIsReset(true);
    setIsTimerUp(false);
  };

  useEffect(() => {
    setMinutes(Math.floor(totalSeconds / 60));

    const seconds: number = totalSeconds % 60;

    function padTo2Digits(num: number) {
      return num.toString().padStart(2, '0');
    }

    isReset
      ? setStrTimer('00:00')
      : setStrTimer(`${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`);
  }, [totalSeconds]);

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
      <h1>Its {getFocus()} time !</h1>
      <p>Work cycles in this round done: {cycleCounter}</p>
      <p>Rounds done: {round}</p>
      <p>{strTimer}</p>
      <button
        onClick={() => {
          setIsTimerUp(!isTimerUp);
          setIsReset(false);
        }}
      >
        {!isTimerUp ? 'Start' : 'Stop'}
      </button>
      <button onClick={resetTimer}>Reset</button>
      <button
        onClick={() => {
          resetTimer();
          if (focusType == 2) {
            setCycleCounter(0);
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
