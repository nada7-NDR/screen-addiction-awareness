"use strict";

const questions = [
    {
        text: "Do you check your phone immediately after waking up?",
        options: ["Always", "Sometimes", "Rarely"]
    },
    {
        text: "Do you feel anxious when your phone isn't with you?",
        options: ["Always", "Sometimes", "Rarely"]
    },
    {
        text: "Do you use your phone during meals or social gatherings?",
        options: ["Always", "Sometimes", "Rarely"]
    },
    {
        text: "Do you lose track of time while using your phone?",
        options: ["Always", "Sometimes", "Rarely"]
    },
    {
        text: "Do you stay up late using your phone?",
        options: ["Always", "Sometimes", "Rarely"]
    },
    {
        text: "Do you check notifications during important tasks?",
        options: ["Always", "Sometimes", "Rarely"]
    },
    {
        text: "Do you feel bored or uncomfortable without a screen?",
        options: ["Always", "Sometimes", "Rarely"]
    }
];

const scores = {
    Always: 3,
    Sometimes: 2,
    Rarely: 1
};

const challenges = [
    "Turn off notifications for an hour.",
    "Read a chapter of a book instead of scrolling.",
    "Go for a 10-minute walk without your phone.",
    "Move social media apps to the last screen.",
    "Keep your phone away during meals.",
    "Bake homemade cookies or cake.",
    "Draw or paint something creative.",
    "Solve a puzzle or play a board game.",
    "Learn a new dance move.",
    "Learn 5 new words in another language.",
    "Organize your room or wardrobe.",
    "Try making a handmade craft.",
    "Write a short story or journal your day.",
    "Try some simple stretching exercises.",
    "Do a random act of kindness.",
    "Build something with LEGO or blocks."
];

const DOM = {
    menuToggle: document.getElementById("menuToggle"),
    navLinks: document.getElementById("navLinks"),
    themeToggle: document.getElementById("themeToggle"),
    assessment: document.getElementById("assessment"),
    startTestBtn: document.getElementById("startTestBtn"),
    quizSection: document.getElementById("quizSection"),
    quizForm: document.getElementById("quizForm"),
    questionContainer: document.getElementById("questionContainer"),
    nextBtn: document.getElementById("nextBtn"),
    progressBar: document.getElementById("progressBar"),
    progressText: document.getElementById("progressText"),
    resultBox: document.getElementById("resultBox"),
    resultIcon: document.getElementById("resultIcon"),
    resultTitle: document.getElementById("resultTitle"),
    scoreValue: document.getElementById("scoreValue"),
    maxScore: document.getElementById("maxScore"),
    scoreMeterFill: document.getElementById("scoreMeterFill"),
    resultMessage: document.getElementById("resultMessage"),
    resultAdvice: document.getElementById("resultAdvice"),
    retakeQuizBtn: document.getElementById("retakeQuizBtn"),
    quizResult: document.getElementById("quizResult"),
    adviceBox: document.getElementById("adviceBox"),
    completeChallengeBtn: document.getElementById("completeChallengeBtn"),
    challengeStatus: document.getElementById("challengeStatus"),
    habitSelection: document.getElementById("habitSelection"),
    backToTop: document.getElementById("backToTop")
};

const state = {
    currentQuestion: 0,
    answers: [],
    currentChallenge: null,
    challengeCompleted: false
};

document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {

    initializeAOS();
    initializeNavigation();
    initializeTheme();
    initializeAssessment();
    initializeChallenge();
    initializeHabits();
    initializeBackToTop();
    initializeScrollEffects();

}

function initializeAOS() {
    if (typeof AOS === "undefined") {
        return;
    }
    AOS.init({
        duration: 800,
        easing: "ease-out-cubic",
        once: true,
        offset: 80
    });
}

function initializeNavigation() {
    if (DOM.menuToggle && DOM.navLinks) {
        DOM.menuToggle.addEventListener("click", toggleMobileMenu);
    }

    if (DOM.navLinks) {
        const links = DOM.navLinks.querySelectorAll("a");
        links.forEach((link) => {
            link.addEventListener("click", () => {
                DOM.navLinks.classList.remove("active");

                if (DOM.menuToggle) {
                    DOM.menuToggle.classList.remove("active");
                }
            });
        });
    }
}

function toggleMobileMenu() {
    if (!DOM.navLinks) {
        return;
    }

    DOM.navLinks.classList.toggle("active");

    if (DOM.menuToggle) {
        DOM.menuToggle.classList.toggle("active");
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem("screenTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        updateThemeButton(true);
    } else {

        document.body.classList.remove("dark-mode");
        updateThemeButton(false);
    }

    if (DOM.themeToggle) {
        DOM.themeToggle.addEventListener("click", toggleTheme);
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem(
        "screenTheme",
        isDark ? "dark" : "light"
    );
    updateThemeButton(isDark);
}

function updateThemeButton(isDark) {
    DOM.themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );

    DOM.themeToggle.setAttribute(
        "title",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );

    const icon = document.getElementById("themeIcon");
    const text = document.getElementById("themeText");

    if (icon) {
        icon.textContent = isDark ? "☀️" : "🌙";
    }

    if (text) {
        text.textContent = isDark ? "Light Mode" : "Dark Mode";
    }
}

function initializeAssessment() {

    if (DOM.startTestBtn) {
        DOM.startTestBtn.addEventListener(
            "click",
            startQuiz
        );
    }

    if (DOM.nextBtn) {
        DOM.nextBtn.addEventListener(
            "click",
            handleNextQuestion
        );
    }

    if (DOM.retakeQuizBtn) {
        DOM.retakeQuizBtn.addEventListener(
            "click",
            startQuiz
        );
    }

    if (DOM.quizForm) {
        DOM.quizForm.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();
            }
        );
    }
}

