// ============================================================
//  FYNSK FODBOLD QUIZ – Kahoot-inspireret multiplayer
//  Kommunikation via PeerJS (WebRTC peer-to-peer)
// ============================================================

const QUESTION_TIME = 20; // sekunder per spørgsmål
const SHAPES = ['\u25B2', '\u25C6', '\u25CF', '\u25A0'];         // ▲ ◆ ● ■
const COLORS = ['red', 'blue', 'yellow', 'green-opt'];
const PEER_PREFIX = 'fynquiz';

const quizCatalog = {
    history:          { title: 'Fynsk Fodbold Gennem Tiderne', questions: quizQuestions },
    beretning2024:    { title: 'Formandens Beretning: Organisation', questions: quizBeretning2024 },
    beretning_bredde: { title: 'Formandens Beretning: Bredde', questions: quizBeretningBredde },
    beretning2025:    { title: 'Forpersonens Beretning 2025', questions: quizBeretning2025 }
};

// ========================= STATE =========================
let role = null;   // 'facilitator' | 'player'
let peer = null;

// Facilitator state
const F = {
    gameCode: '',
    conns: new Map(),       // peerId → DataConnection
    players: new Map(),     // peerId → { name, score, answered, answerIndex, timeMs, scoreThisRound }
    quizId: null,
    questions: [],
    questionCount: 0,
    currentIndex: 0,
    phase: 'lobby',         // lobby | question | reveal | leaderboard | final
    timerInterval: null,
    timeRemaining: 0,
    questionStartTime: 0
};

// Player state
const P = {
    conn: null,
    name: '',
    score: 0,
    rank: 0,
    answered: false,
    questionStart: 0
};

// ========================= UTILITY =========================
function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function generateCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

function calcScore(responseMs) {
    const ratio = Math.min(responseMs / (QUESTION_TIME * 1000), 1);
    return Math.round(1000 * (1 - ratio / 2));
}

function cleanup() {
    clearInterval(F.timerInterval);
    if (peer) { try { peer.destroy(); } catch (_) {} }
    peer = null;
    F.conns.clear();
    F.players.clear();
    P.conn = null;
}

