import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./components/Footer.jsx";

// Helper function to parse time string to Date object
const parseTime = (timeStr) => {
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, seconds, 0);
  return date;
};

// Helper function to calculate time difference in hours
const getTimeDifference = (startTime, endTime) => {
  const diffMs = endTime - startTime;
  return diffMs / (1000 * 60 * 60); // Convert ms to hours
};

// Helper function to format hours as "Xh Ym"
const formatHours = (hours) => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
};

// Helper function to get fun break warning messages with variety
const getBreakWarning = (breakHours) => {
  const shortBreakMessages = [
    "Nice quick break! Back to work like a ninja 🥷",
    "Efficient break! You're in and out faster than a cat burglar 🐱‍👤",
    "Speed break champion! Did you even have time to blink? 👁️",
    "Lightning fast refreshment! Your keyboard barely had time to miss you ⚡",
    "Quick recharge complete! Your productivity battery is at 100% 🔋",
  ];

  const mediumBreakMessages = [
    "Hmm, that's a looong coffee break. Did you fall into the coffee machine? ☕",
    "Is that a break or a mini-vacation? Your desk is filing abandonment issues 🗄️",
    "Your chair called and asked if you two broke up 💔",
    "That's not a coffee break, that's a coffee relationship 💍☕",
    "Your mouse started getting separation anxiety during that break 🐭",
  ];

  const longBreakMessages = [
    "WHOA! That's not a break, that's a vacation! Did you go to Hawaii? 🏝️",
    "Welcome back from your expedition! Did you discover any new species? 🧪",
    "Break so long your computer had to check if you still work here 🖥️",
    "Your break was so long, your desk plants evolved 🌱➡️🌴",
    "Did you just hibernate? Bears take shorter breaks than that 🐻",
  ];

  const randomIndex = Math.floor(Math.random() * 5);

  if (breakHours < 1) {
    return {
      text: shortBreakMessages[randomIndex],
      level: "info",
      color: "#a3a3a3",
    };
  } else if (breakHours < 2) {
    return {
      text: mediumBreakMessages[randomIndex],
      level: "warning",
      color: "#78716c",
    };
  } else {
    return {
      text: longBreakMessages[randomIndex],
      level: "danger",
      color: "#57534e",
    };
  }
};

