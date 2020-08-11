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
          Instructions: To get the 8 digit code to the Stadium Easter Egg (which launches fireworks, and gives you a blueprint), enter each code you find in a game into a text field below. Longer description of where/how to get codes can be found <a href="https://www.youtube.com/watch?v=GGJGbwQ8rtU">in this video</a>. Use "H" for the one that looks like a house,
            "N" for the one that looks like a nose, and "C" for the one that looks like a Chinese character. For example, you can enter: 64NNH1NH and/or 6C2NH1NH.
        </div>
        <div className="Instructions">
            This calculator works with 1, 2 or 3 codes; the more you get, the less typing you'll have to do into the final pad. With one code, you'll have either 42 or 126 potential keys, 2 codes yields exactly 6 potentials, and 3 codes will solve it to 1. All of these are brute forceable in the general time limits of a plunder match, though typing all 126 can be frustrating, especially in an active warzone.
        </div>
        <CodeList/>
        <footer>
            Thanks to <a href="https://www.twitch.tv/geekypastimes">GeekyPastimes</a> for publishing info on the codes. Drop him a like & subscribe.
        </footer>
    </div>
  );
}

export default App;
