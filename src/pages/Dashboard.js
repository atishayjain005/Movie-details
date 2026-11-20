import React from "react";
import DashboardContent from "../components/DashboardContent/DashboardContent";

export default function Dashboard() {
  return (
    <main id="main-content" tabIndex="-1">
      <header className="container pt-4">
        <h1>Kannada movies</h1>
        <p>Movie browsing demo. Availability and details depend on the external provider. Votes are read-only.</p>
      </header>
      <DashboardContent />
    </main>
  );
}
