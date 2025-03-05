import React, { useState, useEffect } from 'react';

function QuestionList() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    try {
      const response = await fetch("http://localhost:4000/questions");
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  }

  async function handleDeleteQuestion(id) {
    try {
      const response = await fetch(`http://localhost:4000/questions/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setQuestions(questions.filter(question => question.id !== id));
      } else {
        console.error("Failed to delete question");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function handleCorrectAnswerChange(id, correctIndex) {
    try {
      const response = await fetch(`http://localhost:4000/questions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correctIndex: correctIndex - 1 }), // Convert to 0-based index for the server
      });
      if (response.ok) {
        setQuestions(questions.map(question => 
          question.id === id ? { ...question, correctIndex: correctIndex - 1 } : question
        ));
      } else {
        console.error("Failed to update question");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <ul>
      {questions.map((question) => (
        <li key={question.id}>
          <h3>{question.prompt}</h3>
          <ul>
            {question.answers.map((answer, index) => (
              <li key={index}>{answer}</li>
            ))}
          </ul>
          <label>
            Correct Answer:
            <select
              value={question.correctIndex + 1} // Convert to 1-based index for display
              onChange={(e) => handleCorrectAnswerChange(question.id, parseInt(e.target.value))}
            >
              {question.answers.map((answer, index) => (
                <option key={index} value={index + 1}>
                  {answer}
                </option>
              ))}
            </select>
          </label>
          <button onClick={() => handleDeleteQuestion(question.id)}>Delete Question</button>
        </li>
      ))}
    </ul>
  );
}

export default QuestionList;