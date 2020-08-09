import React from 'react';
import './App.css';
import CodeList from "./CodeList";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Stadium Code Solver</h1>
      </header>
        <div className="Instructions">
          Instructions: Enter each code you find in a game into a text field below. Use "H" for the one that looks like a house,
            "N" for the one that looks like a nose", and "C" for the one that looks like a Chinese character.
        </div>
        <CodeList/>
        <footer>
            Thanks to <a href="https://www.twitch.tv/geekypastimes">GeekyPastimes</a> for publishing info on the codes. Drop him a like & subscribe.
        </footer>
    </div>
  );
}

export default App;
