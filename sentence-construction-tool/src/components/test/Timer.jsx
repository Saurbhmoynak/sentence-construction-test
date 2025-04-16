import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

const Timer = ({ timeLimit = 60, onTimeUp, currentQuestion, isSubmitted }) => {
  const [seconds, setSeconds] = useState(timeLimit);

  useEffect(() => {
    setSeconds(timeLimit);
  }, [currentQuestion, timeLimit]);

  useEffect(() => {
    if (isSubmitted) return; // 🛑 don't run timer if test is submitted

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeUp, isSubmitted]); // 🧠 added isSubmitted

  return (
    <>
      00:{seconds}
    </>
  );
};

export default Timer;
