import React from "react";
import { Link } from "react-router-dom";
import Footer from "./components/Footer.jsx";

const sectionStyle = {
  backgroundColor: "#fafaf9",
  borderRadius: "24px",
  padding: "28px 32px",
  border: "1px solid #e7e5e4",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  marginBottom: "20px",
};

function WorkHoursGuide() {
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
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <h1
            style={{
              fontSize: "46px",
              fontWeight: "800",
              color: "#1c1917",
              margin: "0 0 12px 0",
            }}
          >
            Complete Guide to Work Hours Calculation
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "#57534e",
              margin: 0,
              lineHeight: "1.7",
              maxWidth: "900px",
              marginInline: "auto",
            }}
          >
            Understand the basics of time tracking, avoid common mistakes, and
            learn how to calculate working hours correctly.
          </p>
          <div style={{ marginTop: "18px" }}>
            <Link
              to="/"
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
              Back to Calculator
            </Link>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0, color: "#1c1917" }}>
            1. Introduction (What is work hour tracking)
          </h2>
          <p style={{ margin: 0, color: "#57534e", lineHeight: "1.7" }}>
            Work hour tracking is the process of recording when work starts,
            when it ends, and how much break time occurs in between. It helps
            individuals and teams understand where time is being spent and
            provides a reliable record of productive hours.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0, color: "#1c1917" }}>
            2. Why tracking work hours is important
          </h2>
          <p style={{ margin: 0, color: "#57534e", lineHeight: "1.7" }}>
            Tracking work time improves accountability, supports accurate payroll and invoicing, and gives visibility into daily efficiency. It also helps identify overwork, missed breaks, and patterns that affect performance.

By consistently tracking hours, individuals and teams can make better decisions, improve productivity, and maintain a healthier work-life balance.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0, color: "#1c1917" }}>
            3. How to calculate work hours manually
          </h2>
          <p style={{ margin: "0 0 10px 0", color: "#57534e", lineHeight: "1.7" }}>
            Manual calculation usually follows these steps:
          </p>
          <ol style={{ margin: 0, color: "#57534e", lineHeight: "1.8", paddingLeft: "20px" }}>
            <li>Write down start time and end time for each work session.</li>
            <li>Subtract start from end to get session duration.</li>
            <li>Add all session durations together.</li>
            <li>Subtract total break time from the full duration if needed.</li>
          </ol>
        </div>

        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0, color: "#1c1917" }}>
            4. Common mistakes in time tracking
          </h2>
          <ul style={{ margin: 0, color: "#57534e", lineHeight: "1.8", paddingLeft: "20px" }}>
            <li>Forgetting to log break start and end times.</li>
            <li>Entering inconsistent time formats.</li>
            <li>Recording times late and relying on memory.</li>
            <li>Missing short work sessions that still count.</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0, color: "#1c1917" }}>
            5. Benefits of using a work hours calculator
          </h2>
          <p style={{ margin: 0, color: "#57534e", lineHeight: "1.7" }}>
            A calculator removes manual math errors, gives instant totals for
            work and breaks, and saves time. It helps users make better
            day-to-day decisions using accurate data rather than guesswork.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0, color: "#1c1917" }}>
            6. Who should use it (employees, HR)
          </h2>
          <p style={{ margin: 0, color: "#57534e", lineHeight: "1.7" }}>
            Employees can track attendance and productivity and HR teams can review working patterns
            and improve workforce planning.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0, color: "#1c1917" }}>
            7. Tips for better productivity tracking
          </h2>
          <ul style={{ margin: 0, color: "#57534e", lineHeight: "1.8", paddingLeft: "20px" }}>
            <li>Log time in real-time instead of end-of-day updates.</li>
            <li>Use consistent time format like HH:MM:SS.</li>
            <li>Track breaks honestly to get realistic productivity data.</li>
            <li>Review weekly totals to spot patterns and improve planning.</li>
          </ul>
        </div>

        <div style={{ ...sectionStyle, marginBottom: 0 }}>
          <h2 style={{ marginTop: 0, color: "#1c1917" }}>8. Conclusion</h2>
          <p style={{ margin: 0, color: "#57534e", lineHeight: "1.7" }}>
            Work hour tracking is a practical habit that improves time
            awareness, productivity, and reporting accuracy. With the right
            process or tool, calculating work hours becomes simple and reliable
            for everyone.
          </p>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default WorkHoursGuide;
