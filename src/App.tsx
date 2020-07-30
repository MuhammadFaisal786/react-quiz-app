import React, {useState} from 'react';
import{ QuestionCard } from './Components/QuestionCard';
import { fetchQuestions, Difficulty, QuestionState } from './API';
import {GlobalStyle, Wrapper} from './App.styles';
import './App.css'

const TOTAL_QUESTIONS = 10;

type AnswerObject = {
    question: string;
    answer: string;
    correct: boolean;
    correctAnswer: string;
}

function App() {

    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<QuestionState[]>([]);
    const [number, setNumber] = useState(0);
    const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(true);

    const startQuiz = async() => {
        setLoading(true);
        setGameOver(false);
        const newQuestions = await fetchQuestions(TOTAL_QUESTIONS, Difficulty.EASY)
        setQuestions(newQuestions);
        setScore(0);
        setUserAnswers([]);
        setNumber(0);
        setLoading(false);
    };

    const nextQuiz = async() => {
        const nextQuiz = number + 1;
        if(nextQuiz === TOTAL_QUESTIONS) {
            setGameOver(true);
 }
 else {
     setNumber(nextQuiz);
 }
    };

    const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!gameOver) {
       const answer = e.currentTarget.value;

       const correct = questions[number].correct_answer === answer;

       if (correct) setScore(prev => prev + 1)

       const AnswerObject = {
           question: questions[number].question,
           answer,
           correct,
           correctAnswer: questions[number].correct_answer
       }

       setUserAnswers(prev => [...prev, AnswerObject])
        }
    };
   
    return (
        <>
        <GlobalStyle />
        <Wrapper>
          <h1>React Quiz</h1>
          {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (  
          <button className="start" onClick={startQuiz}>Start Quiz</button> ) : null}
          {!gameOver ? (
          <p className="score">
              Score: {score}
          </p> ) : null }
          {loading ? (
          <p>
              Loading
          </p> ) : null }
          {!loading && !gameOver ? (
               <QuestionCard 
                questionNum={number + 1}
                totalQuestions={TOTAL_QUESTIONS}
                question={questions[number].question}
                answers={questions[number].answers}
                 userAnswer={userAnswers ? userAnswers[number] : undefined}
                 callback={checkAnswer}
               /> ) : null }
               {!gameOver && !loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS - 1 ? (
          <button className="next" onClick={nextQuiz}>
              Next
          </button> ) : null }
        </Wrapper>
        </>
    )
}
export default App;