// ========================= NAVIGATION =========================
function goHome() {
    cleanup();
    role = null;
    // Reset UI state
    document.getElementById('setup-options').style.display = 'none';
    document.querySelectorAll('.quiz-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('p-join-error').textContent = '';
    document.getElementById('p-code-input').value = '';
    document.getElementById('p-name-input').value = '';
    showScreen('home');
}

function goToSetup() {
    role = 'facilitator';
    F.quizId = null;
    showScreen('f-setup');
}

function goToJoin() {
    role = 'player';
    showScreen('p-join');
    document.getElementById('p-code-input').focus();
}

// ============================================================
//  FACILITATOR
// ============================================================

function selectQuizForGame(quizId) {
    F.quizId = quizId;
    document.querySelectorAll('#f-setup .quiz-card').forEach(c => {
        c.classList.toggle('selected', c.dataset.quiz === quizId);
    });
    // Build count buttons
    const total = quizCatalog[quizId].questions.length;
    const opts = [5, 10, 15, total].filter(n => n <= total);
    const unique = [...new Set(opts)];
    F.questionCount = unique[unique.length - 1];
    const container = document.getElementById('f-count-buttons');
    container.innerHTML = '';
    unique.forEach(n => {
        const btn = document.createElement('button');
        btn.className = 'count-btn' + (n === F.questionCount ? ' active' : '');
        btn.textContent = n === total ? 'Alle (' + total + ')' : n;
        btn.onclick = () => {
            F.questionCount = n;
            container.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };
        container.appendChild(btn);
    });
    document.getElementById('setup-options').style.display = 'block';
}

function createGame() {
    if (!F.quizId) return;
    F.gameCode = generateCode();
    F.questions = shuffleArray(quizCatalog[F.quizId].questions).slice(0, F.questionCount);
    F.currentIndex = 0;
    F.players.clear();
    F.conns.clear();
    F.phase = 'lobby';

    document.getElementById('f-pin-display').textContent = F.gameCode;
    document.getElementById('f-lobby-status').textContent = 'Opretter forbindelse...';
    document.getElementById('f-start-btn').disabled = true;
    document.getElementById('f-player-list').innerHTML = '';
    document.getElementById('f-player-count').textContent = '0';
    showScreen('f-lobby');

    // Create PeerJS peer
    peer = new Peer(PEER_PREFIX + F.gameCode);
    peer.on('open', () => {
        document.getElementById('f-lobby-status').textContent = 'Klar! Deltagere kan nu tilslutte sig.';
    });
    peer.on('connection', conn => fHandleConnection(conn));
    peer.on('error', err => {
        console.error('Peer error:', err);
        if (err.type === 'unavailable-id') {
            F.gameCode = generateCode();
            document.getElementById('f-pin-display').textContent = F.gameCode;
            peer.destroy();
            peer = new Peer(PEER_PREFIX + F.gameCode);
            peer.on('open', () => {
                document.getElementById('f-lobby-status').textContent = 'Klar! Deltagere kan nu tilslutte sig.';
            });
            peer.on('connection', conn => fHandleConnection(conn));
        }
    });
}

function fHandleConnection(conn) {
    conn.on('open', () => {
        conn.on('data', data => fHandleMessage(conn, data));
        conn.on('close', () => fRemovePlayer(conn.peer));
    });
}

function fHandleMessage(conn, data) {
    if (data.type === 'join') {
        F.conns.set(conn.peer, conn);
        F.players.set(conn.peer, {
            name: data.name,
            score: 0,
            answered: false,
            answerIndex: -1,
            timeMs: 0,
            scoreThisRound: 0
        });
        conn.send({ type: 'welcome', name: data.name });
        fUpdateLobby();
        // If game already in progress, let them wait for next question
        if (F.phase !== 'lobby') {
            conn.send({ type: 'wait', message: 'Spillet er i gang. Du er med fra n\u00e6ste sp\u00f8rgsm\u00e5l.' });
        }
    }
    if (data.type === 'answer' && F.phase === 'question') {
        const player = F.players.get(conn.peer);
        if (player && !player.answered) {
            player.answered = true;
            player.answerIndex = data.answerIndex;
            player.timeMs = data.timeMs;
            fUpdateAnswerCount();
            // Auto-end if all answered
            if (fAllAnswered()) fEndQuestion();
        }
    }
}

function fRemovePlayer(peerId) {
    F.conns.delete(peerId);
    F.players.delete(peerId);
    fUpdateLobby();
}

function fUpdateLobby() {
    const list = document.getElementById('f-player-list');
    list.innerHTML = '';
    F.players.forEach(p => {
        const chip = document.createElement('span');
        chip.className = 'player-chip';
        chip.textContent = p.name;
        list.appendChild(chip);
    });
    document.getElementById('f-player-count').textContent = F.players.size;
    document.getElementById('f-start-btn').disabled = F.players.size === 0;
}

function fAllAnswered() {
    let all = true;
    F.players.forEach(p => { if (!p.answered) all = false; });
    return F.players.size > 0 && all;
}

function fUpdateAnswerCount() {
    let count = 0;
    F.players.forEach(p => { if (p.answered) count++; });
    document.getElementById('f-q-answers').textContent = count + ' / ' + F.players.size + ' svar';
}

// --- Game flow ---

function fStartGame() {
    F.phase = 'question';
    F.currentIndex = 0;
    fBroadcast({ type: 'game_start', totalQuestions: F.questions.length });
    fShowQuestion();
}

function fShowQuestion() {
    F.phase = 'question';
    const q = F.questions[F.currentIndex];
    F.players.forEach(p => {
        p.answered = false;
        p.answerIndex = -1;
        p.timeMs = 0;
        p.scoreThisRound = 0;
    });

    // Update facilitator UI
    document.getElementById('f-q-counter').textContent =
        'Sp\u00f8rgsm\u00e5l ' + (F.currentIndex + 1) + ' af ' + F.questions.length;
    document.getElementById('f-q-answers').textContent = '0 / ' + F.players.size + ' svar';
    document.getElementById('f-question-text').textContent = q.question;
    document.getElementById('f-controls').style.display = 'none';

    // Build options
    const grid = document.getElementById('f-options-grid');
    grid.innerHTML = '';
    q.options.forEach((text, i) => {
        const div = document.createElement('div');
        div.className = 'f-option ' + COLORS[i];
        div.id = 'f-opt-' + i;
        div.innerHTML =
            '<span class="shape">' + SHAPES[i] + '</span>' +
            '<span class="opt-text">' + text + '</span>' +
            '<span class="opt-count">0</span>';
        grid.appendChild(div);
    });

    // Remove any lingering explanation
    const oldExp = document.querySelector('.f-explanation');
    if (oldExp) oldExp.remove();

    showScreen('f-question');
    fStartTimer();

    // Send to players
    fBroadcast({
        type: 'question',
        index: F.currentIndex,
        question: q.question,
        options: q.options,
        timeLimit: QUESTION_TIME
    });
}

function fStartTimer() {
    F.timeRemaining = QUESTION_TIME * 10; // tenths
    F.questionStartTime = Date.now();
    const timerText = document.getElementById('f-timer-text');
    const timerBar = document.getElementById('f-timer-bar');
    const timerCircle = document.getElementById('f-timer-circle');
    clearInterval(F.timerInterval);

    timerText.textContent = QUESTION_TIME;
    timerBar.style.width = '100%';
    timerBar.classList.remove('urgent');
    timerCircle.classList.remove('urgent');

    F.timerInterval = setInterval(() => {
        F.timeRemaining--;
        const secs = Math.ceil(F.timeRemaining / 10);
        const pct = (F.timeRemaining / (QUESTION_TIME * 10)) * 100;
        timerText.textContent = secs;
        timerBar.style.width = pct + '%';
        if (secs <= 5) {
            timerBar.classList.add('urgent');
            timerCircle.classList.add('urgent');
        }
        if (F.timeRemaining <= 0) {
            clearInterval(F.timerInterval);
            fEndQuestion();
        }
    }, 100);
}

function fEndQuestion() {
    if (F.phase === 'reveal') return; // prevent double
    F.phase = 'reveal';
    clearInterval(F.timerInterval);

    const q = F.questions[F.currentIndex];

    // Calculate scores
    F.players.forEach(p => {
        if (p.answered && p.answerIndex === q.correct) {
            p.scoreThisRound = calcScore(p.timeMs);
            p.score += p.scoreThisRound;
        } else {
            p.scoreThisRound = 0;
        }
    });

    // Count answers per option
    const counts = [0, 0, 0, 0];
    F.players.forEach(p => {
        if (p.answered && p.answerIndex >= 0 && p.answerIndex < 4) counts[p.answerIndex]++;
    });

    // Update facilitator UI - highlight correct, dim wrong, show counts
    q.options.forEach((_, i) => {
        const el = document.getElementById('f-opt-' + i);
        if (i === q.correct) {
            el.classList.add('correct-highlight');
        } else {
            el.classList.add('dimmed');
        }
        el.querySelector('.opt-count').textContent = counts[i];
        el.classList.add('show-count');
    });

    // Show explanation
    const expDiv = document.createElement('div');
    expDiv.className = 'f-explanation';
    expDiv.textContent = q.explanation;
    document.getElementById('f-options-grid').after(expDiv);

    // Show controls
    document.getElementById('f-controls').style.display = 'block';
    const btn = document.getElementById('f-next-action');
    btn.textContent = 'Vis Scoreboard';

    // Build rankings
    const rankings = fGetRankings();

    // Send reveal to players
    F.players.forEach((p, peerId) => {
        const rank = rankings.findIndex(r => r.peerId === peerId) + 1;
        const conn = F.conns.get(peerId);
        if (conn && conn.open) {
            conn.send({
                type: 'reveal',
                correct: q.correct,
                explanation: q.explanation,
                yourScore: p.scoreThisRound,
                yourTotal: p.score,
                yourRank: rank,
                totalPlayers: F.players.size
            });
        }
    });
}

function fGetRankings() {
    const arr = [];
    F.players.forEach((p, peerId) => {
        arr.push({ peerId, name: p.name, score: p.score, delta: p.scoreThisRound });
    });
    arr.sort((a, b) => b.score - a.score);
    return arr;
}

function fNextAction() {
    // From reveal → leaderboard
    fShowLeaderboard();
}

function fShowLeaderboard() {
    F.phase = 'leaderboard';
    const rankings = fGetRankings();
    const list = document.getElementById('f-lb-list');
    list.innerHTML = '';

    const top = rankings.slice(0, 5);
    top.forEach((r, i) => {
        const row = document.createElement('div');
        row.className = 'lb-row';
        row.style.animationDelay = (i * 0.1) + 's';
        row.innerHTML =
            '<span class="lb-rank">' + (i + 1) + '</span>' +
            '<span class="lb-name">' + escapeHtml(r.name) + '</span>' +
            '<span class="lb-score">' + r.score + '</span>' +
            (r.delta > 0 ? '<span class="lb-delta">+' + r.delta + '</span>' : '');
        list.appendChild(row);
    });

    const btn = document.getElementById('f-lb-next');
    if (F.currentIndex >= F.questions.length - 1) {
        btn.textContent = 'Vis Endelige Resultat';
    } else {
        btn.textContent = 'N\u00e6ste Sp\u00f8rgsm\u00e5l';
    }

    showScreen('f-leaderboard');

    // Send leaderboard to players
    fBroadcast({
        type: 'leaderboard',
        rankings: rankings.map((r, i) => ({ name: r.name, score: r.score, rank: i + 1 }))
    });
}

function fNextFromLeaderboard() {
    F.currentIndex++;
    if (F.currentIndex >= F.questions.length) {
        fShowFinal();
    } else {
        fShowQuestion();
    }
}

function fShowFinal() {
    F.phase = 'final';
    const rankings = fGetRankings();

    // Podium
    const podium = document.getElementById('f-podium');
    podium.innerHTML = '';
    const medals = ['\uD83E\uDD47', '\uD83E\uDD48', '\uD83E\uDD49']; // 🥇🥈🥉
    const classes = ['second', 'first', 'third'];
    const order = [1, 0, 2]; // display order: 2nd, 1st, 3rd

    order.forEach(idx => {
        if (idx < rankings.length) {
            const r = rankings[idx];
            const div = document.createElement('div');
            div.className = 'podium-place ' + classes[idx];
            div.innerHTML =
                '<span class="podium-medal">' + medals[idx] + '</span>' +
                '<span class="podium-name">' + escapeHtml(r.name) + '</span>' +
                '<span class="podium-score">' + r.score + ' point</span>';
            podium.appendChild(div);
        }
    });

    // Full list
    const fullLb = document.getElementById('f-full-lb');
    fullLb.innerHTML = '';
    rankings.forEach((r, i) => {
        if (i >= 3) { // skip top 3, already in podium
            const row = document.createElement('div');
            row.className = 'full-lb-row';
            row.innerHTML =
                '<span class="full-lb-rank">' + (i + 1) + '</span>' +
                '<span class="full-lb-name">' + escapeHtml(r.name) + '</span>' +
                '<span class="full-lb-score">' + r.score + '</span>';
            fullLb.appendChild(row);
        }
    });

    showScreen('f-final');

    // Send final to players
    F.players.forEach((p, peerId) => {
        const rank = rankings.findIndex(r => r.peerId === peerId) + 1;
        const conn = F.conns.get(peerId);
        if (conn && conn.open) {
            conn.send({
                type: 'game_end',
                yourRank: rank,
                yourScore: p.score,
                totalPlayers: F.players.size
            });
        }
    });
}

function fBroadcast(msg) {
    F.conns.forEach(conn => {
        if (conn.open) conn.send(msg);
    });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ============================================================
//  PLAYER
// ============================================================

function pJoinGame() {
    const code = document.getElementById('p-code-input').value.trim();
    const name = document.getElementById('p-name-input').value.trim();
    const errEl = document.getElementById('p-join-error');
    errEl.textContent = '';

    if (!code || code.length !== 6) {
        errEl.textContent = 'Indtast en 6-cifret spilkode.';
        return;
    }
    if (!name) {
        errEl.textContent = 'Indtast dit navn.';
        return;
    }

    P.name = name;
    P.score = 0;
    P.rank = 0;
    const joinBtn = document.getElementById('p-join-btn');
    joinBtn.disabled = true;
    joinBtn.textContent = 'Opretter forbindelse...';

    peer = new Peer();
    peer.on('open', () => {
        const conn = peer.connect(PEER_PREFIX + code, { reliable: true });
        P.conn = conn;

        const timeout = setTimeout(() => {
            errEl.textContent = 'Kunne ikke finde spillet. Tjek koden.';
            joinBtn.disabled = false;
            joinBtn.textContent = 'Deltag';
            try { peer.destroy(); } catch (_) {}
            peer = null;
        }, 8000);

        conn.on('open', () => {
            clearTimeout(timeout);
            conn.send({ type: 'join', name: P.name });
        });

        conn.on('data', data => pHandleMessage(data));

        conn.on('close', () => {
            // If we're in the game, just show info
            if (document.getElementById('p-lobby').classList.contains('active') ||
                document.getElementById('p-question').classList.contains('active') ||
                document.getElementById('p-result').classList.contains('active')) {
                // Show a simple notice
            }
        });

        conn.on('error', () => {
            clearTimeout(timeout);
            errEl.textContent = 'Fejl i forbindelsen. Pr\u00f8v igen.';
            joinBtn.disabled = false;
            joinBtn.textContent = 'Deltag';
        });
    });

    peer.on('error', err => {
        console.error('Player peer error:', err);
        if (err.type === 'peer-unavailable') {
            errEl.textContent = 'Spillet blev ikke fundet. Tjek koden og pr\u00f8v igen.';
        } else {
            errEl.textContent = 'Forbindelsesfejl. Pr\u00f8v igen.';
        }
        joinBtn.disabled = false;
        joinBtn.textContent = 'Deltag';
    });
}

function pHandleMessage(data) {
    switch (data.type) {
        case 'welcome':
            document.getElementById('p-name-show').textContent = P.name;
            showScreen('p-lobby');
            break;

        case 'wait':
            document.getElementById('p-name-show').textContent = P.name;
            showScreen('p-lobby');
            break;

        case 'game_start':
            P.totalQuestions = data.totalQuestions;
            break;

        case 'question':
            pShowQuestion(data);
            break;

        case 'reveal':
            pShowReveal(data);
            break;

        case 'leaderboard':
            // Player stays on result screen during leaderboard
            break;

        case 'game_end':
            pShowFinal(data);
            break;
    }
}

function pShowQuestion(data) {
    P.answered = false;
    P.questionStart = Date.now();
    P.score = P.score || 0;

    document.getElementById('p-q-counter').textContent =
        'Sp\u00f8rgsm\u00e5l ' + (data.index + 1) + (P.totalQuestions ? ' af ' + P.totalQuestions : '');
    document.getElementById('p-q-score').textContent = P.score + ' point';
    document.getElementById('p-question-text').textContent = data.question;

    const container = document.getElementById('p-options');
    container.innerHTML = '';
    data.options.forEach((text, i) => {
        const btn = document.createElement('button');
        btn.className = 'p-option ' + COLORS[i];
        btn.innerHTML = '<span class="shape">' + SHAPES[i] + '</span><span>' + text + '</span>';
        btn.onclick = () => pSelectAnswer(i, btn, container);
        container.appendChild(btn);
    });

    // Timer
    const bar = document.getElementById('p-timer-bar');
    bar.style.width = '100%';
    bar.classList.remove('urgent');
    pStartTimer(data.timeLimit);

    showScreen('p-question');
}

let pTimerInterval = null;
function pStartTimer(secs) {
    clearInterval(pTimerInterval);
    let remaining = secs * 10;
    const bar = document.getElementById('p-timer-bar');
    pTimerInterval = setInterval(() => {
        remaining--;
        const pct = (remaining / (secs * 10)) * 100;
        bar.style.width = pct + '%';
        if (remaining <= 50) bar.classList.add('urgent');
        if (remaining <= 0) clearInterval(pTimerInterval);
    }, 100);
}

function pSelectAnswer(index, btn, container) {
    if (P.answered) return;
    P.answered = true;
    clearInterval(pTimerInterval);

    const timeMs = Date.now() - P.questionStart;

    // Lock all buttons
    container.querySelectorAll('.p-option').forEach(b => b.classList.add('locked'));
    btn.classList.add('selected');

    // Send to facilitator
    if (P.conn && P.conn.open) {
        P.conn.send({ type: 'answer', answerIndex: index, timeMs: timeMs });
    }
}

function pShowReveal(data) {
    clearInterval(pTimerInterval);
    P.score = data.yourTotal;
    P.rank = data.yourRank;

    const box = document.getElementById('p-result-box');
    const isCorrect = data.yourScore > 0;

    box.className = 'p-result-box ' + (isCorrect ? 'correct' : 'wrong');
    document.getElementById('p-result-emoji').textContent = isCorrect ? '\u2705' : '\u274C';
    document.getElementById('p-result-title').textContent = isCorrect ? 'Rigtigt!' : 'Forkert!';
    document.getElementById('p-result-points').textContent = isCorrect ? '+' + data.yourScore + ' point' : '+0 point';
    document.getElementById('p-result-total').textContent = 'Total: ' + data.yourTotal + ' point';
    document.getElementById('p-result-rank').textContent =
        'Du er nummer ' + data.yourRank + ' af ' + data.totalPlayers;

    showScreen('p-result');
}

function pShowFinal(data) {
    clearInterval(pTimerInterval);
    const emoji = data.yourRank === 1 ? '\uD83C\uDFC6' :
                  data.yourRank === 2 ? '\uD83E\uDD48' :
                  data.yourRank === 3 ? '\uD83E\uDD49' : '\u2B50';
    document.getElementById('p-final-emoji').textContent = emoji;
    document.getElementById('p-final-rank').textContent =
        'Nr. ' + data.yourRank + ' af ' + data.totalPlayers;
    document.getElementById('p-final-score').textContent = data.yourScore + ' point i alt';
    showScreen('p-final');
}
