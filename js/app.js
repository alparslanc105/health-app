let lang = "nl";

// TRANSLATIONS
const translations = {
    nl: {
        title: "Mijn Gezondheid",
        dashboard: "Dashboard",
        addExercise: "Nieuwe oefening",
        exercises: "Oefeningen",
        builder: "Workout Builder",
        list: "Workout Lijst",
        follow: "Follow Along",
        exerciseName: "Oefening naam",
        category: "Categorie"
    },
    en: {
        title: "My Health",
        dashboard: "Dashboard",
        addExercise: "New Exercise",
        exercises: "Exercises",
        builder: "Workout Builder",
        list: "Workout List",
        follow: "Follow Along",
        exerciseName: "Exercise name",
        category: "Category"
    }
};

// STORAGE
const getExercises = () => JSON.parse(localStorage.getItem("exercises")) || [];
const saveExercises = (d) => localStorage.setItem("exercises", JSON.stringify(d));

const getWorkouts = () => JSON.parse(localStorage.getItem("workouts")) || [];
const saveWorkouts = (d) => localStorage.setItem("workouts", JSON.stringify(d));

// ELEMENTS
const exerciseList = document.getElementById("exerciseList");
const exerciseSelect = document.getElementById("exerciseSelect");
const workoutList = document.getElementById("workoutList");

const addExerciseBtn = document.getElementById("addExerciseBtn");
const addWorkoutBtn = document.getElementById("addWorkoutBtn");

const startBtn = document.getElementById("startWorkout");
const workoutScreen = document.getElementById("workoutScreen");
const exerciseTitle = document.getElementById("exerciseTitle");
const setInfo = document.getElementById("setInfo");
const repInfo = document.getElementById("repInfo");
const nextBtn = document.getElementById("nextBtn");

const langToggle = document.getElementById("langToggle");

// DASHBOARD
const totalExercisesEl = document.getElementById("totalExercises");
const totalWorkoutsEl = document.getElementById("totalWorkouts");
const totalVolumeEl = document.getElementById("totalVolume");

// INIT
renderExercises();
loadDropdown();
renderWorkouts();
updateUI();
updateDashboard();

// ADD EXERCISE
addExerciseBtn.onclick = () => {
    const name = document.getElementById("exerciseName").value;
    const category = document.getElementById("exerciseCategory").value;

    if (!name) return;

    const data = getExercises();
    data.push({ id: Date.now(), name, category });

    saveExercises(data);

    renderExercises();
    loadDropdown();
    updateDashboard();
};

// ADD WORKOUT
addWorkoutBtn.onclick = () => {
    const exercise = exerciseSelect.value;
    const sets = document.getElementById("setsInput").value;
    const reps = document.getElementById("repsInput").value;

    if (!exercise || !sets || !reps) return;

    const data = getWorkouts();
    data.push({ id: Date.now(), exercise, sets, reps });

    saveWorkouts(data);

    renderWorkouts();
    updateDashboard();
};

// RENDER EXERCISES
function renderExercises() {
    exerciseList.innerHTML = "";
    getExercises().forEach(ex => {
        const li = document.createElement("li");
        li.textContent = `${ex.name} (${ex.category})`;

        const del = document.createElement("button");
        del.textContent = "🗑";

        del.onclick = () => {
            let data = getExercises().filter(x => x.id !== ex.id);
            saveExercises(data);
            renderExercises();
            loadDropdown();
            updateDashboard();
        };

        li.appendChild(del);
        exerciseList.appendChild(li);
    });
}

// DROPDOWN
function loadDropdown() {
    const data = getExercises();
    exerciseSelect.innerHTML = "";

    if (!data.length) {
        const opt = document.createElement("option");
        opt.textContent = "No exercises";
        opt.disabled = true;
        exerciseSelect.appendChild(opt);
        return;
    }

    data.forEach(ex => {
        const opt = document.createElement("option");
        opt.value = ex.name;
        opt.textContent = ex.name;
        exerciseSelect.appendChild(opt);
    });
}

// WORKOUTS
function renderWorkouts() {
    workoutList.innerHTML = "";
    getWorkouts().forEach(w => {
        const li = document.createElement("li");
        li.textContent = `${w.exercise} - ${w.sets} x ${w.reps}`;

        const del = document.createElement("button");
        del.textContent = "🗑";

        del.onclick = () => {
            let data = getWorkouts().filter(x => x.id !== w.id);
            saveWorkouts(data);
            renderWorkouts();
            updateDashboard();
        };

        li.appendChild(del);
        workoutList.appendChild(li);
    });
}

// FOLLOW
let index = 0;
let set = 1;
let active = [];

startBtn.onclick = () => {
    active = getWorkouts();
    if (!active.length) return;

    index = 0;
    set = 1;

    workoutScreen.style.display = "block";
    show();
};

function show() {
    const item = active[index];

    if (!item) {
        exerciseTitle.textContent = "Done 🎉";
        setInfo.textContent = "";
        repInfo.textContent = "";
        return;
    }

    exerciseTitle.textContent = item.exercise;
    setInfo.textContent = `Set ${set} / ${item.sets}`;
    repInfo.textContent = `${item.reps} reps`;
}

nextBtn.onclick = () => {
    const item = active[index];

    if (set < item.sets) set++;
    else {
        index++;
        set = 1;
    }

    show();
};

// DASHBOARD
function updateDashboard() {
    const ex = getExercises();
    const wo = getWorkouts();

    let volume = 0;
    wo.forEach(w => volume += w.sets * w.reps);

    totalExercisesEl.textContent = `Exercises: ${ex.length}`;
    totalWorkoutsEl.textContent = `Workouts: ${wo.length}`;
    totalVolumeEl.textContent = `Total Volume: ${volume}`;
}

// LANGUAGE
function updateUI() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        el.textContent = translations[lang][key] || "";
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        el.placeholder = translations[lang][key] || "";
    });
}

langToggle.onclick = () => {
    lang = lang === "nl" ? "en" : "nl";
    updateUI();
};

updateUI();