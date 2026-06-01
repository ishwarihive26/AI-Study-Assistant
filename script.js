const state = {
  tasks: JSON.parse(localStorage.getItem("tasks") || "[]"),
  subjects: JSON.parse(localStorage.getItem("subjects") || "[]"),
  notes: localStorage.getItem("notes") || "",
  goal: localStorage.getItem("goal") || "2 hours study",
  studyHours: parseFloat(localStorage.getItem("studyHours") || "0"),
  pomodoros: parseInt(localStorage.getItem("pomodoros") || "0", 10),
  tasksDone: parseInt(localStorage.getItem("tasksDone") || "0", 10),
  timerMin: 25,
  timerSec: 0,
  timerMode: "Focus Session",
  timerRunning: false,
  timerId: null
};

const notesArea = document.getElementById("notesArea");
notesArea.value = state.notes;

function saveAll() {
  localStorage.setItem("tasks", JSON.stringify(state.tasks));
  localStorage.setItem("subjects", JSON.stringify(state.subjects));
  localStorage.setItem("notes", state.notes);
  localStorage.setItem("goal", state.goal);
  localStorage.setItem("studyHours", state.studyHours);
  localStorage.setItem("pomodoros", state.pomodoros);
  localStorage.setItem("tasksDone", state.tasksDone);
}

function updateDashboard() {
  document.getElementById("tasksDone").textContent = state.tasksDone;
  document.getElementById("studyHours").textContent = state.studyHours.toFixed(1);
  document.getElementById("pomodoros").textContent = state.pomodoros;
  document.getElementById("notesCount").textContent = state.notes.trim() ? 1 : 0;
  document.getElementById("goalText").textContent = state.goal;
  document.getElementById("taskCount").textContent = `${state.tasks.length} tasks`;
  document.getElementById("subjectCount").textContent = `${state.subjects.length} subjects`;
  document.getElementById("sessionCount").textContent = `${state.pomodoros} sessions`;
  document.getElementById("goalBar").style.width = `${Math.min(100, state.studyHours * 10)}%`;
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  if (!state.tasks.length) {
    list.innerHTML = `<div class="item"><div>No tasks yet. Add one above!</div></div>`;
    return;
  }
  state.tasks.forEach((task, index) => {
    const el = document.createElement("div");
    el.className = "item" + (task.done ? " done" : "");
    el.innerHTML = `<div><strong>${task.text}</strong><div class="meta">${task.priority} priority</div></div>`;
    const btn = document.createElement("button");
    btn.className = task.done ? "ghost-btn small" : "primary-btn small";
    btn.textContent = task.done ? "Undo" : "Done";
    btn.onclick = () => {
      state.tasks[index].done = !state.tasks[index].done;
      state.tasksDone += state.tasks[index].done ? 1 : -1;
      if (state.tasksDone < 0) state.tasksDone = 0;
      saveAll();
      renderAll();
    };
    el.appendChild(btn);
    list.appendChild(el);
  });
}

function addTask() {
  const input = document.getElementById("taskInput");
  const priority = document.getElementById("taskPriority").value;
  const text = input.value.trim();
  if (!text) return;
  state.tasks.push({ text, priority, done: false });
  input.value = "";
  saveAll();
  renderAll();
}

function renderSubjects() {
  const list = document.getElementById("subjectList");
  list.innerHTML = "";
  if (!state.subjects.length) {
    list.innerHTML = `<div class="item"><div>No subjects yet!</div></div>`;
    return;
  }
  state.subjects.forEach(s => {
    const el = document.createElement("div");
    el.className = "item";
    el.innerHTML = `<div><strong>${s.subject}</strong><div class="meta">${s.hours} hours</div></div>`;
    list.appendChild(el);
  });
}

function addSubject() {
  const subject = document.getElementById("subjectInput").value.trim();
  const hours = parseFloat(document.getElementById("hoursInput").value);
  if (!subject || !hours) return;
  state.subjects.push({ subject, hours });
  state.studyHours += hours;
  document.getElementById("subjectInput").value = "";
  document.getElementById("hoursInput").value = "";
  saveAll();
  renderAll();
}

function saveNotes() {
  state.notes = notesArea.value;
  saveAll();
  renderAll();
}

function clearNotes() {
  state.notes = "";
  notesArea.value = "";
  saveAll();
  renderAll();
}

function newNote() {
  notesArea.focus();
}

function setTimer(mins, mode) {
  state.timerMin = mins;
  state.timerSec = 0;
  state.timerMode = mode;
  updateTimer();
}

function updateTimer() {
  document.getElementById("timerMode").textContent = state.timerMode;
  document.getElementById("timerDisplay").textContent =
    `${String(state.timerMin).padStart(2, "0")}:${String(state.timerSec).padStart(2, "0")}`;
}

function startTimer() {
  if (state.timerRunning) return;
  state.timerRunning = true;
  state.timerId = setInterval(() => {
    if (state.timerMin === 0 && state.timerSec === 0) {
      clearInterval(state.timerId);
      state.timerRunning = false;
      state.pomodoros++;
      state.studyHours += 0.5;
      saveAll();
      renderAll();
      alert("Session complete!");
      return;
    }
    if (state.timerSec === 0) {
      state.timerMin--;
      state.timerSec = 59;
    } else {
      state.timerSec--;
    }
    updateTimer();
  }, 1000);
}

function pauseTimer() {
  clearInterval(state.timerId);
  state.timerRunning = false;
}

function resetTimer() {
  pauseTimer();
  state.timerMin = 25;
  state.timerSec = 0;
  state.timerMode = "Focus Session";
  updateTimer();
}

function quickPrompt(text) {
  document.getElementById("chatInput").value = text;
  sendChat();
}

function reply(text) {
  const t = text.toLowerCase();
  if (t.includes("explain")) return "Choose one topic, then break it into definition, example, and practice.";
  if (t.includes("quiz")) return "I can quiz you topic by topic. Start with short questions first.";
  if (t.includes("summarize")) return "A good summary keeps the main idea, key terms, and steps only.";
  if (t.includes("study plan")) return "Use 25-minute focus blocks, short breaks, and one review session.";
  if (t.includes("key points")) return "Write 3 to 5 key points and test yourself without looking.";
  return "I’m ready to help with study plans, quizzes, notes, and revision tips.";
}

function sendChat() {
  const input = document.getElementById("chatInput");
  const box = document.getElementById("chatBox");
  const text = input.value.trim();
  if (!text) return;

  const user = document.createElement("div");
  user.className = "msg user";
  user.textContent = "You: " + text;
  box.appendChild(user);

  setTimeout(() => {
    const ai = document.createElement("div");
    ai.className = "msg ai";
    ai.textContent = "AI: " + reply(text);
    box.appendChild(ai);
    box.scrollTop = box.scrollHeight;
  }, 350);

  input.value = "";
}

function toggleTheme() {
  document.body.classList.toggle("light");
}

function addQuickGoal() {
  const goal = prompt("Enter your study goal:", state.goal);
  if (!goal) return;
  state.goal = goal;
  saveAll();
  renderAll();
}

function renderAll() {
  renderTasks();
  renderSubjects();
  updateDashboard();
  updateTimer();
  document.getElementById("noteStatus").textContent = state.notes.trim()
    ? "Note saved successfully."
    : "No notes yet. Create one!";
}

notesArea.addEventListener("input", () => {
  state.notes = notesArea.value;
  saveAll();
  renderAll();
});

renderAll();