function App() {
  const [timeInput, setTimeInput] = useState("");
  const [timeLogs, setTimeLogs] = useState([]);
  const [error, setError] = useState("");

  const addTimeLogs = () => {
    setError("");
    const timeEntries = timeInput.trim().split(/\s+/);
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    const invalidEntries = timeEntries.filter(
      (entry) => !timeRegex.test(entry),
    );

    if (invalidEntries.length > 0) {
      setError(
        `Invalid time format: ${invalidEntries.join(", ")}. Please use HH:MM:SS format.`,
      );
      return;
    }

    setTimeLogs([...timeLogs, ...timeEntries]);
    setTimeInput("");
  };

  const removeTimeLog = (index) => {
    const newLogs = [...timeLogs];
    newLogs.splice(index, 1);
    setTimeLogs(newLogs);
  };

  const clearAllLogs = () => {
    setTimeLogs([]);
  };

  const calculateStats = () => {
    if (timeLogs.length < 2) {
      return {
        totalHours: 0,
        breakHours: 0,
        totalWithBreaks: 0,
        segments: [],
        breakWarnings: [],
      };
    }

    const sortedLogs = [...timeLogs].sort((a, b) => {
      return parseTime(a) - parseTime(b);
    });

    let totalWorkHours = 0;
    let totalBreakHours = 0;
    const segments = [];
    const breakWarnings = [];

    for (let i = 0; i < sortedLogs.length - 1; i += 2) {
      const startTime = parseTime(sortedLogs[i]);
      const endTime = parseTime(sortedLogs[i + 1] || sortedLogs[i]);

      const workHours = getTimeDifference(startTime, endTime);
      totalWorkHours += workHours;

      segments.push({
        start: sortedLogs[i],
        end: sortedLogs[i + 1] || sortedLogs[i],
        hours: workHours,
        type: "work",
      });

      if (i + 2 < sortedLogs.length) {
        const breakStartTime = endTime;
        const breakEndTime = parseTime(sortedLogs[i + 2]);

        const breakHours = getTimeDifference(breakStartTime, breakEndTime);
        totalBreakHours += breakHours;

        const breakSegment = {
          start: sortedLogs[i + 1],
          end: sortedLogs[i + 2],
          hours: breakHours,
          type: "break",
        };

        segments.push(breakSegment);

        if (breakHours >= 1) {
          const warning = getBreakWarning(breakHours);
          breakWarnings.push({
            ...warning,
            segment: breakSegment,
          });
        }
      }
    }

    const totalWithBreaks = totalWorkHours + totalBreakHours;

    return {
      totalHours: totalWorkHours,
      breakHours: totalBreakHours,
      totalWithBreaks: totalWithBreaks,
      segments,
      breakWarnings,
    };
  };

  const stats = calculateStats();

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTimeLogs();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f4",
        padding: "40px 20px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "800",
              color: "#1c1917",
              margin: "0 0 12px 0",
            }}
          >
            Time Logger
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#57534e",
              margin: 0,
              maxWidth: "1000px",
              marginInline: "auto",
            }}
          >
            <strong>What is a Work Hours Calculator?</strong>
            <br />
            <br />
            A Work Hours Calculator helps you track total working time, break
            duration, and net productivity throughout the day. By simply
            entering timestamps, you can instantly calculate your work sessions
            without manual effort.
            <br />
            <br />
            It is useful for employees to improve time management, ensure
            accuracy, and maintain better work-life balance.
          </p>
          <div style={{ marginTop: "20px" }}>
            <Link
              to="/work-hours-guide"
              style={{
                display: "inline-block",
                backgroundColor: "#57534e",
                color: "#fafaf9",
                textDecoration: "none",
                padding: "12px 20px",
                borderRadius: "12px",
                fontWeight: "600",
                border: "1px solid #44403c",
              }}
            >
              Read Complete Work Hours Guide
            </Link>
          </div>
          <p style={{ color: "#a8a29e", fontSize: "14px", marginTop: "10px" }}>
            Used by professionals to track accurate work hours and productivity
          </p>
        </div>
        <div
          style={{
            backgroundColor: "#fafaf9",
            borderRadius: "24px",
            padding: "24px 32px",
            marginBottom: "24px",
            border: "1px solid #e7e5e4",
          }}
        >
          <h3 style={{ marginBottom: "12px", color: "#1c1917" }}>
            📘 How to Use
          </h3>
          <p style={{ margin: 0, color: "#57534e", lineHeight: "1.6" }}>
            1. Just copy and paste your start and end times in the input box
            (e.g., 09:00:00 17:30:00) <br />
            2. Click "Add Logs" <br />
            3. Instantly view working hours, break time, and total time
          </p>
        </div>
        {/* Input Section */}
        <div
          style={{
            backgroundColor: "#fafaf9",
            borderRadius: "24px",
            padding: "32px",
            marginBottom: "24px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e7e5e4",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginBottom: "12px",
            }}
          >
            <textarea
              style={{
                flex: 1,
                padding: "16px 20px",
                border: error ? "2px solid #78716c" : "2px solid #e7e5e4",
                borderRadius: "16px",
                fontSize: "16px",
                minHeight: "100px",
                resize: "vertical",
                fontFamily: "inherit",
                transition: "border-color 0.2s",
                outline: "none",
                backgroundColor: "#ffffff",
              }}
              placeholder="Enter times in HH:MM:SS format (e.g., 09:00:00 17:30:00)"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={(e) => {
                if (!error) e.target.style.borderColor = "#57534e";
              }}
              onBlur={(e) => {
                if (!error) e.target.style.borderColor = "#e7e5e4";
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <button
                onClick={addTimeLogs}
                style={{
                  backgroundColor: "#57534e",
                  color: "#fafaf9",
                  border: "none",
                  borderRadius: "16px",
                  padding: "16px 32px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#44403c";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#57534e";
                }}
              >
                Add Logs
              </button>
              <button
                onClick={clearAllLogs}
                style={{
                  backgroundColor: "#e7e5e4",
                  color: "#44403c",
                  border: "none",
                  borderRadius: "16px",
                  padding: "16px 32px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#d6d3d1")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#e7e5e4")
                }
              >
                Clear All
              </button>
            </div>
          </div>
          {error && (
            <p
              style={{
                color: "#78716c",
                margin: "8px 0 0 0",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              ⚠️ {error}
            </p>
          )}
          <p
            style={{
              color: "#a8a29e",
              margin: "8px 0 0 0",
              fontSize: "14px",
            }}
          >
            💡 Paste multiple timestamps separated by spaces
          </p>
        </div>

        {/* Break Warnings */}
        {stats.breakWarnings.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            {stats.breakWarnings.map((warning, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#fafaf9",
                  borderRadius: "20px",
                  padding: "20px 24px",
                  marginBottom: "16px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  borderLeft: `6px solid ${warning.color}`,
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  border: "1px solid #e7e5e4",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: warning.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                  }}
                >
                  {warning.level === "info"
                    ? "⚡"
                    : warning.level === "warning"
                      ? "⏰"
                      : "🚨"}
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: "0 0 6px 0",
                      fontWeight: "700",
                      fontSize: "16px",
                      color: "#1c1917",
                    }}
                  >
                    Break: {warning.segment.start} → {warning.segment.end} (
                    {formatHours(warning.segment.hours)})
                  </p>
                  <p
                    style={{
                      margin: 0,
                      color: "#57534e",
                      fontSize: "15px",
                    }}
                  >
                    {warning.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistics Summary - Top Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          {/* Working Hours Card */}
          <div
            style={{
              backgroundColor: "#44403c",
              borderRadius: "20px",
              padding: "28px",
              color: "#fafaf9",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                fontSize: "40px",
                marginBottom: "8px",
              }}
            >
              💼
            </div>
            <p
              style={{
                color: "#d6d3d1",
                margin: "0 0 8px 0",
                fontSize: "14px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Working Hours
            </p>
            <p
              style={{
                fontSize: "42px",
                fontWeight: "800",
                margin: 0,
              }}
            >
              {formatHours(stats.totalHours)}
            </p>
          </div>

          {/* Break Time Card */}
          <div
            style={{
              backgroundColor: "#78716c",
              borderRadius: "20px",
              padding: "28px",
              color: "#fafaf9",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                fontSize: "40px",
                marginBottom: "8px",
              }}
            >
              ☕
            </div>
            <p
              style={{
                color: "#e7e5e4",
                margin: "0 0 8px 0",
                fontSize: "14px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Break Time
            </p>
            <p
              style={{
                fontSize: "42px",
                fontWeight: "800",
                margin: 0,
              }}
            >
              {formatHours(stats.breakHours)}
            </p>
          </div>

          {/* Total Time Card */}
          <div
            style={{
              backgroundColor: "#a8a29e",
              borderRadius: "20px",
              padding: "28px",
              color: "#fafaf9",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                fontSize: "40px",
                marginBottom: "8px",
              }}
            >
              ⏱️
            </div>
            <p
              style={{
                color: "#fafaf9",
                margin: "0 0 8px 0",
                fontSize: "14px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Total Time
            </p>
            <p
              style={{
                fontSize: "42px",
                fontWeight: "800",
                margin: 0,
              }}
            >
              {formatHours(stats.totalWithBreaks)}
            </p>
          </div>
        </div>

        {/* Main Content - Bottom Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              stats.segments.filter((s) => s.type === "work").length > 0
                ? "1fr 1fr"
                : "1fr",
            gap: "24px",
          }}
        >
          {/* Time Logs Card */}
          <div
            style={{
              backgroundColor: "#fafaf9",
              borderRadius: "24px",
              padding: "32px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e7e5e4",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "24px",
                paddingBottom: "16px",
                borderBottom: "2px solid #e7e5e4",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  backgroundColor: "#57534e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "16px",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fafaf9"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    margin: "0 0 4px 0",
                    color: "#1c1917",
                  }}
                >
                  Time Entries
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "#78716c",
                  }}
                >
                  {timeLogs.length}{" "}
                  {timeLogs.length === 1 ? "entry" : "entries"} recorded
                </p>
              </div>
            </div>

            <div
              style={{
                maxHeight: "420px",
                overflowY: "auto",
                paddingRight: "8px",
              }}
            >
              {timeLogs.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "80px 20px",
                    color: "#a8a29e",
                  }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      backgroundColor: "#e7e5e4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                      fontSize: "36px",
                    }}
                  >
                    ⏱️
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#78716c",
                    }}
                  >
                    Start by adding your first time entry
                  </p>
                  <p
                    style={{
                      margin: "8px 0 0 0",
                      fontSize: "14px",
                      color: "#a8a29e",
                    }}
                  >
                    Example: 09:00:00 13:00:00 14:00:00 18:00:00
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gap: "10px",
                  }}
                >
                  {timeLogs.map((log, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px 20px",
                        borderRadius: "14px",
                        backgroundColor: "#ffffff",
                        border: "2px solid #e7e5e4",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f5f5f4";
                        e.currentTarget.style.borderColor = "#a8a29e";
                        e.currentTarget.style.transform = "translateX(4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#ffffff";
                        e.currentTarget.style.borderColor = "#e7e5e4";
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: "#57534e",
                          }}
                        />
                        <span
                          style={{
                            fontWeight: "700",
                            fontSize: "18px",
                            color: "#1c1917",
                            fontFamily: "monospace",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {log}
                        </span>
                      </div>
                      <button
                        onClick={() => removeTimeLog(index)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#d6d3d1",
                          fontSize: "22px",
                          padding: "4px 8px",
                          transition: "all 0.2s",
                          borderRadius: "8px",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = "#78716c";
                          e.target.style.backgroundColor = "#e7e5e4";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "#d6d3d1";
                          e.target.style.backgroundColor = "transparent";
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Work Sessions Card */}
          {stats.segments.filter((s) => s.type === "work").length > 0 && (
            <div
              style={{
                backgroundColor: "#fafaf9",
                borderRadius: "24px",
                padding: "32px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e7e5e4",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "24px",
                  paddingBottom: "16px",
                  borderBottom: "2px solid #e7e5e4",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "14px",
                    backgroundColor: "#78716c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "16px",
                  }}
                >
                  <span style={{ fontSize: "28px" }}>📊</span>
                </div>
                <div>
                  <h2
                    style={{
                      fontSize: "22px",
                      fontWeight: "700",
                      margin: "0 0 4px 0",
                      color: "#1c1917",
                    }}
                  >
                    Work Sessions
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      color: "#78716c",
                    }}
                  >
                    {stats.segments.filter((s) => s.type === "work").length}{" "}
                    {stats.segments.filter((s) => s.type === "work").length ===
                    1
                      ? "session"
                      : "sessions"}{" "}
                    completed
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: "14px",
                  maxHeight: "420px",
                  overflowY: "auto",
                  paddingRight: "8px",
                }}
              >
                {stats.segments
                  .filter((s) => s.type === "work")
                  .map((segment, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "20px 24px",
                        borderRadius: "14px",
                        backgroundColor: "#ffffff",
                        border: "2px solid #e7e5e4",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.02)";
                        e.currentTarget.style.borderColor = "#a8a29e";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.borderColor = "#e7e5e4";
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "12px",
                        }}
                      >
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            backgroundColor: "#78716c",
                            color: "#fafaf9",
                            padding: "6px 14px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "700",
                          }}
                        >
                          Session {index + 1}
                        </div>
                        <div
                          style={{
                            fontSize: "24px",
                            fontWeight: "800",
                            color: "#44403c",
                          }}
                        >
                          {formatHours(segment.hours)}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          color: "#57534e",
                          fontFamily: "monospace",
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                      >
                        <span
                          style={{
                            padding: "8px 14px",
                            backgroundColor: "#f5f5f4",
                            borderRadius: "8px",
                            border: "1px solid #e7e5e4",
                          }}
                        >
                          {segment.start}
                        </span>
                        <span style={{ fontSize: "20px", color: "#a8a29e" }}>
                          →
                        </span>
                        <span
                          style={{
                            padding: "8px 14px",
                            backgroundColor: "#f5f5f4",
                            borderRadius: "8px",
                            border: "1px solid #e7e5e4",
                          }}
                        >
                          {segment.end}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* IMPROVED FEATURES + USE CASES */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "24px",
            padding: "2px",
            paddingTop: "30px",
          }}
        >
          {/* Features Card */}
          <div
            style={{
              backgroundColor: "#fafaf9",
              borderRadius: "24px",
              padding: "32px",
              border: "1px solid #e7e5e4",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "24px",
                paddingBottom: "16px",
                borderBottom: "2px solid #e7e5e4",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  backgroundColor: "#57534e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "16px",
                  fontSize: "28px",
                }}
              >
                ⭐
              </div>
              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  margin: 0,
                  color: "#1c1917",
                }}
              >
                Features
              </h3>
            </div>
            <div style={{ display: "grid", gap: "16px" }}>
              {[
                { icon: "✔️", text: "Easy tracking" },
                { icon: "✔️", text: "Accurate calculation" },
                { icon: "✔️", text: "Instant results" },
                { icon: "✔️", text: "Free to use" },
              ].map((feature, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "2px solid #e7e5e4",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateX(4px)";
                    e.currentTarget.style.borderColor = "#a8a29e";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateX(0)";
                    e.currentTarget.style.borderColor = "#e7e5e4";
                  }}
                >
                  <span style={{ fontSize: "20px" }}>{feature.icon}</span>
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#1c1917",
                    }}
                  >
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Use Cases Card */}
          <div
            style={{
              backgroundColor: "#fafaf9",
              borderRadius: "24px",
              padding: "32px",
              border: "1px solid #e7e5e4",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "24px",
                paddingBottom: "16px",
                borderBottom: "2px solid #e7e5e4",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  backgroundColor: "#78716c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "16px",
                  fontSize: "28px",
                }}
              >
                👥
              </div>
              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  margin: 0,
                  color: "#1c1917",
                }}
              >
                Use Cases
              </h3>
            </div>
            <div style={{ display: "grid", gap: "16px" }}>
              {[
                { icon: "👨‍💼", text: "Employees", desc: "Track daily hours" },
                { icon: "🏢", text: "HR Teams", desc: "Monitor attendance" },
                {
                  icon: "📊",
                  text: "Managers",
                  desc: "Optimize workflows",
                },
              ].map((useCase, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "2px solid #e7e5e4",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateX(4px)";
                    e.currentTarget.style.borderColor = "#a8a29e";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateX(0)";
                    e.currentTarget.style.borderColor = "#e7e5e4";
                  }}
                >
                  <span style={{ fontSize: "24px" }}>{useCase.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#1c1917",
                      }}
                    >
                      {useCase.text}
                    </div>
                    <div style={{ fontSize: "13px", color: "#78716c" }}>
                      {useCase.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* IMPROVED WHY TRACKING IS IMPORTANT */}
        <div
          style={{
            backgroundColor: "#fafaf9",
            borderRadius: "24px",
            padding: "32px",
            marginTop: "40px",
            border: "1px solid #e7e5e4",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "24px",
              paddingBottom: "16px",
              borderBottom: "2px solid #e7e5e4",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                backgroundColor: "#57534e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "16px",
                fontSize: "28px",
              }}
            >
              📊
            </div>
            <h3
              style={{
                fontSize: "22px",
                fontWeight: "700",
                margin: 0,
                color: "#1c1917",
              }}
            >
              Why Tracking Work Hours is Important
            </h3>
          </div>
          <div
            style={{
              display: "grid",
              gap: "20px",
              color: "#57534e",
              lineHeight: "1.7",
            }}
          >
            <div
              style={{
                padding: "20px",
                backgroundColor: "#ffffff",
                borderRadius: "14px",
                border: "2px solid #e7e5e4",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "start",
                  gap: "12px",
                }}
              >
                <span style={{ fontSize: "24px", marginTop: "2px" }}>📈</span>
                <div>
                  <strong style={{ color: "#1c1917", fontSize: "16px" }}>
                    Boost Productivity
                  </strong>
                  <p style={{ margin: "8px 0 0 0", fontSize: "15px" }}>
                    Tracking work hours helps improve productivity and time
                    management by giving clear visibility into how your time is
                    spent throughout the day. It allows individuals to identify
                    distractions, reduce wasted time, and focus more on
                    high-priority tasks. When you consistently track your time,
                    you develop better discipline and awareness, which leads to
                    improved efficiency and better daily planning.
                  </p>
                </div>
              </div>
            </div>
            <div
              style={{
                padding: "20px",
                backgroundColor: "#ffffff",
                borderRadius: "14px",
                border: "2px solid #e7e5e4",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "start",
                  gap: "12px",
                }}
              >
                <span style={{ fontSize: "24px", marginTop: "2px" }}>✅</span>
                <div>
                  <strong style={{ color: "#1c1917", fontSize: "16px" }}>
                    Accurate Calculations
                  </strong>
                  <p style={{ margin: "8px 0 0 0", fontSize: "15px" }}>
                    It ensures accurate calculations of work and break time,
                    reducing manual errors that often occur when tracking time
                    manually. This is especially useful for freelancers, remote
                    workers, and employees who rely on precise time records for
                    billing or reporting. Accurate tracking also builds trust
                    and transparency, especially when sharing work logs with
                    clients or managers.
                  </p>
                </div>
              </div>
            </div>
            <div
              style={{
                padding: "20px",
                backgroundColor: "#ffffff",
                borderRadius: "14px",
                border: "2px solid #e7e5e4",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "start",
                  gap: "12px",
                }}
              >
                <span style={{ fontSize: "24px", marginTop: "2px" }}>🏢</span>
                <div>
                  <strong style={{ color: "#1c1917", fontSize: "16px" }}>
                    Optimize Workflows
                  </strong>
                  <p style={{ margin: "8px 0 0 0", fontSize: "15px" }}>
                    Organizations can use time tracking data to optimize
                    workflows, balance workloads, and improve overall
                    efficiency. It helps managers understand how time is
                    distributed across tasks and identify areas where
                    improvements can be made. This leads to better
                    decision-making, improved team productivity, and a healthier
                    work environment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* IMPROVED FAQ */}
        <div
          style={{
            backgroundColor: "#fafaf9",
            borderRadius: "24px",
            padding: "32px",
            marginTop: "24px",
            border: "1px solid #e7e5e4",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "24px",
              paddingBottom: "16px",
              borderBottom: "2px solid #e7e5e4",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                backgroundColor: "#78716c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "16px",
                fontSize: "28px",
              }}
            >
              ❓
            </div>
            <h3
              style={{
                fontSize: "22px",
                fontWeight: "700",
                margin: 0,
                color: "#1c1917",
              }}
            >
              Frequently Asked Questions
            </h3>
          </div>
          <div style={{ display: "grid", gap: "16px" }}>
            {[
              {
                q: "What format should I use?",
                a: "Use the HH:MM:SS format (e.g., 09:00:00 for 9 AM). You can paste multiple timestamps separated by spaces.",
              },
              {
                q: "Is this tool free?",
                a: "Yes, completely free to use with no hidden costs or registration required.",
              },
              {
                q: "Can I track breaks?",
                a: "Yes! The tool automatically calculates break time between work sessions and provides fun warnings for long breaks.",
              },
              {
                q: "How accurate is the calculation?",
                a: "The calculator provides precise time calculations down to the minute, ensuring accurate tracking of your work hours.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                style={{
                  padding: "20px",
                  backgroundColor: "#ffffff",
                  borderRadius: "14px",
                  border: "2px solid #e7e5e4",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#a8a29e";
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e7e5e4";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <strong
                  style={{
                    color: "#1c1917",
                    fontSize: "16px",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Q: {faq.q}
                </strong>
                <p
                  style={{
                    margin: 0,
                    color: "#57534e",
                    fontSize: "15px",
                    lineHeight: "1.6",
                  }}
                >
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
