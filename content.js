(function () {
  // Candidate Profile Configuration
  const PROFILE_CONFIG = {
    totalExperience: "3.4",
    pythonExp: "3",
    fastApiExp: "2",
    genAiExp: "2",
    currentCtc: "8.5",
    expectedCtc: "16",
    noticePeriodDays: "30",
    relocate: "Yes"
  };

  const ACTION_DELAY_MS = 2000; // 2 seconds
  let isRunning = false;
  let appliedCount = 0;

  function delay(ms = ACTION_DELAY_MS) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // 1. Trigger robust human-like click event for React / Angular / Vue
  function simulateClick(element) {
    if (!element) return;
    try {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (e) {
      console.warn("Could not scroll into view", e);
    }
    ["mouseenter", "mouseover", "mousedown", "mouseup", "click"].forEach((eventType) => {
      const event = new MouseEvent(eventType, {
        bubbles: true,
        cancelable: true,
        view: window
      });
      element.dispatchEvent(event);
    });
  }

  // 2. Create Floating HUD Widget
  function createWidget() {
    if (document.getElementById("naukri-bot-panel")) return;

    const panel = document.createElement("div");
    panel.id = "naukri-bot-panel";
    panel.innerHTML = `
      <h4>🚀 Naukri Multi-Apply (5 in 1)</h4>
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
        updateStatus("Scanning Recommended Tabs & Checkboxes...");
        startApplierLoop();
      } else {
        btn.textContent = "Start Auto Apply";
        btn.classList.remove("running");
        updateStatus(`Paused. Total applied: ${appliedCount}`);
      }
    });
  }

  function updateStatus(text) {
    const el = document.getElementById("naukri-bot-status");
    if (el) el.textContent = `Status: ${text}`;
  }

  // 3. Handle Auto-Switching from 'Applies' tab to 'Profile' / 'You might like'
  async function ensureActiveJobTab() {
    // If currently on "Applies" tab (which only shows already applied jobs), switch to Profile or You might like
    const tabs = Array.from(document.querySelectorAll("a, button, li, span, [class*='tab']"));
    const activeTab = tabs.find((el) => {
      const t = (el.innerText || "").toLowerCase();
      const hasActive = el.classList && el.classList.contains ? el.classList.contains("active") : false;
      return (t.includes("applies") || t.includes("applied")) && hasActive;
    });

    if (activeTab) {
      updateStatus("Switching from 'Applies' to unapplied jobs tab...");
      const targetTab = tabs.find((el) => {
        const t = (el.innerText || "").toLowerCase();
        return (t.includes("profile (") || t.includes("you might like") || t.includes("preferences")) && !t.includes("(0)");
      });

      if (targetTab) {
        simulateClick(targetTab);
        await delay(2500);
      }
    }
  }

  // 4. Handle Questionnaire / Chatbot Modal Popup
  async function handleQuestionnairePopup() {
    const chatbotModal = document.querySelector(
      ".chatbot_modal, .apply-message, .bot-container, .apply-dialog, [class*='drawer'], [class*='modal']"
    );
    if (!chatbotModal) return;

    const inputs = chatbotModal.querySelectorAll("input[type='text'], input[type='number']");
    if (inputs.length > 0) {
      updateStatus("Filling questionnaire popup...");
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

      const submitBtns = chatbotModal.querySelectorAll("button, .submit-btn, .action-btn, [class*='submit'], [class*='save']");
      for (const btn of submitBtns) {
        if (btn.innerText && btn.innerText.match(/submit|save|continue|apply/i)) {
          simulateClick(btn);
          await delay(1000);
          break;
        }
      }
    }
  }

  // 5. Select 5 Custom Checkboxes and Click the Top "Apply" Button
  async function applyVia5In1Batch() {
    // A. Find all checkbox elements (custom icons, spans, SVG wraps or inputs)
    let customCheckboxes = Array.from(
      document.querySelectorAll(
        "i[class*='checkbox'], span[class*='checkbox'], div[class*='chk-wrap'], [class*='custom-checkbox'], [class*='tuple-checkbox'], [class*='checkbox-wrap'], input[type='checkbox']"
      )
    ).filter((el) => {
      // Must be visible and not already checked
      const style = window.getComputedStyle(el);
      if (el.offsetParent === null || style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;

      let isChecked =
        el.checked ||
        (el.classList && (el.classList.contains("checked") || el.classList.contains("active"))) ||
        el.getAttribute("aria-checked") === "true";

      // Also check child inputs if it's a wrapper
      const childInput = el.querySelector("input[type='checkbox']");
      if (childInput && childInput.checked) {
        isChecked = true;
      }
      return !isChecked;
    });

    // Remove elements that are descendants of other elements in the array to avoid double-clicking
    customCheckboxes = customCheckboxes.filter(el => !customCheckboxes.some(parent => parent !== el && parent.contains(el)));

    if (customCheckboxes.length > 0) {
      updateStatus(`Found ${customCheckboxes.length} job checkboxes. Selecting up to 5...`);
      let selected = 0;

      for (const cb of customCheckboxes) {
        if (selected >= 5 || !isRunning) break;

        simulateClick(cb);
        selected++;
        await delay(500);
      }

      await delay(1000);

      // B. Find the "Apply" button at the top header or bottom banner
      const applyButtons = Array.from(
        document.querySelectorAll("button, a, div[role='button'], [class*='apply']")
      ).filter((el) => {
        if (el.offsetParent === null) return false;
        const text = (el.innerText || "").trim().toLowerCase();
        // Match "Apply", "Apply (5)", "Apply to 5 jobs", "Apply to selected"
        return (
          text === "apply" ||
          text.startsWith("apply (") ||
          text.includes("apply to") ||
          text.includes("apply selected")
        );
      });

      if (applyButtons.length > 0 && selected > 0) {
        // Select the prominent header/banner Apply button
        const mainApplyBtn = applyButtons[0];
        updateStatus(`Clicking main Apply button for ${selected} jobs...`);
        simulateClick(mainApplyBtn);
        appliedCount += selected;
        updateStatus(`Successfully applied to ${selected} jobs! (Total: ${appliedCount})`);

        await delay(ACTION_DELAY_MS);
        await handleQuestionnairePopup();
        return true;
      }
    }

    return false;
  }

  // 6. Main Automation Loop
  async function startApplierLoop() {
    while (isRunning) {
      // Step A: Ensure we are on an active unapplied jobs tab (e.g. Profile or You might like)
      await ensureActiveJobTab();

      // Step B: Attempt 5-in-1 batch selection
      const batchDone = await applyVia5In1Batch();
      if (batchDone) {
        await delay(ACTION_DELAY_MS);
        continue;
      }

      // Step C: Fallback to individual 1-click apply buttons if no multi-select checkboxes
      const buttons = Array.from(
        document.querySelectorAll("button, a, .apply-button, .tuple-apply, [id*='apply']")
      ).filter((el) => {
        const text = (el.innerText || "").trim().toLowerCase();
        return (
          (text === "apply" || text === "easy apply" || text === "apply on naukri" || text === "apply now") &&
          !el.getAttribute("data-applied") &&
          el.offsetParent !== null
        );
      });

      if (buttons.length > 0) {
        const btn = buttons[0];
        updateStatus("Applying via 1-click button...");
        simulateClick(btn);
        btn.setAttribute("data-applied", "true");
        appliedCount++;
        updateStatus(`Applied to ${appliedCount} jobs. Waiting 2s...`);

        await delay(ACTION_DELAY_MS);
        await handleQuestionnairePopup();
        continue;
      }

      // Step D: If no more jobs on current view, scroll or paginate
      updateStatus("Scrolling to load next batch of recommended jobs...");
      window.scrollBy({ top: 700, behavior: "smooth" });
      await delay(ACTION_DELAY_MS);

      // Check for pagination next button
      let nextPage = document.querySelector(".pagination-next, a[href*='page=']");
      if (!nextPage) {
        // Fallback: look for button or link with "Next" text
        const pageEls = Array.from(document.querySelectorAll("button, a, span"));
        nextPage = pageEls.find(el => (el.innerText || "").trim().toLowerCase() === "next" && !el.disabled);
      }

      if (nextPage && isRunning) {
        updateStatus("Navigating to next page...");
        simulateClick(nextPage);
        await delay(ACTION_DELAY_MS);
      } else {
        // Try clicking the next tab e.g. "You might like" if "Profile" finished
        const nextTab = Array.from(document.querySelectorAll("a, button, li, span")).find((el) => {
          const t = (el.innerText || "").toLowerCase();
          const hasActive = el.classList && el.classList.contains ? el.classList.contains("active") : false;
          return (t.includes("you might like") || t.includes("preferences")) && !hasActive;
        });

        if (nextTab && isRunning) {
          updateStatus("Switching to next tab 'You might like'...");
          simulateClick(nextTab);
          await delay(ACTION_DELAY_MS);
        } else {
          updateStatus(`Completed! Total applied: ${appliedCount}`);
          isRunning = false;
          const btn = document.getElementById("naukri-bot-btn");
          if (btn) {
            btn.textContent = "Start Auto Apply";
            btn.classList.remove("running");
          }
          break;
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
