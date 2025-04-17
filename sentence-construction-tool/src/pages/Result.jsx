import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userAnswers } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [status, setStatus] = useState("loading");
  const port = import.meta.env.VITE_PORT;

  useEffect(() => {
    if (!userAnswers) {
      navigate("/"); // Redirect if no user answers
    } else {
      setStatus("loading"); // Set loading status
  
      axios
        .get(`${port}/tests`)
        .then((res) => {
          console.log("API Response:", res.data);
  
          // Safely extracting the questions data
          const questionData =
            res.data?.[0]?.data?.questions || res.data?.questions;
  
          if (questionData) {
            setQuestions(questionData); // Set questions
            setStatus("ready"); // Set status to ready when data is fetched
          } else {
            console.error("Unexpected API response structure:", res.data);
            setStatus("error");
          }
        })
        .catch((err) => {
          console.error("Error fetching questions:", err);
          setStatus("error"); // Set error status on failure
        });
    }
  }, [userAnswers, navigate]);
  

  const compareAnswers = (userAns, correctAns) => {
    if (
      !userAns ||
      userAns.length === 0 ||
      userAns.some((word) => word == null)
    )
      return "unanswered";

    const normalizedUser = userAns.join(" ").toLowerCase().trim();
    const normalizedCorrect = correctAns.join(" ").toLowerCase().trim();

    return normalizedUser === normalizedCorrect ? "correct" : "incorrect";
  };

  const fillBlanks = (question, answers) => {
    if (!question || !answers || answers.length === 0) return question;

    const parts = question.split("_____________");
    let filledQuestion = "";

    for (let i = 0; i < parts.length; i++) {
      filledQuestion += parts[i];
      if (i < parts.length - 1) {
        if (i < answers.length && answers[i]) {
          filledQuestion += `<span class="font-medium text-blue-600">${answers[i]}</span>`;
        } else {
          filledQuestion += "_____________";
        }
      }
    }

    return filledQuestion;
  };

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center text-muted-foreground">
        Loading results...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-red-500">
        <p>Error loading questions. Please try again.</p>
        <Button onClick={() => navigate("/")} className="mt-4">
          Go to Dashboard
        </Button>
      </div>
    );
  }

  const total = questions.length;
  const correctCount = questions.reduce((count, q, i) => {
    const result = compareAnswers(userAnswers[i], q.correctAnswer);
    return result === "correct" ? count + 1 : count;
  }, 0);
  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  let feedbackMessage = "";
  if (percentage === 100) {
    feedbackMessage =
      "Excellent! You got everything right. Keep up the great work!";
  } else if (percentage >= 70) {
    feedbackMessage =
      "Great job! You're on the right track. Just a few tweaks and you'll be perfect.";
  } else {
    feedbackMessage =
      "While you correctly formed several sentences, there are a couple of areas where improvement is needed. Pay close attention to sentence structure and word placement to ensure clarity and correctness. Review your responses below for more details.";
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* Score circle */}
        <div className="relative w-52 h-52 mx-auto">
          <svg className="transform -rotate-90" width="208" height="208">
            <circle
              cx="104"
              cy="104"
              r="85"
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="104"
              cy="104"
              r="85"
              stroke="#10b981"
              strokeWidth="12"
              fill="none"
              strokeDasharray={2 * Math.PI * 70}
              strokeDashoffset={(1 - percentage / 100) * 2 * Math.PI * 60}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold">{percentage}</span>
            <span className="text-sm text-muted-foreground">Overall Score</span>
          </div>
        </div>

        {/* Feedback */}
        <div className="text-medium mt-10 mb-10 text-gray-700 font-medium max-w-3xl mx-auto text-center">
          {feedbackMessage}
        </div>

        <Button
          variant="outline"
          className="px-14 py-5 text-lg border-2 border-purple-600 text-purple-700 font-medium"
          onClick={() => navigate("/")}
        >
          Go to Dashboard
        </Button>

        <div className="text-2xl mt-10 mb-10 animate-bounce">⬇️</div>

        {/* Answers */}
        <div className="space-y-25 mt-4">
          {questions.length > 0 &&
            questions.map((question, index) => {
              const userAns =
                userAnswers && userAnswers[index] ? userAnswers[index] : [];
              const correctAns = question.correctAnswer;
              const result = compareAnswers(userAns, correctAns);

              // Fill question with user answers and correct answers
              const userFilledQuestion = fillBlanks(question.question, userAns);
              const correctFilledQuestion = fillBlanks(
                question.question,
                correctAns
              );

              return (
                <div
                  key={index}
                  className="max-w-3xl mx-auto rounded-lg p-0 shadow-xl bg-white border border-gray-300 transform transition-all hover:scale-101 hover:shadow-lg hover:bg-gray-50"
                >
                  <div className="p-5">
                    <div className="flex justify-between text-xs text-gray-600 font-semibold mb-3">
                      <span className="bg-gray-200 rounded-[10px] p-1">
                        Prompt
                      </span>
                      <span>
                        {index + 1} / {total}
                      </span>
                    </div>

                    {/* Correct answer section */}
                    <div className="mb-3">
                      <div
                        className="mt-2 text-gray-900 text-left"
                        dangerouslySetInnerHTML={{
                          __html: correctFilledQuestion,
                        }}
                      />
                    </div>

                    {/* Your answer section */}
                  </div>
                  <div className=" mb-0 bg-green-200/30 rounded-[3px] p-5">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-500">
                        Your Response:
                      </span>
                      {result === "correct" ? (
                        <span className="text-green-600 bg-green-100 rounded-[8px] font-medium">
                          Correct
                        </span>
                      ) : result === "incorrect" ? (
                        <span className="text-red-600 bg-red-100 rounded-[8px] font-medium">
                          Incorrect
                        </span>
                      ) : (
                        <span className="text-orange-500 bg-orange-100 rounded-[8px] font-medium">
                          Not answered
                        </span>
                      )}
                    </div>
                    <div
                      className="mt-2 text-gray-900 text-left"
                      dangerouslySetInnerHTML={{
                        __html:
                          userAns && userAns.length > 0
                            ? userFilledQuestion
                            : "<div class='italic text-orange-500'>You have not answered this question.</div>",
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Result;
