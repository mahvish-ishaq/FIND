let goals = [];
let points = 0;

const goalList = document.getElementById("goalList");
const goalForm = document.getElementById("goalForm");
const pointsDisplay = document.getElementById("pointsDisplay");
const rewardMessage = document.getElementById("rewardMessage");

function updatePointsAndRewards() {
  pointsDisplay.textContent = points;

  if (points >= 500) {
    rewardMessage.textContent = "Incredible! You’ve earned a Gold Badge 🥇!";
  } else if (points >= 250) {
    rewardMessage.textContent = "Amazing! You’ve earned a Silver Badge 🥈!";
  } else if (points >= 100) {
    rewardMessage.textContent = "Congratulations! You’ve earned a Bronze Badge 🥉!";
  } else {
    rewardMessage.textContent = "Keep working towards your goals to earn rewards!";
  }
}

async function loadData() {
  try {
    const response = await fetch("/api/goals");
    if (!response.ok) throw new Error("Could not load goals");

    const data = await response.json();
    goals = data.goals;
    points = data.points;

    updatePointsAndRewards();
    renderGoals();
  } catch (error) {
    console.error(error);
    alert("Could not load goals. Check the backend and MongoDB.");
  }
}

goalForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = document.getElementById("goalName").value.trim();
  const target = Number(document.getElementById("goalAmount").value);

  if (!name || !Number.isFinite(target) || target <= 0) {
    alert("Please provide a valid goal name and target amount.");
    return;
  }

  try {
    const response = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, target })
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not add goal");

    goalForm.reset();
    await loadData();
  } catch (error) {
    console.error(error);
    alert("Could not save the goal. Please try again.");
  }
});

function renderGoals() {
  goalList.innerHTML = "";

  goals.forEach(goal => {
    const item = document.createElement("div");
    item.classList.add("goal-item");

    const name = document.createElement("p");
    name.textContent = "Goal: " + goal.name;

    const target = document.createElement("p");
    target.textContent = "Target Amount: Rs. " + goal.target;

    const progress = document.createElement("p");
    progress.textContent = "Progress: Rs. " + goal.progress;

    const addButton = document.createElement("button");
    addButton.textContent = "Add Rs. 100";
    addButton.addEventListener("click", () => updateGoalProgress(goal._id));

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove Goal";
    removeButton.addEventListener("click", () => removeGoal(goal._id));

    item.append(name, target, progress, addButton, removeButton);
    goalList.appendChild(item);
  });
}

async function updateGoalProgress(id) {
  try {
    const response = await fetch(`/api/goals/${id}/progress`, {
      method: "PATCH"
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not update progress");

    await loadData();
  } catch (error) {
    console.error(error);
    alert("Could not update goal progress.");
  }
}

async function removeGoal(id) {
  try {
    const response = await fetch(`/api/goals/${id}`, {
      method: "DELETE"
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not delete goal");

    await loadData();
  } catch (error) {
    console.error(error);
    alert("Could not remove goal.");
  }
}

loadData();
