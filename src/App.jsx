import "./index.css";
// import React from "react";
import SchemaBuilder from "./Components/SchemaBuilder";

function App() {
  return (
  <div className="builder-container">
  <div className="builder-card">
    <h2>JSON Schema Builder</h2>
    {/* Your Builder Components */}
    <SchemaBuilder />
  </div>
</div>

  );
}

export default App;