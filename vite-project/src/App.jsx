import React, { useState } from 'react';

// Helper function to parse time string to Date object
const parseTime = (timeStr) => {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
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
  // Array of varied messages for each break length category
  const shortBreakMessages = [
    "Nice quick break! Back to work like a ninja 🥷",
    "Efficient break! You're in and out faster than a cat burglar 🐱‍👤",
    "Speed break champion! Did you even have time to blink? 👁️",
    "Lightning fast refreshment! Your keyboard barely had time to miss you ⚡",
    "Quick recharge complete! Your productivity battery is at 100% 🔋"
  ];
  
  const mediumBreakMessages = [
    "Hmm, that's a looong coffee break. Did you fall into the coffee machine? ☕",
    "Is that a break or a mini-vacation? Your desk is filing abandonment issues 🗄️",
    "Your chair called and asked if you two broke up 💔",
    "That's not a coffee break, that's a coffee relationship 💍☕",
    "Your mouse started getting separation anxiety during that break 🐭"
  ];
  
  const longBreakMessages = [
    "WHOA! That's not a break, that's a vacation! Did you go to Hawaii? 🏝️",
    "Welcome back from your expedition! Did you discover any new species? 🧪",
    "Break so long your computer had to check if you still work here 🖥️",
    "Your break was so long, your desk plants evolved 🌱➡️🌴",
    "Did you just hibernate? Bears take shorter breaks than that 🐻"
  ];
  
  // Randomly select a message based on break duration
  const randomIndex = Math.floor(Math.random() * 5);
  
  if (breakHours < 1) {
    return {
      text: shortBreakMessages[randomIndex],
      level: "info",
      color: "#4ade80" // Green
    };
  } else if (breakHours < 2) {
    return {
      text: mediumBreakMessages[randomIndex],
      level: "warning",
      color: "#fbbf24" // Amber
    };
  } else {
    return {
      text: longBreakMessages[randomIndex],
      level: "danger",
      color: "#f87171" // Red
    };
  }
};

// Simple icon components
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

