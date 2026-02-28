// === Quiz State ===
let currentQuestionIndex = 0;
let score = 0;
let answered = false;
let shuffledQuestions = [];

// === DOM Elements ===
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const progressBar = document.getElementById('progress-bar');
const questionCounter = document.getElementById('question-counter');
const scoreDisplay = document.getElementById('score-display');
const categoryBadge = document.getElementById('category-badge');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const explanationBox = document.getElementById('explanation-box');
const explanationText = document.getElementById('explanation-text');
const nextBtn = document.getElementById('next-btn');

// === Utility ===
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

// === Quiz Functions ===
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    shuffledQuestions = shuffleArray(quizQuestions);
    showScreen(quizScreen);
    loadQuestion();
}

function loadQuestion() {
    answered = false;
    const q = shuffledQuestions[currentQuestionIndex];
    const total = shuffledQuestions.length;

    // Update progress
    progressBar.style.width = ((currentQuestionIndex / total) * 100) + '%';
    questionCounter.textContent = `Spørgsmål ${currentQuestionIndex + 1} af ${total}`;
    scoreDisplay.textContent = `Score: ${score}`;

    // Category badge
    categoryBadge.textContent = q.category;

    // Question text
    questionText.textContent = q.question;

    // Options
    const letters = ['A', 'B', 'C', 'D'];
    optionsContainer.innerHTML = '';
    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `
            <span class="option-letter">${letters[index]}</span>
            <span>${option}</span>
        `;
        btn.addEventListener('click', () => selectAnswer(index));
        optionsContainer.appendChild(btn);
    });

    // Hide explanation and next button
    explanationBox.classList.add('hidden');
    nextBtn.classList.add('hidden');
}

function selectAnswer(selectedIndex) {
    if (answered) return;
    answered = true;

    const q = shuffledQuestions[currentQuestionIndex];
    const buttons = optionsContainer.querySelectorAll('.option-btn');
    const isCorrect = selectedIndex === q.correct;

    if (isCorrect) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
    }

    // Mark buttons
    buttons.forEach((btn, index) => {
        btn.classList.add('disabled');
        if (index === q.correct) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && !isCorrect) {
            btn.classList.add('wrong');
        }
    });

    // Show explanation
    explanationText.textContent = q.explanation;
    explanationBox.classList.remove('hidden');

    // Show next button
    nextBtn.classList.remove('hidden');

    // Update button text for last question
    if (currentQuestionIndex === shuffledQuestions.length - 1) {
        nextBtn.textContent = 'Se resultat';
    } else {
        nextBtn.textContent = 'Næste spørgsmål';
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= shuffledQuestions.length) {
        showResults();
    } else {
        loadQuestion();
    }
}

function showResults() {
    showScreen(resultScreen);

    const total = shuffledQuestions.length;
    const percentage = Math.round((score / total) * 100);
    const wrong = total - score;

    // Title and icon
    const resultTitle = document.getElementById('result-title');
    const resultIcon = document.getElementById('result-icon');
    const resultScore = document.getElementById('result-score');
    const resultMessage = document.getElementById('result-message');
    const resultStats = document.getElementById('result-stats');

    if (percentage >= 90) {
        resultTitle.textContent = 'Fantastisk!';
        resultIcon.textContent = '🏆';
        resultMessage.textContent = 'Du er en sand ekspert i fynsk fodboldhistorie! Formanden ville være stolt.';
    } else if (percentage >= 70) {
        resultTitle.textContent = 'Flot præstation!';
        resultIcon.textContent = '⚽';
        resultMessage.textContent = 'Du kender din fynske fodboldhistorie rigtig godt. Du har tydeligvis læst formandens beretninger!';
    } else if (percentage >= 50) {
        resultTitle.textContent = 'Godkendt!';
        resultIcon.textContent = '👏';
        resultMessage.textContent = 'Du har et fornuftigt kendskab til fynsk fodbold, men der er plads til forbedring.';
    } else if (percentage >= 30) {
        resultTitle.textContent = 'Der er plads til forbedring';
        resultIcon.textContent = '📖';
        resultMessage.textContent = 'Måske er det tid til at dykke ned i formandens beretninger og fynsk fodboldhistorie!';
    } else {
        resultTitle.textContent = 'Øv!';
        resultIcon.textContent = '😅';
        resultMessage.textContent = 'Det ser ud til, at fynsk fodbold er nyt territorium for dig. Tid til at studere formandens beretninger!';
    }

    resultScore.textContent = `${score} af ${total} rigtige (${percentage}%)`;

    resultStats.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${score}</div>
            <div class="stat-label">Rigtige</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${wrong}</div>
            <div class="stat-label">Forkerte</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${percentage}%</div>
            <div class="stat-label">Procent</div>
        </div>
    `;
}

function restartQuiz() {
    showScreen(startScreen);
}
