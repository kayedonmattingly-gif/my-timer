import React, { useState, useRef, useEffect } from "react";
import "./App.css";


function Confetti() {
  return (
    <div className="confetti">
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} className="confetti-piece" />
      ))}
    </div>
  );
}

export default function App() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [bgColor, setBgColor] = useState("white");
  // total seconds remaining
  const [seconds, setSeconds] = useState(10);
  // initial timer value
  const [customTime, setCustomTime] = useState(10);
  // whether the timer is running
  const [isRunning, setIsRunning] = useState(false);
  // to hold the interval ID
  const intervalRef = useRef(null);

  
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000); // Hide after 3s
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // toggle start/pause
  const startPause = () => {
    if (seconds === 0) {
      // if at 0, reset back to customTime before starting
      setSeconds(customTime);
    }
    setIsRunning((r) => !r);
  };

  
  const reset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setSeconds(customTime);
  };

  
  // format 10 → "00:10", 75 → "01:15"
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="container" style={{ backgroundColor: bgColor }}>
      {showConfetti && <Confetti />}
      <h1 className="timer">{formatTime(seconds)}</h1>
      <div style={{ marginBottom: 16 }}>
        <input
          type="number"
          min="1"
          max="3600"
          value={customTime}
          disabled={isRunning}
          onChange={e => {
            const val = Math.max(1, Math.min(3600, Number(e.target.value)));
            setCustomTime(val);
            if (!isRunning) setSeconds(val);
          }}
          style={{ fontSize: 18, padding: "6px 12px", borderRadius: 6, border: "1px solid #ccc", width: 100 }}
        />
        <span style={{ marginLeft: 8 }}>seconds</span>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="bgColorPicker" style={{ marginRight: 8 }}>Background:</label>
        <input
          id="bgColorPicker"
          type="color"
          value={bgColor}
          onChange={e => setBgColor(e.target.value)}
          style={{ width: 40, height: 40, border: "none", cursor: "pointer" }}
        />
      </div>
      <button onClick={startPause}>
        {isRunning ? "Pause" : "Start"}
      </button>
      <div style={{ height: 12 }} />
      <button onClick={reset}>Reset</button>
    </div>
  );
}
