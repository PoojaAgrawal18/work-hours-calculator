import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const links = [
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Privacy Policy", to: "/privacy-policy" },
  ];

  return (
    <div
      style={{
        marginTop: "40px",
        padding: "32px",
        textAlign: "center",
        backgroundColor: "#fafaf9",
        borderRadius: "24px",
        border: "1px solid #e7e5e4",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "24px",
          flexWrap: "wrap",
          marginBottom: "16px",
        }}
      >
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              color: "#57534e",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
              padding: "8px 16px",
              borderRadius: "8px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#e7e5e4";
              e.target.style.color = "#1c1917";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#57534e";
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <p
        style={{
          margin: 0,
          color: "#a8a29e",
          fontSize: "13px",
        }}
      >
        © 2026 Time Logger. All rights reserved. Built with ❤️ for productivity
        tracking
      </p>
    </div>
  );
}

export default Footer;
