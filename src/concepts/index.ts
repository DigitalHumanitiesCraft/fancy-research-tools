import "./index.css";

const form = document.querySelector<HTMLFormElement>("#feedback");
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const response = {
    protocol: "frt-ui-concepts-1",
    recordedAt: new Date().toISOString(),
    answers: Object.fromEntries(new FormData(form)),
    context: { viewport: [innerWidth, innerHeight], userAgent: navigator.userAgent },
    evidence: "Human self-report; not independently observed task completion",
  };
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(response, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "research-ui-assessment.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  const status = document.querySelector("#status");
  if (status)
    status.textContent =
      "Assessment download requested. Keep the file alongside the exported investigation.";
});
