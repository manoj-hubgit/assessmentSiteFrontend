import React, { useState } from "react";
import axios from "axios";

const User = () => {
  const [passkey, setPasskey] = useState("");
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [score, setScore] = useState(null);
  const [resultMessage, setResultMessage] = useState("");

  const handlePasskeySubmit = async () => {
    try {
      const response = await axios.post("https://assessmentsitebackend.onrender.com/api/question/verify-passkey", { passkey });
      if (response.data.success) {
        setCollectionName(response.data.collectionName);
        setQuestions(response.data.questions);
        setIsAccessGranted(true);
      } else {
        alert("Invalid Passkey! Try again.");
      }
    } catch (error) {
      console.error("Error verifying passkey:", error);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitQuiz = async () => {
    try {
      const userId = localStorage.getItem("userId");

    
      if (!userId) {
        alert("User ID not found! Please log in again.");
        return;
      }

      const response = await axios.post("https://assessmentsitebackend.onrender.com/api/result/store", {
        userId, 
        collectionName,
        score, 
        totalQuestions: questions.length,
      });

      if (response.data.message === "Result stored successfully") {
        setResultMessage("Quiz submitted successfully!");
      } else {
        setResultMessage("Error submitting quiz!");
      }
      setIsAccessGranted(false);
      setPasskey("");
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      if (userAnswers[q._id] === q.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  React.useEffect(() => {
    if (userAnswers && questions.length > 0) {
      setScore(calculateScore());
    }
  }, [userAnswers, questions]);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-4">User Assessment</h1>

      {!isAccessGranted ? (
        <div className="text-center">
          <label className="block text-gray-700">Enter Passkey:</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
          />
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={handlePasskeySubmit}>
            Access Assessment
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-2">Quiz: {collectionName}</h2>
          {questions.map((q, index) => (
            <div key={q._id} className="mb-4">
              <h3 className="font-semibold">{index + 1}. {q.questionText}</h3>
              {q.options.map((opt, i) => (
                <label key={i} className="block">
                  <input
                    type="radio"
                    name={q._id}
                    value={opt}
                    onChange={() => handleAnswerChange(q._id, opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
          <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded" onClick={handleSubmitQuiz}>
            Submit Quiz
          </button>
        </div>
      )}

      {score !== null && (
        <div className="mt-6 text-center">
          <h2 className="text-lg font-semibold">Your Score: {score}</h2>
        </div>
      )}

      {resultMessage && (
        <div className="mt-6 text-center text-green-500">
          <h2>{resultMessage}</h2>
        </div>
      )}
    </div>
  );
};

export default User;
