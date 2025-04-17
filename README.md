# Sentence Construction Tool

An interactive web application where users fill in the blanks of incomplete sentences by selecting words from a set of options. The tool provides a timer, question navigation, and feedback on completion.

## Overview

The Sentence Construction Tool allows users to practice sentence formation by filling blanks with appropriate words from given options. Users are presented with 10 questions, each with a 30-second timer. The application tracks user performance and provides detailed feedback at the end of the test.

## Features

- **Sentence Display with Blanks**: Presents incomplete sentences with blanks to be filled
- **Word Options**: Provides four word options for each sentence
- **Interactive Selection**: Users can select and unselect words to place in blanks
- **Timer**: 30-second timer for each question with automatic progression
- **Navigation Control**: "Next" button only activates when all blanks are filled
- **Dynamic Question Fetching**: Questions retrieved from JSON API
- **Comprehensive Feedback**: Shows correct/incorrect answers and final score

## Technical Stack

- **Frontend**: Vite + React
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Language**: JavaScript
- **Data Fetching**: Axios
- **Routing**: React Router
- **Version Control**: GitHub
- **Deployment**:
  - Frontend: Vercel (https://sentence-construction-test.vercel.app/)
  - Backend: JSON Server on Render(https://json-data-ypen.onrender.com/tests)

## Application Flow

1. **Start Screen**: Users begin the test
2. **Question Display**:
   - Sentence with blank spaces
   - Four word options
   - 30-second timer
   - Initially disabled "Next" button
3. **User Interaction**:
   - Select words for blank spaces
   - Unselect words if needed
   - "Next" button enables when all blanks are filled
4. **Navigation**: Proceed to next question after completion or when timer expires
5. **Feedback Screen**: Displays results after completing all questions

## Component Logic

### Test Component

The Test component manages the core functionality of the application:

#### State Management
```javascript
const [questions, setQuestions] = useState([]);
const [currentIndex, setCurrentIndex] = useState(0);
const [selectedWords, setSelectedWords] = useState([]);
const [userAnswers, setUserAnswers] = useState([]);
const [results, setResults] = useState([]);
const [dragEnabled, setDragEnabled] = useState(true);
const [status, setStatus] = useState("loading");
const [isTestSubmitted, setIsTestSubmitted] = useState(false);
```

#### Data Fetching
```javascript
useEffect(() => {
  axios
    .get("https://json-data-ypen.onrender.com/tests")
    .then((res) => {
      const questionData = res.data[0].data.questions;
      setQuestions(questionData);
      setSelectedWords(new Array(questionData[0].correctAnswer.length).fill(null));
      setStatus("ready");
    })
    .catch((err) => {
      console.error("Error fetching questions:", err);
      setStatus("error");
    });
}, []);
```

#### Word Selection Logic
```javascript
const handleWordClick = (word) => {
  if (selectedWords.includes(word)) return;

  const nextBlank = selectedWords.findIndex((w) => w === null);
  if (nextBlank !== -1) {
    const updated = [...selectedWords];
    updated[nextBlank] = word;
    setSelectedWords(updated);
  }
};
```

#### Word Removal Logic
```javascript
const handleRemoveWord = (index) => {
  const updated = [...selectedWords];
  updated[index] = null;
  setSelectedWords(updated);
};
```

#### Navigation Logic
```javascript
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
```

#### Test Submission Logic
```javascript
const handleSubmit = () => {
  setIsTestSubmitted(true);

  const finalResults = questions.map((q, index) => {
    const userAns =
      index === currentIndex ? selectedWords : userAnswers[index] || new Array(q.correctAnswer.length).fill(null);

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
```

### Result Component

The Result component handles displaying the user's performance:

#### Answer Comparison Logic
```javascript
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
```

#### Fill-in-the-blanks Logic
```javascript
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
```

#### Score Calculation
```javascript
const total = questions.length;
const correctCount = questions.reduce((count, q, i) => {
  const result = compareAnswers(userAnswers[i], q.correctAnswer);
  return result === "correct" ? count + 1 : count;
}, 0);
const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
```

## Deployment

- **Frontend (Vercel)**: The React application is deployed on Vercel for seamless hosting.
- **Backend (JSON Server on Render)**: A JSON server deployed on Render provides the question data.
- **GitHub**: All code is maintained in a GitHub repository for version control.
