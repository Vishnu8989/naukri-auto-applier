# 🚀 Naukri Smart Auto-Applier (Chrome Extension - Manifest V3)

A lightweight, automated Chrome Extension built to streamline job applications on [Naukri.com](https://www.naukri.com/). It automates both **Naukri's native 5-in-1 batch apply** and **1-click applies**, with intelligent auto-filling for common recruiter questionnaire modals and a built-in 2-second pacing timer.

---

## ✨ Features

- **⚡ 5-in-1 Batch Apply**: Prioritizes multi-select job tuples and triggers Naukri's native batch application feature to apply to 5 jobs simultaneously.
- **🎯 1-Click Apply Fallback**: Gracefully executes single-click applies when batch mode is unavailable on specific search pages.
- **🤖 Questionnaire & Chatbot Auto-Fill**: Automatically fills out standard popups (Current CTC, Expected CTC, Notice Period, Years of Experience in Python/Backend/GenAI).
- **⏱️ Humanized Pacing**: Enforces a customizable delay (default: **2 seconds**) between actions to avoid rate-limiting and bot detection.
- **🎛️ Floating Widget**: Injects a clean, non-intrusive dark-mode HUD on Naukri pages with live counters and 1-click start/stop controls.

---

## 🛠️ Project Structure

```text
naukri-auto-applier/
├── manifest.json    # Chrome Manifest V3 configuration
├── content.js       # Core automation engine, DOM watchers & questionnaire fillers
├── styles.css       # Floating HUD UI styling
└── README.md        # Documentation and setup guide
```

---

## 📦 How to Install in Google Chrome

1. Clone or download this repository to your local machine:
   ```bash
   git clone https://github.com/Vishnu8989/naukri-auto-applier.git
   ```
2. Open Google Chrome and visit:
   ```text
   chrome://extensions/
   ```
3. Enable **Developer mode** using the toggle switch in the **top-right corner**.
4. Click the **Load unpacked** button in the **top-left corner**.
5. Select the `naukri-auto-applier` folder.
6. The extension is now active!

---

## 🚀 How to Use

1. Log into your account on [Naukri.com](https://www.naukri.com/).
2. Navigate to:
   - **Recommended Jobs**: `https://www.naukri.com/mnjuser/recommendedjobs`
   - Or any **Search Results** page (e.g., *GenAI Engineer, Python Developer*).
3. Look for the floating **🚀 Naukri Multi-Apply** panel in the bottom-right corner.
4. Click **"Start Auto Apply"**.
5. The extension will:
   - Check 5 job checkboxes at a time and hit **"Apply to 5 jobs"**.
   - Auto-fill any questionnaire popups that appear.
   - Smoothly paginate to the next page when all visible jobs are processed.
6. Click **"Stop Automation"** at any time to pause.

---

## ⚙️ Customizing Your Profile Details

You can edit `content.js` to customize your pre-filled answers:

```javascript
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
```

---

## 🛡️ Recommended Usage Guidelines

- **Daily Quota**: Apply to **30 – 50 jobs per session** once or twice daily. Avoid running continuous automation on hundreds of jobs in a single sitting.
- **Refresh Interval**: Keep your profile updated between 9:00 AM – 10:30 AM IST for peak recruiter search ranking.

---

## 📄 License
MIT License. Created for personal productivity and streamlined job searching.
