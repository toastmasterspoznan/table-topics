const infoToggle = document.getElementById("info-toggle");
const infoPanel = document.getElementById("info-panel");
const drawButton = document.getElementById("draw-button");
const questionElement = document.getElementById("question");
const statusElement = document.getElementById("status");
const metaElement = document.getElementById("meta");

let questions = [];
let lastQuestionIndex = -1;

function updateInfoPanel() {
  const isHidden = infoPanel.hasAttribute("hidden");
  infoToggle.setAttribute("aria-expanded", String(!isHidden));
}

function drawQuestion() {
  if (!questions.length) {
    return;
  }

  let nextIndex = Math.floor(Math.random() * questions.length);

  if (questions.length > 1) {
    while (nextIndex === lastQuestionIndex) {
      nextIndex = Math.floor(Math.random() * questions.length);
    }
  }

  lastQuestionIndex = nextIndex;
  questionElement.textContent = questions[nextIndex];
  statusElement.textContent = "Wylosowane pytanie";
  metaElement.textContent = "Kliknij ponownie, aby wylosować kolejne.";
}

async function loadQuestions() {
  try {
    const response = await fetch("pytania.txt", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Nie udało się pobrać listy pytań.");
    }

    const rawText = await response.text();
    questions = rawText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (!questions.length) {
      throw new Error("Lista pytań jest pusta.");
    }

    statusElement.textContent = "Pytania gotowe";
    metaElement.textContent = "Dostępnych pytań: " + questions.length;
    drawButton.disabled = false;
  } catch (error) {
    statusElement.textContent = "Nie udało się załadować pytań";
    questionElement.textContent = "Uruchom stronę przez prosty serwer HTTP albo GitHub Pages, aby przeglądarka mogła wczytać plik pytania.txt.";
    metaElement.textContent = error.message;
  }
}

infoToggle.addEventListener("click", () => {
  if (infoPanel.hasAttribute("hidden")) {
    infoPanel.removeAttribute("hidden");
  } else {
    infoPanel.setAttribute("hidden", "");
  }

  updateInfoPanel();
});

drawButton.addEventListener("click", drawQuestion);

updateInfoPanel();
loadQuestions();