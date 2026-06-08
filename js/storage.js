function getExercises() {
    return JSON.parse(
        localStorage.getItem("exercises")
    ) || [];
}

function saveExercises(exercises) {
    localStorage.setItem(
        "exercises",
        JSON.stringify(exercises)
    );
}


function getWorkouts() {
    return JSON.parse(localStorage.getItem("workouts")) || [];
}

function saveWorkouts(workouts) {
    localStorage.setItem("workouts", JSON.stringify(workouts));
}