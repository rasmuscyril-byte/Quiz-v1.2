// === Quiz Catalog ===
const quizCatalog = {
    history: {
        title: "Fynsk Fodbold Quiz",
        subtitle: "Gennem Tiderne",
        description: "Baseret på formandens beretninger fra den fynske fodboldhistorie",
        infoText: "Test din viden om fynsk fodbold – fra de tidlige pionerår til moderne tider. Quizzen dækker OB, fynske klubber, legendariske spillere, stadions og de store øjeblikke.",
        questions: quizQuestions
    },
    beretning2024: {
        title: "Formandens Beretning",
        subtitle: "Organisation & Udvikling",
        description: "Tal, fakta og initiativer fra DBU Fyns organisatoriske arbejde",
        infoText: "Test din viden om DBU Fyns organisation, turneringer, dommerarbejde, trænere og de strategiske initiativer der driver fynsk fodbold fremad.",
        questions: quizBeretning2024
    },
    beretning_bredde: {
        title: "Formandens Beretning",
        subtitle: "Bredde & Samfund",
        description: "Breddefodbold, frivillighed og fodboldens rolle i det fynske samfund",
        infoText: "Test din viden om breddefodbold, kvindefodbold, frivillighed, ungdomsarbejde og fodboldens sociale rolle på Fyn – alt sammen baseret på formandens beretninger.",
        questions: quizBeretningBredde
    }
};

// === Quiz State ===
let currentQuestionIndex = 0;
let score = 0;
let answered = false;
let shuffledQuestions = [];
let selectedQuizId = null;
let selectedQuestionCount = 0;

// === DOM Elements ===
const homeScreen = document.getElementById('home-screen');
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

// === Home & Selection ===
function goHome() {
    showScreen(homeScreen);
}

function selectQuiz(quizId) {
    selectedQuizId = quizId;
    const quiz = quizCatalog[quizId];
    const totalAvailable = quiz.questions.length;

    document.getElementById('quiz-title').textContent = quiz.title;
    document.getElementById('quiz-subtitle').textContent = quiz.subtitle;
    document.getElementById('quiz-description').textContent = quiz.description;
    document.getElementById('quiz-info-text').textContent = quiz.infoText;

    // Build count buttons
    const countOptions = [5, 10, 15, totalAvailable];
    // Remove duplicates and filter
    const uniqueCounts = [...new Set(countOptions)].filter(c => c <= totalAvailable);
    const countContainer = document.getElementById('count-buttons');
    countContainer.innerHTML = '';
    selectedQuestionCount = uniqueCounts[uniqueCounts.length - 1]; // default to all

    uniqueCounts.forEach(count => {
        const btn = document.createElement('button');
        btn.className = 'count-btn' + (count === selectedQuestionCount ? ' active' : '');
        btn.textContent = count === totalAvailable ? `Alle (${totalAvailable})` : count;
        btn.addEventListener('click', () => {
            selectedQuestionCount = count;
            countContainer.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
        countContainer.appendChild(btn);
    });

    showScreen(startScreen);
}

// === Quiz Functions ===
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    const quiz = quizCatalog[selectedQuizId];
    shuffledQuestions = shuffleArray(quiz.questions).slice(0, selectedQuestionCount);
    showScreen(quizScreen);
    loadQuestion();
}

function loadQuestion() {
    answered = false;
    const q = shuffledQuestions[currentQuestionIndex];
    const total = shuffledQuestions.length;

    progressBar.style.width = ((currentQuestionIndex / total) * 100) + '%';
    questionCounter.textContent = `Spørgsmål ${currentQuestionIndex + 1} af ${total}`;
    scoreDisplay.textContent = `Score: ${score}`;
    categoryBadge.textContent = q.category;
    questionText.textContent = q.question;

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

    buttons.forEach((btn, index) => {
        btn.classList.add('disabled');
        if (index === q.correct) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && !isCorrect) {
            btn.classList.add('wrong');
        }
    });

    explanationText.textContent = q.explanation;
    explanationBox.classList.remove('hidden');
    nextBtn.classList.remove('hidden');

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

    const resultTitle = document.getElementById('result-title');
    const resultIcon = document.getElementById('result-icon');
    const resultScore = document.getElementById('result-score');
    const resultMessage = document.getElementById('result-message');
    const resultStats = document.getElementById('result-stats');

    if (percentage >= 90) {
        resultTitle.textContent = 'Fantastisk!';
        resultIcon.textContent = '\uD83C\uDFC6';
        resultMessage.textContent = 'Du er en sand ekspert i fynsk fodbold! Formanden ville v\u00e6re stolt.';
    } else if (percentage >= 70) {
        resultTitle.textContent = 'Flot pr\u00e6station!';
        resultIcon.textContent = '\u26BD';
        resultMessage.textContent = 'Du kender din fynske fodbold rigtig godt!';
    } else if (percentage >= 50) {
        resultTitle.textContent = 'Godkendt!';
        resultIcon.textContent = '\uD83D\uDC4F';
        resultMessage.textContent = 'Du har et fornuftigt kendskab til fynsk fodbold, men der er plads til forbedring.';
    } else if (percentage >= 30) {
        resultTitle.textContent = 'Der er plads til forbedring';
        resultIcon.textContent = '\uD83D\uDCD6';
        resultMessage.textContent = 'M\u00e5ske er det tid til at dykke ned i formandens beretninger!';
    } else {
        resultTitle.textContent = '\u00d8v!';
        resultIcon.textContent = '\uD83D\uDE05';
        resultMessage.textContent = 'Tid til at studere formandens beretninger fra DBU Fyn!';
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
    selectQuiz(selectedQuizId);
}
