import React, { useState } from "react";
import axios from "axios";

const AddQuestion = () => {
  const [collectionName, setCollectionName] = useState("");
  const [password, setPassword] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [message, setMessage] = useState("");

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addQuestion = async (e) => {
    e.preventDefault();
    if (
      !collectionName ||
      !password ||
      !questionText ||
      options.some((opt) => opt.trim() === "") ||
      !correctAnswer
    ) {
      setMessage("All fields are required.");
      return;
    }
    if (!options.includes(correctAnswer)) {
      setMessage("Correct answer must be one of the options.");
      return;
    }

    try {
      const res = await axios.post("https://assessmentsitebackend.onrender.com/api/questions", {
        collectionName,
        password,
        questionText,
        options,
        correctAnswer,
      });
      setMessage(res.data.message);
      setCollectionName("");
      setPassword("");
      setQuestionText("");
      setOptions(["", ""]);
      setCorrectAnswer("");
    } catch (error) {
      setMessage("Error adding question.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-center mb-4">Add Question</h2>
      {message && <p className="text-red-500 text-center">{message}</p>}
      <form onSubmit={addQuestion}>
        <input
          type="text"
          placeholder="Collection Name"
          className="w-full p-2 border rounded mb-2"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Passkey"
          className="w-full p-2 border rounded mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <textarea
          placeholder="Question"
          className="w-full p-2 border rounded mb-2"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />
        {options.map((option, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            className="w-full p-2 border rounded mb-2"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
          />
        ))}
        <input
          type="text"
          placeholder="Correct Answer"
          className="w-full p-2 border rounded mb-2"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Question
        </button>
      </form>
    </div>
  );
};

export default AddQuestion;
