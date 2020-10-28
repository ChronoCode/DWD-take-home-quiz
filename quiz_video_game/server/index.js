const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

// extract questions from file
let quizQuestions = fs.readFileSync(__dirname + '/quizQuestions.txt', { encoding: 'utf8', flag: 'r' });
quizQuestions = quizQuestions.split('\r\n\r\n');

let questionObjects = {};
let correctAnswers = {};
quizQuestions.forEach((questionString, questionId) => {
  let questionArray = questionString.split('\r\n');

  // assumes that none of the answer text will include the
  // substring '(correct)' if they are incorrect
  let answer1Correct = questionArray[1].includes('(correct)');
  let answer1Text = questionArray[1].replace(' (correct)', '');
  let answer2Correct = questionArray[2].includes('(correct)');
  let answer2Text = questionArray[2].replace(' (correct)', '');
  let answer3Correct = questionArray[3].includes('(correct)');
  let answer3Text = questionArray[3].replace(' (correct)', '');
  let answer4Correct = questionArray[4].includes('(correct)');
  let answer4Text = questionArray[4].replace(' (correct)', '');

  if (answer1Correct) {
    correctAnswers[questionId] = 1;
  } else if (answer2Correct) {
    correctAnswers[questionId] = 2;
  } else if (answer3Correct) {
    correctAnswers[questionId] = 3;
  } else if (answer4Correct) {
    correctAnswers[questionId] = 4;
  }

  questionObjects[questionId] = {
    question: questionArray[0],
    answers: [
      { id: 1, text: answer1Text },
      { id: 2, text: answer2Text },
      { id: 3, text: answer3Text },
      { id: 4, text: answer4Text }
    ]
  }
});

app.use(express.static('public'));
app.use(express.json());

app.get('/questions', (req, res) => {
  res.send(questionObjects);
});

app.post('/answerValidation', (req, res) => {
  let { questionId, answerId } = req.body;
  if (correctAnswers[questionId] === answerId) {
    res.send({ correct: true });
  } else {
    res.send({ correct: false });
  }
});

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));