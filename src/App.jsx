import React, { useMemo, useRef, useState } from "react";
import Footer from "./components/Footer";

// Helper function to parse time string to Date object
const parseTime = (timeStr) => {
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, seconds, 0);
  return date;
};

const getTimeDifference = (startTime, endTime) => {
  const diffMs = endTime - startTime;
  return diffMs / (1000 * 60 * 60);
};

const buildChronologicalTimes = (logs) => {
  const timeline = [];
  let dayOffset = 0;
  let previousBaseTime = null;
  logs.forEach((log) => {
    const baseTime = parseTime(log);
    if (previousBaseTime && baseTime < previousBaseTime) dayOffset += 1;
    const current = new Date(baseTime);
    current.setDate(current.getDate() + dayOffset);
    timeline.push(current);
    previousBaseTime = baseTime;
  });
  return timeline;
};

const formatHours = (hours) => {
  const totalMinutes = Math.floor(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
};

const formatHoursWithSeconds = (hours) => {
  const totalSeconds = Math.floor(hours * 60 * 60);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}h ${m}m ${s}s`;
};

const shortBreakMessages = [
  "That was quick! You're back before your chair noticed 😄",
  "Blink-and-you're-back break! Productivity level: pro 🚀",
  "Quick pit stop complete! You're on fire 🔥",
  "That break was smoother than a coffee sip ☕✨",
  "Back already? That’s some serious focus energy 💪",
  "Speed mode activated! You didn’t even miss a beat ⚡",
  "In and out like a pro! Let’s keep the momentum going 🏃‍♀️",
  "That was a ninja-level break 🥷 — fast and efficient!",
  "Quick refresh done! Your productivity just got a boost 📈",
  "That break was so fast, even time is impressed ⏱️😄",
  "Energy restored in record time! Let’s gooo 🚀",
  "You took a break… or just teleported back? 😆",
  "Fast break, strong comeback 💥",
  "That was a micro-break with macro energy ⚡",
  "Back in action already? Love the dedication 🙌",
];
const mediumBreakMessages = [
  "Hmm, that's a looong coffee break. Did you fall into the coffee machine? ☕",
  "Is that a break or a mini-vacation? Your desk is filing abandonment issues 🗄️",
  "Your chair called and asked if you two broke up 💔",
  "That coffee break became a proper coffee date 💍☕",
  "Your mouse started getting separation anxiety during that break 🐭",
  "That break had a beginning, middle, and a full storyline 📖",
  "That break was enough for a quick episode and a stretch 🍿",
  "Did you take a break or start a new life chapter? 📘",
  "Your coffee probably got cold waiting for you ☕❄️",
  "That was less of a break and more of a lifestyle choice 😄",
  "Your desk missed you… it even started collecting dust 🧹",
  "That break was enough to lose your tab for a minute 🤔",
  "Your keyboard almost filed a missing person report ⌨️",
  "That was a full recharge… and maybe a little extra 🔋",
  "Your screen saver got more attention than your work 💻",
];

const longBreakMessages = [
  "WHOA! That's not a break, that's a vacation! Did you go to Hawaii? 🏝️",
  "Welcome back from your expedition! Did you discover any new species? 🧪",
  "Break so long your computer had to check if you still work here 🖥️",
  "Your break was so long, your desk plants evolved 🌱➡️🌴",
  "Did you just hibernate? Bears take shorter breaks than that 🐻",
  "That wasn’t a break… that was a full recharge cycle 🔋",
  "You disappeared so long, even your coffee gave up waiting ☕",
  "Your break had seasons… winter, summer, everything ❄️☀️",
  "That was less of a break and more of a world tour 🌍",
  "Your desk almost started renting out your chair 🪑",
  "Even your screen saver got bored waiting for you 💻",
  "That break deserves its own calendar entry 📅",
  "You took a break long enough to forget your password 🔐",
  "Your break was so long, your tasks started missing you 📝",
  "That wasn't a break… that was a full storyline with a plot twist 🎬",
  "Your chair is now emotionally attached and confused 😄",
  "You went on break and came back with life experience ✨",
];

// Helper function to avoid repetitive warning messages
const getBreakWarning = (
  breakHours,
  segmentKey,
  warningCacheRef,
  warningHistoryRef,
) => {
  let messages = shortBreakMessages;
  let level = "info";
  let color = "#a3a3a3";
  const breakMinutes = Math.floor(breakHours * 60);
  if (breakMinutes > 90) { messages = longBreakMessages; level = "danger"; color = "#57534e"; }
  else if (breakMinutes >= 60) { messages = mediumBreakMessages; level = "warning"; color = "#78716c"; }
  const cachedWarning = warningCacheRef.current.get(segmentKey);
  if (cachedWarning && cachedWarning.level === level) return cachedWarning;
  const recentIndexes = warningHistoryRef.current[level] || [];
  let candidateIndexes = messages.map((_, i) => i).filter((i) => !recentIndexes.includes(i));
  if (candidateIndexes.length === 0) candidateIndexes = messages.map((_, i) => i);
  const chosenIndex = candidateIndexes[Math.floor(Math.random() * candidateIndexes.length)];
  const warning = { text: messages[chosenIndex], level, color };
  warningHistoryRef.current[level] = [...recentIndexes.slice(-2), chosenIndex];
  warningCacheRef.current.set(segmentKey, warning);
  return warning;
};

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;

const pad2 = (n) => String(n).padStart(2, "0");

const toTimeInputValue = (hms) => {
  if (!hms || !timeRegex.test(hms)) return "";
  const [h, m] = hms.split(":").map((x) => Number(x));
  return `${pad2(h)}:${pad2(m)}`;
};

const fromTimeInputValue = (hm) => {
  if (!hm) return "";
  const [a, b] = hm.split(":");
  const h = Number(a);
  const m = Number(b);
  if (Number.isNaN(h) || Number.isNaN(m)) return "";
  return `${pad2(h)}:${pad2(m)}:00`;
};

const scheduleTimeInputStyle = {
  flex: 1,
  minWidth: "min(100%, 9rem)",
  padding: "12px 14px",
  border: "2px solid #e7e5e4",
  borderRadius: "12px",
  fontSize: "16px",
  fontFamily: "monospace",
  outline: "none",
  boxSizing: "border-box",
  color: "#1c1917",
  backgroundColor: "#fff",
  cursor: "pointer",
};

/** Native time picker (compact UI); stored as HH:MM:00. Optional end can be cleared; `showClearWhenFilled` adds Clear when a time is set (e.g. office start). */
function ScheduleTimeSelects({ value, onChange, optional, showClearWhenFilled = false }) {
  const valid = Boolean(value && timeRegex.test(value));
  const displayValue = valid ? toTimeInputValue(value) : "";
  const timeInputRef = useRef(null);

  const openNativeTimePicker = () => {
    const el = timeInputRef.current;
    if (!el || typeof el.showPicker !== "function") return;
    try {
      el.showPicker();
    } catch {
      // Unsupported or not allowed (e.g. no user gesture in strict environments)
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
      <input
        ref={timeInputRef}
        type="time"
        step={60}
        value={displayValue}
        onClick={openNativeTimePicker}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "") {
            onChange("");
            return;
          }
          const next = fromTimeInputValue(v);
          if (next) onChange(next);
        }}
        style={scheduleTimeInputStyle}
        onFocus={(e) => {
          e.target.style.borderColor = "#57534e";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#e7e5e4";
        }}
      />
      {(optional || showClearWhenFilled) && valid && (
        <button
          type="button"
          onClick={() => onChange("")}
          style={{
            flexShrink: 0,
            padding: "10px 14px",
            fontSize: "13px",
            fontWeight: "600",
            color: "#57534e",
            backgroundColor: "#f5f5f4",
            border: "2px solid #e7e5e4",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      )}
    </div>
  );
}

function App() {
  const [timeInput, setTimeInput] = useState("");
  const [timeLogs, setTimeLogs] = useState([]);
  const [error, setError] = useState("");
  const [isLogInputLocked, setIsLogInputLocked] = useState(false);

  // Advanced mode
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [scheduledStart, setScheduledStart] = useState("");
  const [scheduledEnd, setScheduledEnd] = useState("");

  const inputRef = useRef(null);
  const warningCacheRef = useRef(new Map());
  const warningHistoryRef = useRef({ info: [], warning: [], danger: [] });

  const addTimeLogs = () => {
    if (isLogInputLocked) return;
    setError("");
    const timeEntries = timeInput.trim().split(/\s+/);
    const invalidEntries = timeEntries.filter((e) => !timeRegex.test(e));
    if (invalidEntries.length > 0) {
      setError(`Invalid time format: ${invalidEntries.join(", ")}. Please use HH:MM:SS format.`);
      return;
    }
    setTimeLogs([...timeLogs, ...timeEntries]);
    setIsLogInputLocked(true);
  };

  const removeTimeLog = (index) => {
    const newLogs = [...timeLogs];
    newLogs.splice(index, 1);
    setTimeLogs(newLogs);
  };

  const resetAdvancedAndClose = () => {
    setScheduledStart("");
    setScheduledEnd("");
    setShowAdvanced(false);
  };

  const clearAllLogs = () => {
    setTimeLogs([]);
    setTimeInput("");
    setError("");
    setIsLogInputLocked(false);
    setScheduledStart("");
    setScheduledEnd("");
    setShowAdvanced(false);
    warningCacheRef.current.clear();
    warningHistoryRef.current = { info: [], warning: [], danger: [] };
    requestAnimationFrame(() => {
      if (inputRef.current) { inputRef.current.focus(); inputRef.current.setSelectionRange(0, 0); }
    });
  };

  const calculateStats = () => {
    if (timeLogs.length < 2) return { totalHours: 0, breakHours: 0, totalWithBreaks: 0, segments: [], breakWarnings: [] };
    const chronologicalTimes = buildChronologicalTimes(timeLogs);
    let totalWorkHours = 0;
    let totalBreakHours = 0;
    const segments = [];
    const breakWarnings = [];
    for (let i = 0; i < timeLogs.length - 1; i += 2) {
      const startTime = chronologicalTimes[i];
      const endTime = chronologicalTimes[i + 1] || chronologicalTimes[i];
      const workHours = getTimeDifference(startTime, endTime);
      totalWorkHours += workHours;
      segments.push({ start: timeLogs[i], end: timeLogs[i + 1] || timeLogs[i], hours: workHours, type: "work" });
      if (i + 2 < timeLogs.length) {
        const breakHours = getTimeDifference(endTime, chronologicalTimes[i + 2]);
        totalBreakHours += breakHours;
        segments.push({ start: timeLogs[i + 1], end: timeLogs[i + 2], hours: breakHours, type: "break" });
      }
    }
    // Any non-zero total break: short (<60m), medium (60–90m), long (>90m)
    if (totalBreakHours > 0) {
      const warning = getBreakWarning(totalBreakHours, "total-break", warningCacheRef, warningHistoryRef);
      breakWarnings.push({ ...warning, totalBreakHours });
    } else {
      warningCacheRef.current.delete("total-break");
    }
    return { totalHours: totalWorkHours, breakHours: totalBreakHours, totalWithBreaks: totalWorkHours + totalBreakHours, segments, breakWarnings };
  };

  const stats = calculateStats();

  const advancedOutcome = useMemo(() => {
    if (!showAdvanced) return { error: null, result: null };
    if (!scheduledStart || !timeRegex.test(scheduledStart)) {
      return { error: "Please select a valid office start time.", result: null };
    }
    if (timeLogs.length < 1) {
      return { error: "Add time logs first. The first entry is your arrival time.", result: null };
    }
    const actualArrivalStr = timeLogs[0];
    const scheduled = parseTime(scheduledStart);
    const actual = parseTime(actualArrivalStr);
    let lateHours = getTimeDifference(scheduled, actual);
    const isLate = lateHours > 0;
    const isEarly = lateHours < 0;
    lateHours = Math.abs(lateHours);

    let scheduledTotalHours = null;
    if (scheduledEnd && timeRegex.test(scheduledEnd)) {
      const schedEnd = parseTime(scheduledEnd);
      scheduledTotalHours = Math.abs(getTimeDifference(scheduled, schedEnd));
    }

    const { breakHours } = stats;
    const excessBreakHours = Math.max(0, breakHours - 1);

    let compensatedLeaveTime = null;
    if (scheduledEnd && timeRegex.test(scheduledEnd)) {
      const schedEnd = parseTime(scheduledEnd);
      const missedMs = isLate ? lateHours * 60 * 60 * 1000 : 0;
      const excessBreakMs = excessBreakHours * 60 * 60 * 1000;
      const leave = new Date(schedEnd.getTime() + missedMs + excessBreakMs);
      compensatedLeaveTime = `${String(leave.getHours()).padStart(2, "0")}:${String(leave.getMinutes()).padStart(2, "0")}:${String(leave.getSeconds()).padStart(2, "0")}`;
    }

    return {
      error: null,
      result: {
        scheduledStart,
        actualArrival: actualArrivalStr,
        isLate,
        isEarly,
        lateHours,
        breakHours,
        excessBreakHours,
        scheduledTotalHours,
        compensatedLeaveTime,
        scheduledEnd: scheduledEnd && timeRegex.test(scheduledEnd) ? scheduledEnd : null,
      },
    };
  }, [showAdvanced, scheduledStart, scheduledEnd, timeLogs, stats.breakHours]); // eslint-disable-line react-hooks/exhaustive-deps -- stats.breakHours syncs breaks from logs

  const summaryCards = useMemo(() => {
    const base = [
      { key: "work", bg: "#44403c", icon: "💼", label: "Working Hours", value: formatHoursWithSeconds(stats.totalHours), textColor: "#d6d3d1" },
      { key: "break", bg: "#78716c", icon: "☕", label: "Break Time", value: formatHoursWithSeconds(stats.breakHours), textColor: "#e7e5e4" },
      { key: "total", bg: "#a8a29e", icon: "⏱️", label: "Total Time", value: formatHoursWithSeconds(stats.totalWithBreaks), textColor: "#fafaf9" },
    ];
    const a = advancedOutcome.result;
    if (!showAdvanced || !a) return base;
    const extra = [];
    if (a.compensatedLeaveTime && a.scheduledEnd && !a.isLate && a.excessBreakHours <= 0) {
      extra.push({
        key: "ontime",
        bg: "#15803d",
        icon: "🎯",
        label: "Leave at scheduled end",
        value: a.scheduledEnd,
        textColor: "#fafaf9",
        detail: "On time — no extra stay needed.",
      });
    }
    return [...base, ...extra];
  }, [showAdvanced, advancedOutcome.result, stats.totalHours, stats.breakHours, stats.totalWithBreaks]);

  const adv = advancedOutcome.result;

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLogInputLocked) addTimeLogs();
  };

  const cardBase = {
    backgroundColor: "#fafaf9",
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e7e5e4",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f4", padding: "40px 20px", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <style>{`
        @keyframes warningPulse { 0%,100%{box-shadow:0 1px 3px rgba(0,0,0,.1)}50%{box-shadow:0 0 0 6px rgba(120,113,108,.20)}}
        @keyframes iconBounce { 0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @keyframes textGlow { 0%,100%{color:#57534e}50%{color:#292524}}
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideDown { from{opacity:0;max-height:0}to{opacity:1;max-height:2000px}}
        .advanced-panel { animation: fadeIn 0.35s ease forwards; }
        .result-card { animation: fadeIn 0.4s ease forwards; }
        .stat-badge { display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:700; }
      `}</style>

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "48px", fontWeight: "800", color: "#1c1917", margin: "0 0 12px 0" }}>Time Logger</h1>
          <p style={{ color: "#a8a29e", fontSize: "14px", marginTop: "10px" }}>Used by professionals to track accurate work hours and productivity</p>
        </div>

        {/* How to Use */}
        <div style={{ ...cardBase, marginBottom: "24px", padding: "0px 20px 22px 40px" }}>
          <h3 style={{ marginBottom: "12px", color: "#1c1917" }}>📘 How to Use</h3>
          <p style={{ margin: 0, color: "#57534e", lineHeight: "1.6" }}>
            1. Copy and paste your start and end times in the input box (e.g., 09:00:00 17:30:00) <br />
            2. Click "Add Logs" <br />
            3. Instantly view working hours, break time, and total time
          </p>
        </div>

        {/* Input Section */}
        <div style={{ ...cardBase, marginBottom: "24px" }}>
          <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
            <textarea
              ref={inputRef}
              disabled={isLogInputLocked}
              style={{ flex: 1, padding: "16px 20px", border: error ? "2px solid #78716c" : "2px solid #e7e5e4", borderRadius: "16px", fontSize: "16px", minHeight: "100px", resize: "vertical", fontFamily: "inherit", outline: "none", backgroundColor: isLogInputLocked ? "#f5f5f4" : "#ffffff", color: isLogInputLocked ? "#78716c" : "#1c1917", cursor: isLogInputLocked ? "not-allowed" : "text", transition: "border-color 0.2s" }}
              placeholder="Enter times in HH:MM:SS format (e.g., 09:00:00 17:30:00)"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={(e) => { if (!error) e.target.style.borderColor = "#57534e"; }}
              onBlur={(e) => { if (!error) e.target.style.borderColor = "#e7e5e4"; }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button onClick={addTimeLogs} disabled={isLogInputLocked}
                style={{ backgroundColor: isLogInputLocked ? "#a8a29e" : "#57534e", color: "#fafaf9", border: "none", borderRadius: "16px", padding: "16px 32px", fontSize: "16px", fontWeight: "600", cursor: isLogInputLocked ? "not-allowed" : "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => { if (!isLogInputLocked) e.target.style.backgroundColor = "#44403c"; }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = isLogInputLocked ? "#a8a29e" : "#57534e"; }}
              >Add Logs</button>
              <button onClick={clearAllLogs}
                style={{ backgroundColor: "#e7e5e4", color: "#44403c", border: "none", borderRadius: "16px", padding: "16px 32px", fontSize: "16px", fontWeight: "600", cursor: "pointer", transition: "background-color 0.2s" }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#d6d3d1")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#e7e5e4")}
              >Clear All</button>
            </div>
          </div>
          {error && <p style={{ color: "#78716c", margin: "8px 0 0 0", fontSize: "14px", fontWeight: "500" }}>⚠️ {error}</p>}
          <p style={{ color: "#a8a29e", margin: "8px 0 0 0", fontSize: "14px" }}>💡 Paste multiple timestamps separated by spaces</p>
        </div>

        {/* Break Warnings (before Advanced — shows once logs include breaks ≥ 1h) */}
        {stats.breakWarnings.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            {stats.breakWarnings.map((warning, index) => (
              <div key={index} style={{ backgroundColor: "#fafaf9", borderRadius: "20px", padding: "20px 24px", marginBottom: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", borderLeft: `6px solid ${warning.color}`, display: "flex", alignItems: "center", gap: "16px", border: "1px solid #e7e5e4", animation: "warningPulse 1.8s ease-in-out infinite" }}>
                <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: warning.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", animation: "iconBounce 1s ease-in-out infinite" }}>
                  {warning.level === "info" ? "⚡" : warning.level === "warning" ? "⏰" : "🚨"}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 6px 0", fontWeight: "700", fontSize: "16px", color: "#1c1917" }}>Total Break Time: {formatHoursWithSeconds(warning.totalBreakHours || 0)}</p>
                  <p style={{ margin: 0, color: "#57534e", fontSize: "15px", fontWeight: "600", animation: "textGlow 1.6s ease-in-out infinite" }}>{warning.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ADVANCED LATE ARRIVAL SECTION ── */}
        <div style={{ marginBottom: "24px" }}>
          <button
            type="button"
            onClick={() => {
              if (showAdvanced) resetAdvancedAndClose();
              else setShowAdvanced(true);
            }}
            style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", backgroundColor: showAdvanced ? "#44403c" : "#fafaf9", color: showAdvanced ? "#fafaf9" : "#1c1917", border: "2px solid " + (showAdvanced ? "#44403c" : "#e7e5e4"), borderRadius: "20px", padding: "18px 28px", fontSize: "16px", fontWeight: "700", cursor: "pointer", transition: "all 0.25s", textAlign: "left" }}
          >
            <span style={{ fontSize: "22px" }}>🔍</span>
            <span style={{ flex: 1 }}>Advanced: Late Arrival Calculator</span>
            <span style={{ fontSize: "20px", transition: "transform 0.25s", transform: showAdvanced ? "rotate(180deg)" : "rotate(0deg)" }}>⌄</span>
          </button>

          {showAdvanced && (
            <div className="advanced-panel" style={{ ...cardBase, borderRadius: "0 0 24px 24px", borderTop: "none", marginTop: "-12px", paddingTop: "36px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "24px" }}>
                <p style={{ color: "#78716c", margin: 0, fontSize: "15px", lineHeight: "1.6", flex: "1 1 240px" }}>
                  Select your <strong>office start and end</strong>. Lateness, totals, and <strong>suggested leave</strong> update automatically in the summary cards below while this section is open.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", marginBottom: "20px" }}>
                {/* Scheduled Start */}
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#57534e", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                    📅 Office Start Time <span style={{ color: "#e74c3c" }}>*</span>
                  </label>
                  <ScheduleTimeSelects value={scheduledStart} onChange={setScheduledStart} optional={false} showClearWhenFilled />
                  <p style={{ margin: "6px 0 0 4px", fontSize: "12px", color: "#a8a29e" }}>Pick a start time when needed; leave blank until then. Seconds stay :00 in calculations.</p>
                </div>

                {/* Scheduled End */}
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#57534e", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                    🏁 Office End Time <span style={{ color: "#a8a29e", fontSize: "11px", fontWeight: "500" }}>(optional)</span>
                  </label>
                  <ScheduleTimeSelects value={scheduledEnd} onChange={setScheduledEnd} optional />
                  <p style={{ margin: "6px 0 0 4px", fontSize: "12px", color: "#a8a29e" }}>Leave empty or tap Clear if you only need lateness; set an end time for compensated leave.</p>
                </div>
              </div>

              {/* Info box */}
              <div style={{ backgroundColor: "#f5f5f4", border: "1px solid #e7e5e4", borderRadius: "14px", padding: "16px 20px", marginBottom: "20px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "20px", marginTop: "2px" }}>ℹ️</span>
                <div style={{ fontSize: "14px", color: "#57534e", lineHeight: "1.6" }}>
                  <strong>How it works:</strong> Your <em>first log entry</em> is treated as your actual arrival time. We compare it to your scheduled start to calculate lateness. Breaks are pulled from your existing logs automatically.
                </div>
              </div>

              {advancedOutcome.error && (
                <div style={{ backgroundColor: "#fdf2f2", border: "1px solid #e7b4b4", borderRadius: "12px", padding: "12px 18px", marginBottom: "16px", color: "#78716c", fontSize: "14px", fontWeight: "500" }}>
                  ⚠️ {advancedOutcome.error}
                </div>
              )}

              {/* Arrival status */}
              {adv && (
                <div className="result-card" style={{ marginTop: "20px" }}>
                  <div style={{
                    borderRadius: "18px",
                    padding: "24px 28px",
                    backgroundColor: adv.isLate ? "#fff8f0" : adv.isEarly ? "#f0fff4" : "#f5f5f4",
                    border: `2px solid ${adv.isLate ? "#d97706" : adv.isEarly ? "#16a34a" : "#a8a29e"}`,
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                  }}
                  >
                    <div style={{ fontSize: "52px" }}>
                      {adv.isLate ? "⏰" : adv.isEarly ? "🌟" : "✅"}
                    </div>
                    <div>
                      <div style={{ fontSize: "22px", fontWeight: "800", color: "#1c1917", marginBottom: "4px" }}>
                        {adv.isLate
                          ? `You arrived ${formatHoursWithSeconds(adv.lateHours)} late`
                          : adv.isEarly
                            ? `You arrived ${formatHoursWithSeconds(adv.lateHours)} early 🎉`
                            : "You arrived exactly on time! 🎯"}
                      </div>
                      <div style={{ fontSize: "15px", color: "#78716c" }}>
                        Scheduled: <strong>{adv.scheduledStart}</strong> → Actual arrival: <strong>{adv.actualArrival}</strong>
                      </div>
                      {adv.scheduledTotalHours != null && (
                        <div style={{ fontSize: "14px", color: "#a8a29e", marginTop: "8px" }}>
                          Shift on schedule: <strong>{formatHours(adv.scheduledTotalHours)}</strong>
                          {adv.isLate && (
                            <>
                              {" "}
                              · Time missed: <strong>{formatHoursWithSeconds(adv.lateHours)}</strong>
                            </>
                          )}
                        </div>
                      )}
                      {!adv.scheduledEnd && (
                        <div style={{ fontSize: "14px", color: "#a8a29e", marginTop: "8px" }}>
                          Set <strong>Office End Time</strong> above to see suggested leave time under the hour summary.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats Summary + suggested leave row (on-time card when applicable; leave strip under grid) */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
            {summaryCards.map((card) => (
              <div
                key={card.key}
                style={{
                  backgroundColor: card.bg,
                  borderRadius: "20px",
                  padding: "28px",
                  color: "#fafaf9",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "8px" }}>{card.icon}</div>
                <p style={{ color: card.textColor, margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>{card.label}</p>
                <p
                  style={{
                    fontSize: "42px",
                    fontWeight: "800",
                    margin: 0,
                    fontFamily: card.key === "ontime" ? "monospace" : "inherit",
                    wordBreak: "break-word",
                  }}
                >
                  {card.value}
                </p>
                {card.detail && (
                  <p style={{ margin: "14px 0 0 0", fontSize: "13px", lineHeight: 1.55, color: card.textColor, opacity: 0.9 }}>
                    {card.detail}
                  </p>
                )}
                {card.fineprint && (
                  <p style={{ margin: "12px 0 0 0", fontSize: "12px", lineHeight: 1.5, color: card.textColor, opacity: 0.75, fontFamily: "monospace" }}>
                    {card.fineprint}
                  </p>
                )}
              </div>
            ))}
          </div>

          {adv && adv.compensatedLeaveTime && adv.scheduledEnd && (adv.isLate || adv.excessBreakHours > 0) && (
            <div className="result-card" style={{ marginTop: "16px", backgroundColor: "#fafaf9", border: "2px solid #44403c", borderRadius: "18px", padding: "22px 28px", display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
              <div style={{ width: "56px", height: "56px", backgroundColor: "#44403c", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", flexShrink: 0 }}>🚪</div>
              <div style={{ flex: "1 1 220px", minWidth: 0 }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#78716c", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "4px" }}>Suggested Leave Time to Compensate</div>
                <div style={{ fontSize: "clamp(28px, 5vw, 36px)", fontWeight: "800", color: "#1c1917", fontFamily: "monospace" }}>{adv.compensatedLeaveTime}</div>
                <div style={{ fontSize: "13px", color: "#a8a29e", marginTop: "6px", lineHeight: 1.5 }}>
                  {adv.isLate && adv.excessBreakHours > 0 && (
                    <>Stay until this time to cover the {formatHoursWithSeconds(adv.lateHours)} you missed and {formatHoursWithSeconds(adv.excessBreakHours)} break beyond your 1h allowance</>
                  )}
                  {adv.isLate && adv.excessBreakHours <= 0 && (
                    <>Stay until this time to cover the {formatHoursWithSeconds(adv.lateHours)} you missed</>
                  )}
                  {!adv.isLate && adv.excessBreakHours > 0 && (
                    <>Stay until this time to cover {formatHoursWithSeconds(adv.excessBreakHours)} break beyond your 1h allowance</>
                  )}
                </div>
              </div>
              <div style={{ fontSize: "13px", color: "#78716c", textAlign: "right", lineHeight: 1.65, flexShrink: 0, marginLeft: "auto" }}>
                Scheduled end:<br />
                <strong style={{ fontFamily: "monospace", fontSize: "16px", color: "#1c1917" }}>{adv.scheduledEnd}</strong>
                <br />
                {adv.isLate && <span style={{ color: "#a8a29e" }}>+ {formatHoursWithSeconds(adv.lateHours)} late</span>}
                {adv.isLate && adv.excessBreakHours > 0 && <br />}
                {adv.excessBreakHours > 0 && <span style={{ color: "#a8a29e" }}>+ {formatHoursWithSeconds(adv.excessBreakHours)} over 1h break</span>}
              </div>
            </div>
          )}
        </div>

        {/* Bottom: Time Entries + Work Sessions */}
        <div style={{ display: "grid", gridTemplateColumns: stats.segments.filter((s) => s.type === "work").length > 0 ? "1fr 1fr" : "1fr", gap: "24px" }}>
          {/* Time Entries */}
          <div style={cardBase}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "24px", paddingBottom: "16px", borderBottom: "2px solid #e7e5e4" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "14px", backgroundColor: "#57534e", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "16px" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fafaf9" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              </div>
              <div>
                <h2 style={{ fontSize: "22px", fontWeight: "700", margin: "0 0 4px 0", color: "#1c1917" }}>Time Entries</h2>
                <p style={{ margin: 0, fontSize: "14px", color: "#78716c" }}>{timeLogs.length} {timeLogs.length === 1 ? "entry" : "entries"} recorded</p>
              </div>
            </div>
            <div style={{ maxHeight: "420px", overflowY: "auto", paddingRight: "8px" }}>
              {timeLogs.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 20px", color: "#a8a29e" }}>
                  <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#e7e5e4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "36px" }}>⏱️</div>
                  <p style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#78716c" }}>Start by adding your first time entry</p>
                  <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#a8a29e" }}>Example: 09:00:00 13:00:00 14:00:00 18:00:00</p>
                </div>
              ) : (
                <div style={{ display: "grid", gap: "10px" }}>
                  {timeLogs.map((log, index) => (
                    <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderRadius: "14px", backgroundColor: "#ffffff", border: "2px solid #e7e5e4", transition: "all 0.2s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f5f5f4"; e.currentTarget.style.borderColor = "#a8a29e"; e.currentTarget.style.transform = "translateX(4px)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; e.currentTarget.style.borderColor = "#e7e5e4"; e.currentTarget.style.transform = "translateX(0)"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: index === 0 && showAdvanced ? "#d97706" : "#57534e" }} />
                        <span style={{ fontWeight: "700", fontSize: "18px", color: "#1c1917", fontFamily: "monospace", letterSpacing: "0.5px" }}>{log}</span>
                        {index === 0 && showAdvanced && (
                          <span style={{ backgroundColor: "#fef3c7", color: "#92400e", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "6px", border: "1px solid #fcd34d" }}>ARRIVAL</span>
                        )}
                      </div>
                      <button onClick={() => removeTimeLog(index)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#d6d3d1", fontSize: "22px", padding: "4px 8px", transition: "all 0.2s", borderRadius: "8px" }}
                        onMouseEnter={(e) => { e.target.style.color = "#78716c"; e.target.style.backgroundColor = "#e7e5e4"; }}
                        onMouseLeave={(e) => { e.target.style.color = "#d6d3d1"; e.target.style.backgroundColor = "transparent"; }}
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Work Sessions */}
          {stats.segments.filter((s) => s.type === "work").length > 0 && (
            <div style={cardBase}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "24px", paddingBottom: "16px", borderBottom: "2px solid #e7e5e4" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "14px", backgroundColor: "#78716c", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "16px" }}>
                  <span style={{ fontSize: "28px" }}>📊</span>
                </div>
                <div>
                  <h2 style={{ fontSize: "22px", fontWeight: "700", margin: "0 0 4px 0", color: "#1c1917" }}>Work Sessions</h2>
                  <p style={{ margin: 0, fontSize: "14px", color: "#78716c" }}>{stats.segments.filter((s) => s.type === "work").length} {stats.segments.filter((s) => s.type === "work").length === 1 ? "session" : "sessions"} completed</p>
                </div>
              </div>
              <div style={{ display: "grid", gap: "14px", maxHeight: "420px", overflowY: "auto", paddingRight: "8px" }}>
                {stats.segments.filter((s) => s.type === "work").map((segment, index) => (
                  <div key={index} style={{ padding: "20px 24px", borderRadius: "14px", backgroundColor: "#ffffff", border: "2px solid #e7e5e4", transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.borderColor = "#a8a29e"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "#e7e5e4"; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#78716c", color: "#fafaf9", padding: "6px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "700" }}>Session {index + 1}</div>
                      <div style={{ fontSize: "24px", fontWeight: "800", color: "#44403c" }}>{formatHours(segment.hours)}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#57534e", fontFamily: "monospace", fontSize: "16px", fontWeight: "600" }}>
                      <span style={{ padding: "8px 14px", backgroundColor: "#f5f5f4", borderRadius: "8px", border: "1px solid #e7e5e4" }}>{segment.start}</span>
                      <span style={{ fontSize: "20px", color: "#a8a29e" }}>→</span>
                      <span style={{ padding: "8px 14px", backgroundColor: "#f5f5f4", borderRadius: "8px", border: "1px solid #e7e5e4" }}>{segment.end}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
              <Footer />

      </div>
    </div>
  );
}

export default App;