function startQuiz() {
    state.currentQuestion = 0;
    state.answers = [];

    if (DOM.resultBox) {
        DOM.resultBox.style.display = "none";
    }

    if (DOM.quizSection) {
        DOM.quizSection.style.display = "block";
    }

    if (DOM.quizForm) {
        DOM.quizForm.style.display = "block";
    }

    if (DOM.nextBtn) {
        DOM.nextBtn.textContent = "Next";
        DOM.nextBtn.disabled = false;
    }
    showQuestion();

    if (DOM.quizSection) {
        setTimeout(() => {
            DOM.quizSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 100);
    }
}

function showQuestion() {

    const question =
        questions[state.currentQuestion];

    if (!question) {
        return;
    }

    const questionNumber =
        state.currentQuestion + 1;

    DOM.questionContainer.innerHTML = `

        <div class="question">
            <p class="question-text">

                <strong>
                    Q${questionNumber}.
                </strong>

                ${question.text}
            </p>

            <div class="question-options">

                ${question.options
            .map((option, index) => {

                const optionId =
                    `q${state.currentQuestion}_opt${index}`;

                return `

                            <input
                                type="radio"
                                id="${optionId}"
                                name="q${state.currentQuestion}"
                                value="${option}"
                            >
                            <label for="${optionId}">
                                ${option}
                            </label>

                        `;
            })
            .join("")}

            </div>
        </div>
    `;

    updateProgress();

    const questionElement =
        DOM.questionContainer.querySelector(".question");

    if (questionElement) {
        questionElement.classList.remove("question");

        void questionElement.offsetWidth;

        questionElement.classList.add("question");
    }

    if (DOM.nextBtn) {
        DOM.nextBtn.textContent =
            state.currentQuestion === questions.length - 1
                ? "Finish"
                : "Next";
    }
}


function updateProgress() {
    if (DOM.progressBar) {
        const progress =
            ((state.currentQuestion + 1) /
                questions.length) * 100;

        DOM.progressBar.style.width =
            `${progress}%`;
    }

    if (DOM.progressText) {
        DOM.progressText.textContent =
            `Question ${state.currentQuestion + 1} of ${questions.length}`;
    }
}

function handleNextQuestion() {

    const selected = document.querySelector(
        `input[name="q${state.currentQuestion}"]:checked`
    );

    if (!selected) {
        showQuizValidationMessage();
        return;
    }

    state.answers[state.currentQuestion] =
        scores[selected.value];

    state.currentQuestion++;

    if (state.currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showQuizValidationMessage() {
    let message =
        DOM.questionContainer.querySelector(".validation-message");

    if (!message) {
        message =
            document.createElement("p");

        message.className =
            "validation-message";

        message.setAttribute(
            "role",
            "alert"
        );

        DOM.questionContainer.appendChild(message);
    }

    message.textContent =
        "Please select an answer before continuing.";

    setTimeout(() => {
        if (message) {
            message.remove();
        }
    }, 2500);
}

function showResult() {
    if (!DOM.quizForm || !DOM.resultBox) {
        return;
    }

    const total = state.answers.reduce(
        (sum, score) => sum + score,
        0
    );

    const max = questions.length * 3;
    const percentage = Math.round((total / max) * 100);

    let result;

    if (total >= 16) {
        result = {
            icon: "⚠️",
            title: "High Screen Overuse",
            message: "Your answers suggest strong signs of screen overuse.",
            advice: "Try creating screen-free periods during your day and replacing some screen activities with offline activities."
        };
    } else if (total >= 11) {
        result = {
            icon: "🙂",
            title: "Moderate Screen Overuse",
            message: "You show some tendencies toward screen overuse.",
            advice: "Try taking regular screen breaks, reducing unnecessary notifications, and spending more time offline."
        };
    } else {
        result = {
            icon: "🎉",
            title: "Healthy Screen Habits",
            message: "Your answers suggest that you are managing your screen use relatively well.",
            advice: "Keep maintaining balanced screen habits and make time for activities away from screens."
        };
    }

    DOM.quizForm.style.display = "none";

    if (DOM.resultIcon) DOM.resultIcon.textContent = result.icon;
    if (DOM.resultTitle) DOM.resultTitle.textContent = result.title;
    if (DOM.scoreValue) DOM.scoreValue.textContent = total;
    if (DOM.maxScore) DOM.maxScore.textContent = max;
    if (DOM.resultMessage) DOM.resultMessage.textContent = result.message;
    if (DOM.resultAdvice) DOM.resultAdvice.textContent = result.advice;

    if (DOM.scoreMeterFill) {
        DOM.scoreMeterFill.style.width = `${percentage}%`;
    }

    DOM.resultBox.style.display = "block";

    localStorage.setItem("screenAddictionScore", total);
    localStorage.setItem("screenAddictionScorePercentage", percentage);

    setTimeout(() => {
        DOM.resultBox.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }, 150);
}


function checkAnswer(answer) {
    const responses = {
        a: {
            text:
                "Awesome! You're managing your screen time well.",
            className: "positive"
        },

        b: {
            text:
                "Not bad, but you can still create more screen-free time.",
            className: "neutral"
        },

        c: {
            text:
                "Try creating more screen-free moments in your day.",
            className: "warning"
        }
    };

    const response = responses[answer];

    if (!response) {
        return;
    }

    DOM.quizResult.textContent =
        response.text;

    DOM.quizResult.classList.remove(
        "positive",
        "neutral",
        "warning"
    );

    DOM.quizResult.classList.add(
        response.className
    );
}

function initializeChallenge() {
    if (DOM.completeChallengeBtn) {
        DOM.completeChallengeBtn.addEventListener(
            "click",
            completeChallenge
        );
    }
}

function showAdvice() {
    if (!DOM.adviceBox) {
        return;
    }

    let randomIndex;

    do {
        randomIndex =
            Math.floor(
                Math.random() * challenges.length
            );
    } while (
        challenges.length > 1 &&
        challenges[randomIndex] === state.currentChallenge
    );

    state.currentChallenge =
        challenges[randomIndex];

    state.challengeCompleted = false;

    DOM.adviceBox.textContent =
        state.currentChallenge;

    if (DOM.challengeStatus) {

        DOM.challengeStatus.textContent =
            "Challenge waiting for you!";

        DOM.challengeStatus.classList.remove(
            "completed"
        );
    }

    if (DOM.completeChallengeBtn) {
        DOM.completeChallengeBtn.disabled =
            false;

        DOM.completeChallengeBtn.textContent =
            "Mark as Completed";
    }
}

function completeChallenge() {
    if (!state.currentChallenge) {
        showAdvice();
        return;
    }

    if (state.challengeCompleted) {
        return;
    }

    state.challengeCompleted = true;

    if (DOM.challengeStatus) {
        DOM.challengeStatus.textContent =
            "🎉 Challenge completed! Great job!";

        DOM.challengeStatus.classList.add(
            "completed"
        );
    }

    if (DOM.completeChallengeBtn) {
        DOM.completeChallengeBtn.disabled =
            true;

        DOM.completeChallengeBtn.textContent =
            "Completed ✓";
    }

    localStorage.setItem(
        "lastCompletedChallenge",
        state.currentChallenge
    );
}

function initializeHabits() {
    if (!DOM.habitSelection) {
        return;
    }

    const habitCards =
        DOM.habitSelection.querySelectorAll(
            "[data-habit]"
        );

    habitCards.forEach((card) => {
        card.addEventListener(
            "click",
            () => {
                toggleHabit(card);
            }
        );
        card.addEventListener(
            "keydown",
            (event) => {
                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    event.preventDefault();

                    toggleHabit(card);
                }
            }
        );
    });
}

function toggleHabit(card) {
    if (!card) {
        return;
    }

    card.classList.toggle("selected");

    const habit =
        card.dataset.habit;

    if (!habit) {
        return;
    }

    let savedHabits =
        getSavedHabits();

    if (card.classList.contains("selected")) {

        if (!savedHabits.includes(habit)) {
            savedHabits.push(habit);
        }

    } else {
        savedHabits =
            savedHabits.filter(
                item => item !== habit
            );
    }

    localStorage.setItem(
        "selectedHabits",
        JSON.stringify(savedHabits)
    );
}

function getSavedHabits() {
    try {
        const saved =
            JSON.parse(
                localStorage.getItem(
                    "selectedHabits"
                )
            );

        return Array.isArray(saved)
            ? saved
            : [];
    } catch (error) {

        return [];
    }
}

function scrollToSection(id) {
    const section =
        document.getElementById(id);

    if (!section) {
        return;
    }
    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function initializeBackToTop() {
    DOM.backToTop.addEventListener(
        "click",
        () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );
}

function initializeScrollEffects() {
    window.addEventListener(
        "scroll",
        handleScroll,
        { passive: true }
    );
}

function handleScroll() {
    if (DOM.backToTop) {
        if (window.scrollY > 500) {
            DOM.backToTop.classList.add(
                "show"
            );
        } else {
            DOM.backToTop.classList.remove(
                "show"
            );
        }
    }
}

document.addEventListener(
    "keydown",
    (event) => {
        if (event.key === "Escape") {

            if (DOM.navLinks) {
                DOM.navLinks.classList.remove("active");
            }
            if (DOM.menuToggle) {
                DOM.menuToggle.classList.remove("active");
            }
        }
    }
);

