import React from 'react';
import axios from 'axios';

import '../styles/App.css';
import correct_sound from '../assets/Correct_Answer_Sound_Effect.mp3';
import incorrect_sound from '../assets/Buzzer_Wrong_Answer.mp3';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      questions: {},
      unusedQuestions: [],
      currentQuestionId: null,
      currentAnswers: [],
      correct: null,
      score: 0
    }
  }

  getQuestions() {
    axios.get('/questions')
      .then((res) => {
        this.setState({
          questions: res.data,
          unusedQuestions: Object.keys(res.data),
          score: 0
        });
      });
  }

  sendAnswer(questionId, answerId, answersList) {
    axios.post('/answerValidation', { questionId, answerId })
      .then((res) => {
        let newScore = this.state.score;
        if (res.data.correct) {
          newScore++;
        }
        this.setState({
          correct: res.data.correct,
          score: newScore,
          currentQuestionId: questionId,
          currentAnswers: answersList
        });
      });
  }

  nextQuestion(questionId) {
    // remove used question from unusedQuestions
    let newUnusedQuestions = this.state.unusedQuestions.filter((qId) => {
      return qId !== questionId;
    });

    this.setState({
      unusedQuestions: newUnusedQuestions,
      correct: null
    });
  }

  selectRandomQuestion() {
    // select random unused question
    let unusedQuestionIndex = Math.floor(Math.random() * this.state.unusedQuestions.length);
    return this.state.unusedQuestions[unusedQuestionIndex];
  }

  shuffleAnswers(questionId) {
    const question = this.state.questions[questionId];
    // shuffle the answers (without altering original data)
    // uses Fisher-Yates shuffle
    let shuffledAnswers = JSON.parse(JSON.stringify(question.answers));
    for (let i = shuffledAnswers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = shuffledAnswers[i];
      shuffledAnswers[i] = shuffledAnswers[j];
      shuffledAnswers[j] = temp;
    }
    return shuffledAnswers;
  }

  render() {
    const questions = this.state.questions;

    if (Object.keys(questions).length === 0) {
      return (
        <div className='startScreen'>
          <h1 className='title'>Quiz Game</h1>
          <button
            className='playButton'
            onClick={this.getQuestions.bind(this)}
          ></button>
        </div>
      );
    } else if (this.state.unusedQuestions.length === 0) {
      return (
        <div className='endScreen'>
          <h1 className='title'>Quiz Game</h1>
          <h2 className='finalScore'>Final Score: {this.state.score}</h2>
          <button
            className='playAgainButton'
            onClick={this.getQuestions.bind(this)}
          ></button>
        </div>
      );
    } else {
      let currentQId = this.state.currentQuestionId;
      let currentAnswers = this.state.currentAnswers;
      let correctMessage = null;
      let nextButton = null;

      if (this.state.correct === null) {
        currentQId = this.selectRandomQuestion();
        currentAnswers = this.shuffleAnswers(currentQId);
      } else if (this.state.correct) {
        correctMessage = <div className='correct'>
          <audio src={correct_sound} autoPlay/>
        </div>;
        nextButton = (
          <button
            className='nextButton'
            onClick={() => this.nextQuestion(currentQId)}
          >
            Next
          </button>
        );
      } else {
        correctMessage = <div className='incorrect'>
          <audio src={incorrect_sound} autoPlay/>
        </div>;
        nextButton = (
          <button
            className='nextButton'
            onClick={() => this.nextQuestion(currentQId)}
          >
            Next
          </button>
        );
      }

      return (
        <div className='gameArea'>
          <h1 className='title'>Quiz Game</h1>
          <h3 className='score'>Score: {this.state.score}</h3>
          {correctMessage}
          <h4 className='question'>{questions[currentQId].question}</h4>
          <div className='answersBox'>
            <div className='answersLine1'>
              <button
                className={'answer ' + (this.state.correct !== null ? 'disabled' : '')}
                disabled={this.state.correct !== null}
                onClick={() => this.sendAnswer(currentQId, currentAnswers[0].id, currentAnswers)}
              >
                {currentAnswers[0].text}
              </button>
              <button
                className={'answer ' + (this.state.correct !== null ? 'disabled' : '')}
                disabled={this.state.correct !== null}
                onClick={() => this.sendAnswer(currentQId, currentAnswers[1].id, currentAnswers)}
              >
                {currentAnswers[1].text}
              </button>
            </div>
            <div className='answersLine2'>
              <button
                className={'answer ' + (this.state.correct !== null ? 'disabled' : '')}
                disabled={this.state.correct !== null}
                onClick={() => this.sendAnswer(currentQId, currentAnswers[2].id, currentAnswers)}
              >
                {currentAnswers[2].text}
              </button>
              <button
                className={'answer ' + (this.state.correct !== null ? 'disabled' : '')}
                disabled={this.state.correct !== null}
                onClick={() => this.sendAnswer(currentQId, currentAnswers[3].id, currentAnswers)}
              >
                {currentAnswers[3].text}
              </button>
            </div>
          </div>
          {nextButton}
        </div>
      );
    }
  }
}

export default App;