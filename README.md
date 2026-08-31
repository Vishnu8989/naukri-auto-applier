# 🚀 Naukri Smart Auto-Applier (Manifest V3)

<p align="center">
  <img src="https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Chrome Extension" />
  <img src="https://img.shields.io/badge/Manifest-V3-34A853?style=for-the-badge&logo=google&logoColor=white" alt="Manifest V3" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License: MIT" />
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=for-the-badge" alt="PRs Welcome" />
</p>

<p align="center">
  <b>An intelligent, lightweight Chrome Extension to automate 5-in-1 batch applies and 1-click applications on Naukri.com with automatic questionnaire answering and rate-limit safe pacing.</b>
</p>

---

## 🌟 Why Use This?

Applying to hundreds of job postings manually on Naukri is tedious. **Naukri Smart Auto-Applier** automates the repetitive application loop directly in your browser:
- ⚡ **Leverages Naukri's Native 5-in-1 Batch Apply**: Detects multi-select tuples and triggers batch applications for maximum speed.
- 🎯 **1-Click Apply Fallback**: Handles single-click applies when batch mode is unavailable.
- 📝 **Auto-Fills Questionnaire Popups**: Automatically answers common prompts (*Current CTC, Expected CTC, Notice Period, Tech Experience*).
- ⏱️ **Bot-Safe Pacing (2s Delay)**: Emulates natural human interaction timing to avoid rate limits and anti-bot blocks.
- 🎛️ **Floating HUD Widget**: Injects an unobtrusive dark-mode controller right onto Naukri pages.

---

## 🏗️ Architecture & Workflow

```
[ Naukri Search / Recommendations Page ]
                   │
                   ▼
       [ Extension Detects Cards ]
                   │
         ┌─────────┴─────────┐
         │                   │
  [ 5-in-1 Batch Mode? ]   [ Single 1-Click? ]
         │                   │
  Selects 5 Checkboxes     Clicks "Apply"
         │                   │
  Hits "Apply to 5 Jobs"     │
         └─────────┬─────────┘
                   │
                   ▼
     [ Questionnaire / Modal Appears? ]
         ├── Yes: Auto-fills CTC, Notice, Experience & Submits
         └── No: Continues loop
                   │
                   ▼
     [ 2.0s Human Pacing Delay ]
                   │
                   ▼
    [ Smooth Scroll & Auto-Pagination ]
```

---

## 📦 Quick Installation Guide

### Method 1: Load Unpacked in Chrome (30 Seconds)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/Vishnu8989/naukri-auto-applier.git
   ```
2. Open Google Chrome and go to:
   ```text
   chrome://extensions/
   ```
3. Enable **Developer mode** via the toggle in the **top-right corner**.
4. Click **Load unpacked** in the **top-left corner**.
5. Select the cloned `naukri-auto-applier` directory.
6. The extension is now installed and active!

---

## 🎮 How to Use

1. Log into your account on [Naukri.com](https://www.naukri.com/).
2. Open your [Recommended Jobs Page](https://www.naukri.com/mnjuser/recommendedjobs) or any keyword search query.
3. You will see the floating **🚀 Naukri Multi-Apply** HUD in the bottom-right corner.
4. Click **"Start Auto Apply"**.
5. Watch the real-time status counter update as jobs are submitted automatically.
6. Click **"Stop Automation"** anytime to pause.

---

## ⚙️ Customizing Your Profile Config

To customize the values automatically entered into questionnaires, open [`content.js`](content.js) and modify the `PROFILE_CONFIG` object:

```javascript
const PROFILE_CONFIG = {
  totalExperience: "3.4",     // Your total years of experience
  pythonExp: "3",             // Core tech stack experience
  fastApiExp: "2",
  genAiExp: "2",
  currentCtc: "8.5",          // Current CTC (in LPA)
  expectedCtc: "16",          // Expected CTC (in LPA)
  noticePeriodDays: "30",     // "0", "15", "30", or "Immediate"
  relocate: "Yes"
};
```

---

## 🛡️ Best Practices & Anti-Bot Safety

1. **Session Limits**: It is recommended to apply to **30 – 50 jobs per session** once or twice daily.
2. **Peak Algorithm Timing**: Update your profile on Naukri between **9:00 AM – 10:30 AM IST** to rank at the top of recruiter searches.
3. **Keep Tab Visible**: Chrome optimizes background tabs; keep the Naukri tab active or in a separate window while applying.

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn and build. Any contributions you make are **greatly appreciated**!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewFeature`)
3. Commit your Changes (`git commit -m 'Add NewFeature'`)
4. Push to the Branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<p align="center">
  Crafted with ❤️ by <a href="https://github.com/Vishnu8989">Vishnu Singh</a>
</p>
