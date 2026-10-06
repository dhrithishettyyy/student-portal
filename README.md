# ReRoute 🔄
> **“Missed a task? We rebuild the plan.”**  
> *Adaptive AI Study Planner & Progress Tracker*

---

## 🌟 Overview
**ReRoute** is not a static timetable generator. Its main innovation is **adaptive rescheduling**. When real life happens and a student falls behind, misses a study session, or only finishes half a topic, ReRoute automatically recalculates priorities, adjusts workloads, and seamlessly rebuilds the future study schedule without exceeding daily study hours.

### The Core Cycle
$$\text{PLAN} \longrightarrow \text{STUDY} \longrightarrow \text{TRACK} \longrightarrow \text{ANALYZE} \longrightarrow \text{REROUTE} \longrightarrow \text{IMPROVE}$$

---

## 🚀 Live Demo Scenario (For Hackathon Judges)
Use the sticky bottom demo bar to execute the complete judge flow in seconds:

1. **Step 1: Mark DBMS as Completed**  
   - Topic progress jumps to 100%. Workload is permanently removed from future days. Celebratory confetti & XP awarded!
2. **Step 2: Mark Java as Missed 💀**  
   - Workload preserved, urgency boosted by +25 points. Automatically moved to tomorrow's #1 priority slot.
3. **Step 3: Mark AI as Partially Completed 🍳**  
   - Partial completion logged. Unfinished minutes carried over into tomorrow's schedule without exceeding the 3-hour daily capacity.
4. **Step 4: View Live ReRoute Diff 🔄**  
   - Inspect the chronological audit log showing exact mathematical adjustments, safeguards enforced, and Gen-Z commentary.

---

## 🛠️ Architecture & Features

- **Intelligent Priority Engine**:
  $$\text{Priority Score} = \text{Deadline Urgency (0-40)} + \text{Difficulty (5-25)} + \text{Progress Gap (0-25)} + \text{Workload (0-10)} + \text{Missed Boost (0-20)}$$
  Classifies tasks as **🔴 High Priority**, **🟡 Medium Priority**, or **🟢 Low Priority**, complete with explainable badge.

- **Adaptive ReRoute Engine**:
  - Dynamically distributes work across 7 days.
  - Strictly caps study time per day (e.g. 3 hours/day).
  - Prevents duplicate tasks and never reschedules completed work.

- **Next Best Task & Focus Mode**:
  - Spotlight on the single most critical task right now.
  - Immersive study session with live countdown timer and synthesized alpha-wave focus audio.
  - 3 outcomes: **COOKED IT ✅**, **PARTIALLY COOKED 😐**, **FUMBLED 💀** that trigger instant re-scheduling.

- **Academic Vibe Check**:
  - Dynamically calculates:
    - **🔥 YOU'RE COOKING**
    - **😐 GETTING THERE**
    - **💀 SLIGHTLY COOKED**

- **Progress Analytics**:
  - 4 interactive Recharts visualizations: Subject Mastery, Weekly Planned vs Actual Hours, Task Outcomes, and Overall Workload.

- **Lightweight Gamification**:
  - XP progression system through ranks:
    *Procrastination Era 💀 → Trying My Best 🥲 → Getting Serious 👀 → Locked In 🔒 → Academic Weapon ⚔️ → Final Boss Mode 👑*

- **AI Study Insights & Roast My Progress 🔥**:
  - Contextual strategic advice and playful Gen-Z roasts powered by built-in heuristic analysis with optional Google Gemini API support.

---

## 🏃 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
http://localhost:5173/
```
