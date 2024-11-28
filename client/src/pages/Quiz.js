import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Quiz.css';

function Quiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/quiz`);
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const startQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const handleAnswer = async (answerIndex) => {
    const newAnswers = [...answers, {
      questionIndex: currentQuestion,
      selectedAnswer: answerIndex
    }];
    setAnswers(newAnswers);

    if (currentQuestion + 1 < currentQuiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Submit quiz
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/quiz/submit`, {
          quizId: currentQuiz._id,
          answers: newAnswers
        });
        setCurrentQuiz(null);
      } catch (error) {
        console.error('Error submitting quiz:', error);
      }
    }
  };

  return (
    <div className="quiz-container">
      {!currentQuiz ? (
        <div className="quiz-list">
          <h2>Quiz Disponibili</h2>
          {quizzes.map(quiz => (
            <div key={quiz._id} className="quiz-card">
              <h3>{quiz.title}</h3>
              <p>{quiz.description}</p>
              <button onClick={() => startQuiz(quiz)}>Inizia Quiz</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="quiz-question">
          <h3>Domanda {currentQuestion + 1}</h3>
          <p>{currentQuiz.questions[currentQuestion].question}</p>
          <div className="options">
            {currentQuiz.questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="option-button"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;