import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Timer from "@/components/test/Timer";
import ProgressBar from "@/components/test/ProgressBar";
import Question from "@/components/test/Question";
import WordOptions from "@/components/test/WordOptions";
import Navigation from "@/components/test/Navigation";

const arraysEqual = (a, b) =>
  a.length === b.length && a.every((val, i) => val === b[i]);

const Test = () => {
  const port = import.meta.env.VITE_PORT;
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [results, setResults] = useState([]);
  const [dragEnabled, setDragEnabled] = useState(true);
  const [status, setStatus] = useState("loading");
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);

  const navigate = useNavigate();

  // Fetch questions on mount
  useEffect(() => {
    axios
      .get(`${port}/tests`)
      .then((res) => {
        const questionData = res.data[0].data.questions;
        setQuestions(questionData);
        setSelectedWords(
          new Array(questionData[0].correctAnswer.length).fill(null)
        );
        setStatus("ready");
      })
      .catch((err) => {
        console.error("Error fetching questions:", err);
        setStatus("error");
      });
  }, []);

  // Handles word click from options
  const handleWordClick = (word) => {
    if (selectedWords.includes(word)) return;

    const nextBlank = selectedWords.findIndex((w) => w === null);
    if (nextBlank !== -1) {
      const updated = [...selectedWords];
      updated[nextBlank] = word;
      setSelectedWords(updated);
    }
  };

  // Remove word from selected
  const handleRemoveWord = (index) => {
    const updated = [...selectedWords];
    updated[index] = null;
    setSelectedWords(updated);
  };

  // Handles quitting the test
  const handleQuit = () => {
    if (window.confirm("Are you sure you want to quit the test?")) {
      handleSubmit();
    }
  };

  // Submits the final result and navigates to result page
  const handleSubmit = () => {
    setIsTestSubmitted(true);

    const finalResults = questions.map((q, index) => {
      const userAns =
        index === currentIndex
          ? selectedWords
          : userAnswers[index] || new Array(q.correctAnswer.length).fill(null);

      return {
        question: q.question,
        userAnswer: userAns,
        correctAnswer: q.correctAnswer,
        isCorrect: arraysEqual(userAns, q.correctAnswer),
      };
    });

    const correctAnswers = finalResults.filter((r) => r.isCorrect);
    const incorrectAnswers = finalResults.filter((r) => !r.isCorrect);
    const score = (correctAnswers.length / questions.length) * 100;

    setResults(finalResults);

    navigate("/result", {
      state: {
        questions,
        userAnswers: finalResults.map((r) => r.userAnswer),
        correctAnswers,
        incorrectAnswers,
        score,
        totalQuestions: questions.length,
      },
    });
  };

  // Handles moving to the next question or submits if last
  const handleNext = () => {
    const currentQ = questions[currentIndex];
    const isCorrect = arraysEqual(selectedWords, currentQ.correctAnswer);

    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentIndex] = selectedWords;

    const updatedResults = [...results];
    updatedResults[currentIndex] = {
      question: currentQ.question,
      userAnswer: selectedWords,
      correctAnswer: currentQ.correctAnswer,
      isCorrect,
    };

    setUserAnswers(updatedAnswers);
    setResults(updatedResults);
    setDragEnabled(false);

    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex < questions.length) {
        const nextQ = questions[nextIndex];
        setCurrentIndex(nextIndex);
        setSelectedWords(
          updatedAnswers[nextIndex] ||
            new Array(nextQ.correctAnswer.length).fill(null)
        );
        setDragEnabled(true);
      } else {
        handleSubmit();
      }
    }, 100);
  };

  const handleTimeUp = () => {
    if (!isTestSubmitted) handleNext();
  };

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center text-muted-foreground">
        Loading questions...
      </div>
    );
  }

  if (status === "error") {
    return (
      <Alert variant="destructive" className="mt-10 max-w-xl mx-auto">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load questions.</AlertDescription>
      </Alert>
    );
  }

  const currentQ = questions[currentIndex];
  const total = questions.length;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <Card className="w-full sm:max-w-4xl mx-auto p-6 shadow-lg rounded-xl">
        <CardHeader className="flex justify-between items-center mb-4">
          <Timer
            timeLimit={30}
            onTimeUp={handleTimeUp}
            currentQuestion={currentIndex}
            isTestSubmitted={isTestSubmitted}
          />
          <CardTitle className="text-xl font-semibold text-center w-full">
            Sentence Construction Test
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleQuit}>
            Quit
          </Button>
        </CardHeader>
        <div className="flex justify-center">
          <p>Select the missing words in the correct order</p>
        </div>

        <CardContent className="space-y-6 mt-4">
          <div className="flex justify-between items-center mt-4">
            <div className="w-full mb-5 sm:w-2/3 lg:w-full">
              <ProgressBar
                current={currentIndex}
                total={total}
                results={results}
                className="w-full"
              />
            </div>
          </div>

          <Question
            question={currentQ.question}
            selectedWords={selectedWords}
            setSelectedWords={setSelectedWords}
            onRemove={handleRemoveWord}
          />

          <div className="flex justify-center">
            <WordOptions
              options={currentQ.options}
              selectedWords={selectedWords}
              onWordClick={handleWordClick}
              dragEnabled={dragEnabled}
            />
          </div>

          <Navigation
            current={currentIndex}
            total={total}
            onSubmit={handleSubmit}
            isSubmitted={userAnswers[currentIndex] !== undefined}
            selectedWords={selectedWords}
            onNext={handleNext} // Pass handleNext function
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Test;
