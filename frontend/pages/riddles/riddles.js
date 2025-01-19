const riddlesContainer = document.getElementById('riddles-container');
const riddleTextElement = document.getElementById('riddle-text');
const riddleAnswerInput = document.getElementById('riddle-answer');
const checkButton = document.getElementById('check-button');
const resultContainer = document.getElementById('result-container');
const resultText = document.getElementById('result-text');
const nextButton = document.getElementById('next-button');


let riddles = [];
let currentRiddleIndex = 0;

function displayRiddle() {
    if (riddles.length > 0 && currentRiddleIndex < riddles.length) {
        const currentRiddle = riddles[currentRiddleIndex];
        riddleTextElement.textContent = currentRiddle.riddle;
        riddleAnswerInput.value = "";
        resultContainer.style.display = "none";
    } else {
        riddleTextElement.textContent = "Нет загадок!";
        riddleAnswerInput.style.display = 'none';
        checkButton.style.display = 'none';
         nextButton.style.display = 'none';
    }
}

function checkAnswer() {
    const userAnswer = riddleAnswerInput.value.trim().toLowerCase();
    const currentRiddle = riddles[currentRiddleIndex];
    const correctAnswer = currentRiddle.answer.toLowerCase();
    
    if (userAnswer.includes(correctAnswer) || correctAnswer.includes(userAnswer)) {
        resultText.textContent = 'Правильно!';
        resultContainer.classList.add('alert', 'alert-success')
        
    } else {
        resultText.textContent = `Неправильно, правильный ответ ${currentRiddle.answer}`;
        resultContainer.classList.add('alert', 'alert-danger')
    }
    
    resultContainer.style.display = 'block';
}

function fetchNewRiddle() {
    fetch('http://127.0.0.1:5000/api/get_riddle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
             throw new Error( `HTTP error! status: ${response.status}`);
        }
       return response.json()
    })
   .then(data => {
        riddles.push(data);
        displayRiddle();
     })
    .catch(error => {
      console.error('Ошибка получения загадки:', error);
    });
}


checkButton.addEventListener('click', () => {
    checkAnswer();
});

nextButton.addEventListener('click', () => {
     if (currentRiddleIndex === riddles.length -1){
         fetchNewRiddle()
     }
      else{
         currentRiddleIndex++;
          displayRiddle();
        }
});

fetchNewRiddle();