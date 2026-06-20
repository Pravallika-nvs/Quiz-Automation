import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [category, setCategory] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questionsPerDay, setQuestionsPerDay] = useState("");

  return (
    <div>
      <h1>Quiz Admin</h1>

      <input
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <br />

      <input
        placeholder="Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <br />

      <input
        placeholder="Difficulty"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      />

      <br />

      <input
        placeholder="Questions Per Day"
        value={questionsPerDay}
        onChange={(e) => setQuestionsPerDay(e.target.value)}
      />
    </div>
  );
}

export default App;