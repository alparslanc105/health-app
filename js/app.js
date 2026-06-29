let lang = "en";

// =====================
// TRANSLATIONS
// =====================

const translations = {
    en: {
        title: "FitTrack",
        dashboard: "Dashboard",
        addExercise: "Add Exercise"
    },
    nl: {
        title: "FitTrack",
        dashboard: "Dashboard",
        addExercise: "Oefening Toevoegen"
    }
};

// =====================
// STORAGE
// =====================

const getExercises = () => JSON.parse(localStorage.getItem("exercises")) || [];
const saveExercises = (data) => localStorage.setItem("exercises", JSON.stringify(data));

const getWorkouts = () => JSON.parse(localStorage.getItem("workouts")) || [];
const saveWorkouts = (data) => localStorage.setItem("workouts", JSON.stringify(data));

// =====================
// ELEMENTS
// =====================

const exerciseList = document.getElementById("exerciseList");
const exerciseSelect = document.getElementById("exerciseSelect");
const workoutList = document.getElementById("workoutList");

const addExerciseBtn = document.getElementById("addExerciseBtn");
const addWorkoutBtn = document.getElementById("addWorkoutBtn");

const langToggle = document.getElementById("langToggle");

const totalExercisesEl = document.getElementById("totalExercises");
const totalWorkoutsEl = document.getElementById("totalWorkouts");
const totalVolumeEl = document.getElementById("totalVolume");

const streakText = document.getElementById("streakText");

// Follow Along elements
const startWorkoutBtn = document.getElementById("startWorkout");
const workoutScreen = document.getElementById("workoutScreen");
const exerciseTitle = document.getElementById("exerciseTitle");
const setInfo = document.getElementById("setInfo");
const repInfo = document.getElementById("repInfo");
const nextBtn = document.getElementById("nextBtn");

// =====================
// INIT
// =====================

renderAll();
updateDashboard();
renderStreak();
updateUI();

// Follow Along ekranını başlangıçta gizle
workoutScreen.style.display = "none";

// =====================
// ADD EXERCISE
// =====================

addExerciseBtn.onclick = () => {
    const name = document.getElementById("exerciseName").value;
    const category = document.getElementById("exerciseCategory").value;

    if (!name) return;

    const data = getExercises();
    data.push({ id: Date.now(), name, category });

    saveExercises(data);

    renderAll();
    updateDashboard();
};

// =====================
// ADD WORKOUT
// =====================

addWorkoutBtn.onclick = () => {
    const ex = document.getElementById("exerciseSelect").value;
    const sets = document.getElementById("setsInput").value;
    const reps = document.getElementById("repsInput").value;

    if (!ex || !sets || !reps) return;

    const data = getWorkouts();
    data.push({
        id: Date.now(),
        exercise: ex,
        sets,
        reps
    });

    saveWorkouts(data);

    renderAll();
    updateDashboard();
};

// =====================
// RENDER ALL
// =====================

function renderAll() {
    renderExercises();
    renderDropdown();
    renderWorkouts();
}

// =====================
// EXERCISES
// =====================

function renderExercises() {
    exerciseList.innerHTML = "";

    getExercises().forEach(ex => {
        const li = document.createElement("li");
        li.textContent = `${ex.name} (${ex.category})`;

        const btn = document.createElement("button");
        btn.textContent = "X";

        btn.onclick = () => {
            const filtered = getExercises().filter(e => e.id !== ex.id);
            saveExercises(filtered);
            renderAll();
            updateDashboard();
        };

        li.appendChild(btn);
        exerciseList.appendChild(li);
    });
}

// =====================
// DROPDOWN
// =====================

function renderDropdown() {
    exerciseSelect.innerHTML = "";

    getExercises().forEach(ex => {
        const opt = document.createElement("option");
        opt.value = ex.name;
        opt.textContent = ex.name;
        exerciseSelect.appendChild(opt);
    });
}

