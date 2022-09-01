import './App.css';
import { SettingsContextProvider } from './components/hooks/settingsContext';
import TileGame from './components/TileGame';
import { useState } from 'react';

function App() {
  const [gameId, setGameId] = useState(1);
  
  return (
    <SettingsContextProvider>
      <div className="App">
        <TileGame key={gameId} startNewGame={() => setGameId(curr => curr + 1)} />
      </div>
    </SettingsContextProvider>
  );
}

export default App;
