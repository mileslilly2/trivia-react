import React, { useState } from "react";
import TriviaApp from "./TriviaApp";
import TriviaSettings from './TriviaSettings'


function App() {
  const [settings, setSettings] = useState(null); // ⬅️ settings live here

  return (
    <div className="App">
      {!settings ? (
        <TriviaSettings onSubmit={setSettings} />
      ) : (
        <TriviaApp settings={settings} />
      )}
    </div>
  );
}

export default App;