// =====================
// WORKOUTS
// =====================

function renderWorkouts() {
    workoutList.innerHTML = "";

    getWorkouts().forEach(w => {
        const li = document.createElement("li");

        const date = new Date(w.id).toLocaleDateString();

        li.innerHTML = `
            <strong>${date}</strong><br>
            ${w.exercise} <br>
            ${w.sets} x ${w.reps}
        `;

        const btn = document.createElement("button");
        btn.textContent = "X";

        btn.onclick = () => {
            const filtered = getWorkouts().filter(x => x.id !== w.id);
            saveWorkouts(filtered);
            renderAll();
            updateDashboard();
        };

        li.appendChild(btn);
        workoutList.appendChild(li);
    });
}

// =====================
// DASHBOARD
// =====================

function updateDashboard() {
    const ex = getExercises();
    const wo = getWorkouts();

    let volume = 0;
    wo.forEach(w => volume += Number(w.sets) * Number(w.reps));

    totalExercisesEl.textContent = `Exercises: ${ex.length}`;
    totalWorkoutsEl.textContent = `Workouts: ${wo.length}`;
    totalVolumeEl.textContent = `Volume: ${volume}`;
}

// =====================
// STREAK
// =====================

function updateStreak() {
    let data = JSON.parse(localStorage.getItem("streak")) || {
        last: null,
        count: 0
    };

    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (data.last !== today) {
        if (data.last === yesterday.toDateString()) {
            data.count++;
        } else {
            data.count = 1;
        }

        data.last = today;
        localStorage.setItem("streak", JSON.stringify(data));
    }

    return data.count;
}

function renderStreak() {
    const count = updateStreak();
    streakText.textContent = `🔥 Streak: ${count} days`;
}

// =====================
// LANGUAGE
// =====================

function updateUI() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}

langToggle.onclick = () => {
    lang = lang === "en" ? "nl" : "en";
    updateUI();
};

// =====================
// TIMER
// =====================

let timer;
let seconds = 0;

document.getElementById("startTimer").onclick = () => {
    clearInterval(timer);
    seconds = 0;

    timer = setInterval(() => {
        seconds++;

        const m = String(Math.floor(seconds / 60)).padStart(2, "0");
        const s = String(seconds % 60).padStart(2, "0");

        document.getElementById("timer").textContent = `${m}:${s}`;
    }, 1000);
};

// =====================
// FOLLOW ALONG
// =====================

let followAlongList = [];
let followAlongIndex = 0;
let currentSetsRemaining = 0;

startWorkoutBtn.onclick = () => {
    followAlongList = getWorkouts();

    if (followAlongList.length === 0) {
        alert("Henüz kayıtlı bir workout yok. Önce 'Workout Builder' kısmından ekle.");
        return;
    }

    followAlongIndex = 0;
    workoutScreen.style.display = "block";
    loadExerciseAtIndex();
};

function loadExerciseAtIndex() {
    const current = followAlongList[followAlongIndex];
    currentSetsRemaining = Number(current.sets) || 1;
    showCurrentWorkoutStep();
}

nextBtn.onclick = () => {
    currentSetsRemaining--;

    if (currentSetsRemaining > 0) {
        showCurrentWorkoutStep();
        return;
    }

    // bu egzersizin setleri bitti, sıradaki egzersize geç
    followAlongIndex++;

    if (followAlongIndex >= followAlongList.length) {
        exerciseTitle.textContent = "Bitti! 🎉";
        setInfo.textContent = "";
        repInfo.textContent = "";

        setTimeout(() => {
            workoutScreen.style.display = "none";
        }, 1500);

        return;
    }

    loadExerciseAtIndex();
};

function showCurrentWorkoutStep() {
    const current = followAlongList[followAlongIndex];

    exerciseTitle.textContent = current.exercise;
    setInfo.textContent = `Set: ${currentSetsRemaining}`;
    repInfo.textContent = `Reps: ${current.reps}`;
}