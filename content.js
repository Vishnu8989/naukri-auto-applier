(function () {
  // Candidate Pre-filled Profile Configuration
  const PROFILE_CONFIG = {
    totalExperience: "3.4",
    pythonExp: "3",
    fastApiExp: "2",
    genAiExp: "2",
    currentCtc: "8.5",
    expectedCtc: "16",
    noticePeriodDays: "30", // or "0" / "Immediate"
    relocate: "Yes"
  };

  const ACTION_DELAY_MS = 2000; // 2 seconds delay
  let isRunning = false;
  let appliedCount = 0;

  function delay(ms = ACTION_DELAY_MS) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // 1. Create floating control widget
  function createWidget() {
    if (document.getElementById("naukri-bot-panel")) return;

    const panel = document.createElement("div");
    panel.id = "naukri-bot-panel";
    panel.innerHTML = `
      <h4>🚀 Naukri Multi-Apply (5 in 1 Go)</h4>
      <button id="naukri-bot-btn">Start Auto Apply</button>
      <div id="naukri-bot-status">Status: Ready (0 applied)</div>
    `;
    document.body.appendChild(panel);

    const btn = document.getElementById("naukri-bot-btn");
    btn.addEventListener("click", () => {
      isRunning = !isRunning;
      if (isRunning) {
        btn.textContent = "Stop Automation";
        btn.classList.add("running");
        updateStatus("Scanning job cards & batch apply options...");
        startApplierLoop();
      } else {
        btn.textContent = "Start Auto Apply";
        btn.classList.remove("running");
        updateStatus(`Stopped. Total applied: ${appliedCount}`);
      }
    });
  }

  function updateStatus(text) {
    const el = document.getElementById("naukri-bot-status");
    if (el) el.textContent = `Status: ${text}`;
  }

  // 2. Handle Questionnaire / Chatbot Modal Popup if one opens
  async function handleQuestionnairePopup() {
    const chatbotModal = document.querySelector(".chatbot_modal, .apply-message, .bot-container, .apply-dialog");
    if (!chatbotModal) return;

    updateStatus("Auto-filling questionnaire popup...");

    const inputs = chatbotModal.querySelectorAll("input[type='text'], input[type='number']");
    inputs.forEach((input) => {
      const placeholder = (input.placeholder || "").toLowerCase();
      const name = (input.name || "").toLowerCase();

      if (placeholder.includes("current ctc") || name.includes("currentctc") || placeholder.includes("fixed")) {
        input.value = PROFILE_CONFIG.currentCtc;
      } else if (placeholder.includes("expected ctc") || name.includes("expectedctc")) {
        input.value = PROFILE_CONFIG.expectedCtc;
      } else if (placeholder.includes("notice") || name.includes("notice")) {
        input.value = PROFILE_CONFIG.noticePeriodDays;
      } else if (placeholder.includes("experience") || name.includes("exp")) {
        input.value = PROFILE_CONFIG.pythonExp;
      }
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });

    await delay(1000);

    const submitBtns = chatbotModal.querySelectorAll("button, .submit-btn, .action-btn, .apply-button");
    for (const btn of submitBtns) {
      if (btn.innerText && btn.innerText.match(/submit|save|continue|apply/i)) {
        btn.click();
        await delay(1000);
        break;
      }
    }
  }

  // 3. Batch Apply (5-Jobs in one go) Strategy
  async function tryBatchApply() {
    // Look for similar-jobs multi-apply popup or bottom banner "Apply to 5 jobs"
    const bulkButtons = Array.from(document.querySelectorAll("button, a, div[role='button']")).filter((el) => {
      const text = (el.innerText || "").trim().toLowerCase();
      return (
        text.includes("apply to") && (text.includes("5") || text.includes("jobs") || text.includes("selected")) ||
        text.includes("apply all") ||
        text.includes("apply to all")
      );
    });

    if (bulkButtons.length > 0) {
      const bulkBtn = bulkButtons[0];
      bulkBtn.scrollIntoView({ behavior: "smooth", block: "center" });
      await delay(1000);
      bulkBtn.click();
      appliedCount += 5;
      updateStatus(`Batch applied! Total: ~${appliedCount} jobs.`);
      await delay(ACTION_DELAY_MS);
      await handleQuestionnairePopup();
      return true;
    }

    // Look for selectable checkboxes on job cards to select 5 at a time
    const checkboxes = Array.from(
      document.querySelectorAll("input[type='checkbox']:not(:checked), .tuple-checkbox:not(.checked)")
    ).filter((el) => el.offsetParent !== null);

    if (checkboxes.length >= 3) {
      let selected = 0;
      for (const cb of checkboxes) {
        if (selected >= 5) break;
        cb.scrollIntoView({ behavior: "smooth", block: "center" });
        cb.click();
        selected++;
        await delay(300);
      }

      await delay(1000);

      // Now click the dynamic floating "Apply to X jobs" button that appears after selecting
      const applySelectedBtn = Array.from(
        document.querySelectorAll("button, .batch-apply, .apply-selected, [class*='apply']")
      ).find((el) => {
        const text = (el.innerText || "").toLowerCase();
        return text.includes("apply to") || text.includes("apply selected") || text.includes("apply (");
      });

      if (applySelectedBtn) {
        applySelectedBtn.click();
        appliedCount += selected;
        updateStatus(`Applied to ${selected} jobs in one go! Total: ${appliedCount}`);
        await delay(ACTION_DELAY_MS);
        await handleQuestionnairePopup();
        return true;
      }
    }

    return false;
  }

  // 4. Main Automation Loop
  async function startApplierLoop() {
    while (isRunning) {
      // Step A: Attempt Batch / 5-in-1 Apply first
      const batchSuccess = await tryBatchApply();
      if (batchSuccess) {
        await delay(ACTION_DELAY_MS);
        continue;
      }

      // Step B: Fallback to individual 1-click apply buttons
      const buttons = Array.from(
        document.querySelectorAll("button, a, .apply-button, .tuple-apply, [id*='apply']")
      );

      const applyButtons = buttons.filter((el) => {
        const text = (el.innerText || "").trim().toLowerCase();
        return (
          (text === "apply" || text === "easy apply" || text === "apply on naukri" || text === "apply now") &&
          !el.getAttribute("data-applied") &&
          el.offsetParent !== null
        );
      });

      if (applyButtons.length === 0) {
        updateStatus("No more apply buttons. Scrolling down...");
        window.scrollBy({ top: 700, behavior: "smooth" });
        await delay(ACTION_DELAY_MS);

        const nextPage = document.querySelector(".pagination-next, a[href*='page=']");
        if (nextPage && isRunning) {
          updateStatus("Navigating to next page...");
          nextPage.click();
          await delay(ACTION_DELAY_MS);
        } else {
          updateStatus(`Finished! Total applied: ${appliedCount}`);
          isRunning = false;
          const btn = document.getElementById("naukri-bot-btn");
          if (btn) {
            btn.textContent = "Start Auto Apply";
            btn.classList.remove("running");
          }
          break;
        }
        continue;
      }

      for (const btn of applyButtons) {
        if (!isRunning) break;

        try {
          btn.scrollIntoView({ behavior: "smooth", block: "center" });
          await delay(800);

          btn.click();
          btn.setAttribute("data-applied", "true");
          appliedCount++;
          updateStatus(`Applied to ${appliedCount} jobs. Checking popups & similar 5-job banners...`);

          await delay(1500);
          await handleQuestionnairePopup();

          // Check if clicking apply triggered the "Apply to 5 similar jobs" modal
          await tryBatchApply();

          await delay(ACTION_DELAY_MS);
        } catch (err) {
          console.error("Error applying to job card:", err);
        }
      }
    }
  }

  // Initialize UI widget
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(createWidget, 1500));
  } else {
    setTimeout(createWidget, 1500);
  }
})();
