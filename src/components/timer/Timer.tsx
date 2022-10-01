import { useState, useEffect } from 'react';
import Button from '../button/Button';
import Input from '../input/Input';
import './timer.css';
import { clearTimeout, setTimeout } from 'worker-timers';

enum Focus {
  WORK,
  CHILL,
  LONG_CHILL,
}

function Timer() {
  const [totalSeconds, setTotalSeconds] = useState(0);

  //Is timer running
  const [isTimerUp, setIsTimerUp] = useState(false);

  //Reset timer or not
  const [isReset, setIsReset] = useState(false);

  //String representation of timer in format 00:00
  const [strTimer, setStrTimer] = useState('0:00');

  //What type of focus rn
  const [focusType, setFocusType] = useState(Focus.WORK);

  //Just calc of seconds to minutes, probably not needed to be state
  const [minutes, setMinutes] = useState(0);

  //Work focus time
  const [workTime, setWorkTime] = useState(40);

  //Chill focus time
  const [chillTime, setChillTime] = useState(10);

  //After 4 cycles of work, probably not needed to be state
  const [longChill, setLongChill] = useState(chillTime * 3);

  const [cycleCounter, setCycleCounter] = useState(0);

  //Count of finished rounds (4 work cycles), probably not needed to be state
  const [round, setRound] = useState(0);

  // Listen on seconds, in case its time to reset, changes type of focus and counting round \ cycles
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

  // Recounting long chill in case chill time changed
  useEffect(() => {
    setLongChill(chillTime * 3);
  }, [chillTime]);

  // Counting second and listening on reset click
  useEffect(() => {
    if (isReset) {
      setTotalSeconds(0);
      return;
    }
    if (isTimerUp && !isReset) {
      setTimeout(() => setTotalSeconds(totalSeconds + 1), 1);
    }
  }, [totalSeconds, isReset, isTimerUp]);

  //Reset all values on CURRENT focus type
  const resetTimer = () => {
    setStrTimer('00:00');
    setIsReset(true);
    setIsTimerUp(false);
  };

  //Format seconds to 00:00 format, also on reset clears string to initial form
  useEffect(() => {
    setMinutes(Math.floor(totalSeconds / 60));

    const seconds: number = totalSeconds % 60;

    function padTo2Digits(num: number) {
      return num.toString().padStart(2, '0');
    }

    let title = document.getElementsByTagName('title')[0];
    title.textContent = `${getFocus()} ${padTo2Digits(minutes)}:${padTo2Digits(
      seconds
    )}`;
    isReset
      ? setStrTimer('00:00')
      : setStrTimer(`${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`);
  }, [totalSeconds]);

  //Input numbers must not be lower than 1 obviosly, maximum is 1hour ? enough imo
  const validateInput = (n: number) => {
    if (n >= 60) {
      return 60;
    } else if (n <= 1) {
      return 1;
    }
    return n;
  };

  //Changes text representation of focus on focusType change
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

  //Work/chill set time
  const changeWorkTimer = (e: React.FormEvent<HTMLInputElement>) => {
    setWorkTime(validateInput(Number.parseInt(e.currentTarget.value)));
  };

  const changeChillTimer = (e: React.FormEvent<HTMLInputElement>) =>
    setChillTime(validateInput(Number.parseInt(e.currentTarget.value)));

  let audio = new Audio('alert.wav');

  //On focus change play audio
  useEffect(() => {
    audio.volume = 0.5;
    audio.play();
  }, [focusType]);

  return (
    <div className="timer-container">
      <h1>Its {getFocus()} time !</h1>
      <p>
        Work cycles in this round done: <strong>{cycleCounter}</strong>
      </p>
      <p>
        Rounds done: <strong>{round}</strong>
      </p>
      <p>{strTimer}</p>

      <div className="buttons">
        <Button
          onClick={() => {
            setIsTimerUp(!isTimerUp);
            setIsReset(false);
          }}
          txt={!isTimerUp ? 'Start' : 'Stop'}
        />
        <Button onClick={resetTimer} txt={'Reset'} />
        <Button
          onClick={() => {
            resetTimer();
            if (focusType == 2) {
              setCycleCounter(0);
            }
            setFocusType(focusType == 0 ? 1 : 0);
          }}
          txt={`Skip to ${focusType == 0 ? 'Chill' : 'Work'}`}
        />
      </div>

      <div>
        <Input
          id="work"
          name="work"
          type="number"
          onChange={changeWorkTimer}
          txt={'Work timer'}
          value={workTime}
        />
      </div>
      <div>
        <Input
          id="chill"
          name="chill"
          type="number"
          onChange={changeChillTimer}
          txt={'Chill timer'}
          value={chillTime}
        />
      </div>
    </div>
  );
}

export default Timer;
