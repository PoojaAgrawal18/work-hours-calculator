import React from "react";
import { Link } from "react-router-dom";
import Footer from "./components/Footer.jsx";

function Contact() {
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
        <div
          style={{
            backgroundColor: "#fafaf9",
            borderRadius: "24px",
            padding: "32px",
            border: "1px solid #e7e5e4",
          }}
        >
          <h1 style={{ marginTop: 0, color: "#1c1917" }}>Contact</h1>
          <p style={{ color: "#57534e", lineHeight: "1.7" }}>
            For support or feedback, please contact the team at
            timeloggersupport@gmail.com.
          </p>
          <Link
            to="/"
            style={{
              display: "inline-block",
              marginTop: "10px",
              backgroundColor: "#57534e",
              color: "#fafaf9",
              textDecoration: "none",
              padding: "10px 16px",
              borderRadius: "10px",
              fontWeight: "600",
            }}
          >
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Contact;
