
const questionGroups = [
    [
        {
            question: "الكميات المتجهة تحدد بـ:",
            options: ["المقدار", "وحدة القياس", "اتجاه", "جميع ما سبق"],
            correct: 3
        },
        {
            question: "هو قوة تعمل عمل عدة قوى:",
            options: ["جمع القوى", "محصلة القوة", "القوة الكلية", "جميع ما سبق صحيح"],
            correct: 3
        }
    ],
    [
        {
            question: "إذا كانت محصلة متجهين هي 13 للمتجهين 7 و6 فإن الزاوية بينهما:",
            options: ["متوازيان بعكس الاتجاه", "زاوية 180", "زاوية 0 أو 360", "زاوية 90"],
            correct: 2
        }
    ],
    [
        {
            question: "متجه طوله 6 م/ث نحو الشمال الغربي، فإن معكوسه:",
            options: ["جنوب غربي", "جنوب شرقي", "شمال شرقي", "شمال شرقي"],
            correct: 1
        }
    ],
    [
        {
            question: "محصلة متجهين متعامدين كما في الشكل هي:",
            options: ["10 نيوتن وزاوية 36.8", "6 نيوتن", "14 نيوتن وزاوية 36.8", "10 نيوتن وزاوية 53"],
            correct: 2
        }
    ],
    [
        {
            question: "القوة والوزن والسرعة والتسارع هي كميات:",
            options: ["لها نفس وحدة القياس", "لا تجمع جبرياً", "يحددون بمقدار ووحدة فقط", "كميات قياسية"],
            correct: 1
        }
    ],
    [
        {
            question: "إذا كانت المحصلة أكبرها 10 وأقلها 3، فإن المتجهين هما:",
            options: ["2 و8", "3 و7", "5 و5", "3 و-13"],
            correct: 1
        }
    ]
];

function getRandomQuestions() {
    return questionGroups.map(group => group[Math.floor(Math.random() * group.length)]);
}

let selectedQuestions = getRandomQuestions();
let timeLeft = 420;
let timerInterval;

function displayQuiz() {
    const quizDiv = document.getElementById('quiz');
    quizDiv.innerHTML = '';
    selectedQuestions.forEach((q, index) => {
        const qDiv = document.createElement('div');
        qDiv.classList.add('question');
        qDiv.innerHTML = `<p><strong>السؤال ${index + 1}:</strong> ${q.question}</p>` +
            q.options.map((opt, i) => `
                <label><input type="radio" name="q${index}" value="${i}"> ${opt}</label><br>
            `).join('');
        quizDiv.appendChild(qDiv);
    });
}

function startTimer() {
    const timerDisplay = document.getElementById('timer');
    timerInterval = setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerDisplay.textContent = "الوقت المتبقي: " + minutes + ":" + (seconds < 10 ? '0' + seconds : seconds);
        if (timeLeft-- <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
        }
    }, 1000);
}

function submitQuiz() {
    clearInterval(timerInterval);
    let name = document.getElementById('studentName').value.trim();
    let group = document.getElementById('studentClass').value.trim();
    let score = 0;
    let total = selectedQuestions.length;
    const answers = [];

    selectedQuestions.forEach((q, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        let isCorrect = selected && parseInt(selected.value) === q.correct;
        if (isCorrect) score++;
        answers.push({
            question: q.question,
            selected: selected ? selected.value : "لم يجب",
            correct: q.correct
        });
    });

    document.getElementById('result').textContent = "النتيجة: " + score + " من " + total;

    const csvRow = `"${name}","${group}",${score},"${answers.map(a => a.selected).join(';')}"\n`;
    fetch('https://script.google.com/macros/s/AKfycbxm8aZ-eDDmJKhCe0OdMjpA8hfDD1Sm90GnrUIbj0xks7OpHoxEAeNHu6X-uOz31on1/exec', {
        method: "POST",
        body: JSON.stringify({
            name: name,
            group: group,
            score: score,
            answers: answers.map(a => a.selected)
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => console.log("تم الإرسال")).catch(err => console.error("خطأ في الإرسال", err));

}

displayQuiz();
startTimer();