function App() {
  const [timeInput, setTimeInput] = useState('');
  const [timeLogs, setTimeLogs] = useState([]);
  const [error, setError] = useState('');
  
  // Parse and add multiple time logs
  const addTimeLogs = () => {
    // Clear previous errors
    setError('');
    
    // Split input by whitespace
    const timeEntries = timeInput.trim().split(/\s+/);
    
    // Validate all entries have the correct format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    const invalidEntries = timeEntries.filter(entry => !timeRegex.test(entry));
    
    if (invalidEntries.length > 0) {
      setError(`Invalid time format: ${invalidEntries.join(', ')}. Please use HH:MM:SS format.`);
      return;
    }
    
    // Add all valid entries to the time logs
    setTimeLogs([...timeLogs, ...timeEntries]);
    setTimeInput('');
  };
  
  // Remove time log
  const removeTimeLog = (index) => {
    const newLogs = [...timeLogs];
    newLogs.splice(index, 1);
    setTimeLogs(newLogs);
  };
  
  // Clear all logs
  const clearAllLogs = () => {
    setTimeLogs([]);
  };
  
  // Calculate statistics
  const calculateStats = () => {
    if (timeLogs.length < 2) {
      return { 
        totalHours: 0,
        breakHours: 0,
        totalWithBreaks: 0,
        segments: [],
        breakWarnings: []
      };
    }
    
    // Sort times
    const sortedLogs = [...timeLogs].sort((a, b) => {
      return parseTime(a) - parseTime(b);
    });
    
    let totalWorkHours = 0;
    let totalBreakHours = 0;
    const segments = [];
    const breakWarnings = [];
    
    // Calculate working and break segments
    for (let i = 0; i < sortedLogs.length - 1; i += 2) {
      const startTime = parseTime(sortedLogs[i]);
      const endTime = parseTime(sortedLogs[i + 1] || sortedLogs[i]);
      
      const workHours = getTimeDifference(startTime, endTime);
      totalWorkHours += workHours;
      
      segments.push({
        start: sortedLogs[i],
        end: sortedLogs[i + 1] || sortedLogs[i],
        hours: workHours,
        type: 'work'
      });
      
      // Calculate break time (if there's a next segment)
      if (i + 2 < sortedLogs.length) {
        const breakStartTime = endTime;
        const breakEndTime = parseTime(sortedLogs[i + 2]);
        
        const breakHours = getTimeDifference(breakStartTime, breakEndTime);
        totalBreakHours += breakHours;
        
        const breakSegment = {
          start: sortedLogs[i + 1],
          end: sortedLogs[i + 2],
          hours: breakHours,
          type: 'break'
        };
        
        segments.push(breakSegment);
        
        // Add warning if break is longer than 1 hour
        if (breakHours >= 1) {
          const warning = getBreakWarning(breakHours);
          breakWarnings.push({
            ...warning,
            segment: breakSegment
          });
        }
      }
    }
    
    // Calculate total hours including breaks
    const totalWithBreaks = totalWorkHours + totalBreakHours;
    
    // Calculate total hours (first to last timestamp)
    const firstTime = parseTime(sortedLogs[0]);
    const lastTime = parseTime(sortedLogs[sortedLogs.length - 1]);
    const totalHoursFromFirstToLast = getTimeDifference(firstTime, lastTime);
    
    return {
      totalHours: totalWorkHours,
      breakHours: totalBreakHours,
      totalWithBreaks: totalWithBreaks,
      totalHoursFromFirstToLast: totalHoursFromFirstToLast,
      segments,
      breakWarnings
    };
  };
  
  const stats = calculateStats();

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTimeLogs();
    }
  };
  
  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '32px 16px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative element */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '160px',
          height: '160px',
          borderRadius: '0 0 0 100%',
          background: 'linear-gradient(135deg, #f0f9ff 0%, #3b82f6 100%)',
          opacity: 0.1,
          zIndex: 0
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#2563eb', marginRight: '8px' }}>
              <ClockIcon />
            </span>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#2563eb',
              margin: 0
            }}>
              Office Time Logger
            </h1>
          </div>
          
          <p style={{ 
            color: '#4b5563', 
            marginBottom: '32px',
            marginTop: '8px'
          }}>
            Enter your time logs to calculate total working hours and breaks.
          </p>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <textarea
                  style={{
                    flexGrow: 1,
                    padding: '12px 16px',
                    border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                  placeholder="Paste multiple time logs (e.g., 12:00:26 18:42:40 19:39:58 21:09:52)"
                  value={timeInput}
                  onChange={(e) => setTimeInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={addTimeLogs}
                    style={{
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      fontWeight: '600',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    Add Logs
                  </button>
                  
                  <button
                    onClick={clearAllLogs}
                    style={{
                      backgroundColor: '#f3f4f6',
                      color: '#4b5563',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Clear All
                  </button>
                </div>
              </div>
              {error && (
                <p style={{ color: '#ef4444', margin: '4px 0 0 0', fontSize: '14px' }}>
                  {error}
                </p>
              )}
              <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '14px' }}>
                Tip: You can paste multiple time logs separated by spaces
              </p>
            </div>
          </div>
          
          {/* Break Warnings */}
          {stats.breakWarnings.length > 0 && (
            <div style={{
              marginBottom: '24px'
            }}>
              {stats.breakWarnings.map((warning, index) => (
                <div 
                  key={index}
                  style={{
                    backgroundColor: warning.color + '20', // Add transparency
                    border: `1px solid ${warning.color}`,
                    borderRadius: '8px',
                    padding: '12px 16px',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{ 
                    backgroundColor: warning.color, 
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <AlertIcon />
                  </div>
                  <div>
                    <p style={{ 
                      margin: '0 0 4px 0', 
                      fontWeight: '600',
                      color: warning.color === '#4ade80' ? '#15803d' : 
                             warning.color === '#fbbf24' ? '#92400e' : '#b91c1c'
                    }}>
                      Break from {warning.segment.start} to {warning.segment.end} ({formatHours(warning.segment.hours)})
                    </p>
                    <p style={{ margin: '0', color: '#4b5563' }}>
                      {warning.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {/* Time Logs Card */}
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{ marginRight: '8px', color: '#374151' }}>
                    <ClockIcon />
                  </span>
                  <h2 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    margin: 0
                  }}>
                    Time Logs ({timeLogs.length})
                  </h2>
                </div>
                
                {timeLogs.length > 1 && (
                  <button
                    onClick={() => setTimeLogs([])}
                    style={{
                      background: 'none',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      color: '#4b5563',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <TrashIcon /> Delete All
                  </button>
                )}
              </div>
              
              <div style={{
                maxHeight: '256px',
                overflowY: 'auto'
              }}>
                {timeLogs.length === 0 ? (
                  <p style={{
                    color: '#6b7280',
                    textAlign: 'center',
                    padding: '16px'
                  }}>
                    No time logs added yet
                  </p>
                ) : (
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {timeLogs.map((log, index) => (
                      <li
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          margin: '4px 0',
                          borderRadius: '6px',
                          backgroundColor: index % 2 === 0 ? '#f9fafb' : 'transparent'
                        }}
                      >
                        <span>{log}</span>
                        <button
                          onClick={() => removeTimeLog(index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#6b7280',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <TrashIcon />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            {/* Statistics Card */}
            <div style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              color: 'white',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <span style={{ marginRight: '8px' }}>
                  <ChartIcon />
                </span>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: 0
                }}>
                  Statistics
                </h2>
              </div>
              
              <div style={{ marginTop: '16px' }}>
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  margin: '0'
                }}>
                  Total Working Hours
                </p>
                <p style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: '4px 0 16px 0'
                }}>
                  {formatHours(stats.totalHours)}
                </p>
                
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  margin: '0'
                }}>
                  Total Break Hours
                </p>
                <p style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: '4px 0 16px 0'
                }}>
                  {formatHours(stats.breakHours)}
                </p>
                
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  margin: '0'
                }}>
                  Total Hours (Work + Breaks)
                </p>
                <p style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: '4px 0 16px 0'
                }}>
                  {formatHours(stats.totalWithBreaks)}
                </p>
                
                <div style={{
                  height: '1px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  margin: '16px 0'
                }}></div>
                
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  margin: '0'
                }}>
                  Work Sessions
                </p>
                {stats.segments.filter(s => s.type === 'work').map((segment, index) => (
                  <div key={index} style={{ marginTop: '8px' }}>
                    <p style={{ margin: '0', fontSize: '14px' }}>
                      {segment.start} - {segment.end} ({formatHours(segment.hours)})
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;