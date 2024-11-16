// Define variables
let points = 0;
let goals = [];
const goalList = document.getElementById("goalList");
const goalForm = document.getElementById("goalForm");
const pointsDisplay = document.getElementById("pointsDisplay");
const rewardMessage = document.getElementById("rewardMessage");

// Function to update points and rewards
function updatePointsAndRewards() {
  pointsDisplay.textContent = points;

  // Display rewards based on points
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

// Function to load saved data from localStorage
function loadData() {
  const savedGoals = localStorage.getItem("goals");
  const savedPoints = localStorage.getItem("points");

  if (savedGoals) {
    goals = JSON.parse(savedGoals);
  }
  if (savedPoints) {
    points = parseInt(savedPoints, 10);
  }

  updatePointsAndRewards();
  renderGoals();
}

// Function to save goals and points to localStorage
function saveData() {
  localStorage.setItem("goals", JSON.stringify(goals));
  localStorage.setItem("points", points.toString());
}

// Function to add a new goal
function addGoal(event) {
  event.preventDefault();

  const goalName = document.getElementById("goalName").value;
  const goalAmount = parseFloat(document.getElementById("goalAmount").value);

  if (!goalName || isNaN(goalAmount) || goalAmount <= 0) {
    alert("Please provide valid goal name and target amount.");
    return;
  }

  // Create a new goal object and add to the goals array
  const newGoal = {
    name: goalName,
    target: goalAmount,
    progress: 0,
  };

  goals.push(newGoal);

  // Save updated data
  saveData();

  // Update the goal list UI
  renderGoals();

  // Clear the form
  document.getElementById("goalName").value = "";
  document.getElementById("goalAmount").value = "";
}

// Function to render all goals on the page
function renderGoals() {
  goalList.innerHTML = "";

  goals.forEach((goal, index) => {
    const goalItem = document.createElement("div");
    goalItem.classList.add("goal-item");
    goalItem.innerHTML = `
      <p><strong>Goal:</strong> ${goal.name}</p>
      <p><strong>Target Amount:</strong> Rs. ${goal.target}</p>
      <p><strong>Progress:</strong> Rs. ${goal.progress}</p>
      <button onclick="updateGoalProgress(${index})">Add Rs. 100</button>
      <button onclick="removeGoal(${index})">Remove Goal</button>
    `;

    goalList.appendChild(goalItem);
  });
}

// Function to update progress and points
function updateGoalProgress(index) {
  const goal = goals[index];
  goal.progress += 100;

  // Update points for every 100 Rs. added to progress
  points += 10;
  saveData();  // Save updated data
  updatePointsAndRewards();

  // Render the updated goal list
  renderGoals();
}

// Function to remove a goal
function removeGoal(index) {
  goals.splice(index, 1);
  saveData();  // Save updated data
  renderGoals();
}

// Add event listener for form submission
goalForm.addEventListener("submit", addGoal);

// Initial setup
loadData();
























/*// Define variables
let points = 0;
let goals = [];
const goalList = document.getElementById("goalList");
const goalForm = document.getElementById("goalForm");
const pointsDisplay = document.getElementById("pointsDisplay");
const rewardMessage = document.getElementById("rewardMessage");

// Function to update points and rewards
function updatePointsAndRewards() {
  pointsDisplay.textContent = points;

  // Display rewards based on points
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

// Function to add a new goal
function addGoal(event) {
  event.preventDefault();

  const goalName = document.getElementById("goalName").value;
  const goalAmount = parseFloat(document.getElementById("goalAmount").value);

  if (!goalName || isNaN(goalAmount) || goalAmount <= 0) {
    alert("Please provide valid goal name and target amount.");
    return;
  }

  // Create a new goal object and add to the goals array
  const newGoal = {
    name: goalName,
    target: goalAmount,
    progress: 0,
  };

  goals.push(newGoal);

  // Update the goal list UI
  renderGoals();

  // Clear the form
  document.getElementById("goalName").value = "";
  document.getElementById("goalAmount").value = "";
}

// Function to render all goals on the page
function renderGoals() {
  goalList.innerHTML = "";

  goals.forEach((goal, index) => {
    const goalItem = document.createElement("div");
    goalItem.classList.add("goal-item");
    goalItem.innerHTML = `
      <p><strong>Goal:</strong> ${goal.name}</p>
      <p><strong>Target Amount:</strong> Rs. ${goal.target}</p>
      <p><strong>Progress:</strong> Rs. ${goal.progress}</p>
      <button onclick="updateGoalProgress(${index})">Add Rs. 100</button>
      <button onclick="removeGoal(${index})">Remove Goal</button>
    `;

    goalList.appendChild(goalItem);
  });
}

// Function to update progress and points
function updateGoalProgress(index) {
  const goal = goals[index];
  goal.progress += 100;

  // Update points for every 100 Rs. added to progress
  points += 10;
  updatePointsAndRewards();

  // Render the updated goal list
  renderGoals();
}

// Function to remove a goal
function removeGoal(index) {
  goals.splice(index, 1);
  renderGoals();
}

// Add event listener for form submission
goalForm.addEventListener("submit", addGoal);

// Initial setup
updatePointsAndRewards();*/
