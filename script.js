function addStudyPlan() {

  const subject =
    document.getElementById("subjectInput").value;

  const hours =
    document.getElementById("hoursInput").value;

  if(subject === "" || hours === "")
    return;

  studyPlans.push({
    subject,
    hours
  });

  renderStudyPlans();

  document.getElementById("subjectInput").value = "";
  document.getElementById("hoursInput").value = "";
}

function renderStudyPlans() {

  const studyList =
    document.getElementById("studyList");

  studyList.innerHTML = "";

  let totalHours = 0;

  studyPlans.forEach(plan => {

    totalHours += Number(plan.hours);

    const li = document.createElement("li");

    li.innerHTML =
      `${plan.subject} - ${plan.hours} hrs`;

    studyList.appendChild(li);

  });

  document.getElementById("studyHours")
    .innerText = totalHours;
}