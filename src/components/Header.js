import { useState, useContext } from "react";
import { SettingsContext } from "./hooks/settingsContext";
import { AiOutlineSetting } from "react-icons/ai";
import Modal from "./Modal";
import styles from "./modules/Header.module.css";
import TimerDisplay from "./TimerDisplay";
import { PICTURES } from "../CONSTS";

function Header({ secondsElapsed, startNewGame }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { settings, setSettings } = useContext(SettingsContext);
  const [puzzleType, setPuzzleType] = useState(settings.puzzleType);
  const [picture, setPicture] = useState(settings.picture);
  const [showNums, setShowNums] = useState(settings.showNums);

  function onSettingsBtnClick() {
    setPuzzleType(settings.puzzleType);
    setPicture(settings.picture);
    setShowNums(settings.showNums);

    setSettingsOpen(true);
  }

  function onCancelBtnClick() {
    setPuzzleType(settings.puzzleType);
    setPicture(settings.picture);
    setSettingsOpen(false);
  }

  function onFormSubmint(e) {
    e.preventDefault();

    setSettings({
      puzzleType,
      picture,
      showNums,
    });
    setSettingsOpen(false);
    startNewGame();
  }

  return (
    <>
      <header className={styles.header}>
        <span className={styles.title}>Slider</span>
        <TimerDisplay secondsElapsed={secondsElapsed} />
        <div className={styles.settingBtn} onClick={onSettingsBtnClick}>
          <AiOutlineSetting />
        </div>
      </header>
      {settingsOpen && (
        <Modal>
          <div className={styles.settingsForm}>
            <h1>Settings</h1>
            <form onSubmit={(e) => onFormSubmint(e)}>
              <label>Type: </label>
              <select
                value={puzzleType}
                onChange={(e) => setPuzzleType(e.target.value)}
              >
                <option value="3">3 x 3</option>
                <option value="4">4 x 4</option>
                <option value="5">5 x 5</option>
                <option value="6">6 x 6</option>
                <option value="7">7 x 7</option>
                <option value="8">8 x 8</option>
              </select>
              <label>Picture: </label>
              <select
                value={picture}
                onChange={(e) => setPicture(e.target.value)}
              >
                {PICTURES.map((pic, idx) => (
                  <option key={idx} value={pic}>
                    {pic}
                  </option>
                ))}
              </select>
              <div className={styles.checkboxContainer}>
                <label>
                  <input
                    type="checkbox"
                    checked={showNums}
                    onChange={() => setShowNums(!showNums)}
                  />
                  Show Numbers{" "}
                </label>
              </div>
              <div>
                <button>submit</button>
                <button onClick={onCancelBtnClick}>cancel</button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
}

export default Header;
