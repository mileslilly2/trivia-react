// TriviaSettings.js
import React, { useState } from "react";
import './TriviaSettings.css';

// Sample category list (IDs from https://opentdb.com/api_category.php)
const CATEGORIES = [
  { id: "any", name: "Any Category" },
  { id: 9, name: "General Knowledge" },
  { id: 10, name: "Books" },
  { id: 11, name: "Film" },
  { id: 12, name: "Music" },
  { id: 13, name: "Musicals & Theatres" },
  { id: 14, name: "Television" },
  { id: 15, name: "Video Games" },
  { id: 16, name: "Board Games" },
  { id: 17, name: "Science & Nature" },
  { id: 18, name: "Computers" },
  { id: 19, name: "Mathematics" },
  { id: 20, name: "Mythology" },
  { id: 21, name: "Sports" },
  { id: 22, name: "Geography" },
  { id: 23, name: "History" },
  { id: 24, name: "Politics" },
  { id: 25, name: "Art" },
  { id: 26, name: "Celebrities" },
  { id: 27, name: "Animals" },
  { id: 28, name: "Vehicles" },
  { id: 29, name: "Comics" },
  { id: 30, name: "Gadgets" },
  { id: 31, name: "Japanese Anime & Manga" },
  { id: 32, name: "Cartoon & Animations" },
];

const DIFFICULTIES = ["any", "easy", "medium", "hard"];
const TYPES = ["any", "multiple", "boolean"];
const ENCODINGS = [
  { value: "default", label: "Default Encoding" },
  { value: "urlLegacy", label: "Legacy URL Encoding" },
  { value: "url3986", label: "URL Encoding (RFC 3986)" },
  { value: "base64", label: "Base64 Encoding" },
];

export default function TriviaSettings(props) {
  const [amount, setAmount] = useState(10);
  const [category, setCategory] = useState("any");
  const [difficulty, setDifficulty] = useState("any");
  const [type, setType] = useState("any");
  const [encoding, setEncoding] = useState("default");

  const [questions, setQuestions] = useState([]);

  

  // Build the API URL based on user choices
  const buildApiUrl = () => {
    let url = "https://opentdb.com/api.php?";
    url += `amount=${amount}`;

    if (category !== "any") {
      url += `&category=${category}`;
    }
    if (difficulty !== "any") {
      url += `&difficulty=${difficulty}`;
    }
    if (type !== "any") {
      url += `&type=${type}`;
    }
    if (encoding !== "default") {
      url += `&encode=${encoding}`;
    }

    return url;
  };

  // Fetch questions from Open Trivia DB
  const handleFetch = async () => {
    const url = buildApiUrl();
    console.log("Fetching from:", url);

    const response = await fetch(url);
    const data = await response.json();
    console.log("API response:", data);

    if (data.response_code === 0) {
      setQuestions(data.results);
    } else {
      alert(`API Error: response_code = ${data.response_code}`);
      setQuestions([]);
    }
  };

  return (
    <div class="settings-container" style={{ margin: "2rem" }}>
      <h2>Trivia API Settings</h2>

      {/* Number of Questions */}
      <label>
        Number of Questions:
        <input
          type="number"
          min="1"
          max="50"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        />
      </label>

      <br /><br />

      {/* Category */}
      <label>
        Select Category:
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </label>

      <br /><br />

      {/* Difficulty */}
      <label>
        Select Difficulty:
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        >
          {DIFFICULTIES.map((diff) => (
            <option key={diff} value={diff}>
              {diff}
            </option>
          ))}
        </select>
      </label>

      <br /><br />

      {/* Type */}
      <label>
        Select Type:
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <br /><br />

      {/* Encoding */}
      <label>
        Select Encoding:
        <select
          value={encoding}
          onChange={(e) => setEncoding(e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        >
          {ENCODINGS.map((enc) => (
            <option key={enc.value} value={enc.value}>
              {enc.label}
            </option>
          ))}
        </select>
      </label>

      <br /><br />

      {/* Fetch Button */}
      <button onClick={handleFetch}>Fetch Questions</button>

      <hr />

      <h3>Fetched Questions:</h3>
      {questions.length === 0 && <p>No questions yet.</p>}

      {questions.length > 0 && (
        <ul>
          {questions.map((q, i) => (
            <li key={i}>
              <strong dangerouslySetInnerHTML={{ __html: q.question }} />
              <br />
              <em>Correct answer:</em>{" "}
              <span dangerouslySetInnerHTML={{ __html: q.correct_answer }} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
