import './App.css';
import { SettingsContextProvider } from './components/hooks/settingsContext';
import TileGame from './components/TileGame';

function App() {

  return (
    <SettingsContextProvider>
      <div className="App">
        <TileGame />
      </div>
    </SettingsContextProvider>
  );
}

export default App;
