import React from 'react';
import Panel from 'rsuite/lib/Panel/index.js';
import Toggle from 'rsuite/lib/Toggle/index.js';
import {registerComponent, useStorageState} from '../Store.jsx';
import {CategoryTypes, SettingIds} from '../../../../constants.js';
import styles from '../../styles/header.module.css';

function AutoTheme() {
  const [value, setValue] = useStorageState(SettingIds.AUTO_THEME_MODE);

  return (
    <Panel header="Auto Theme Mode">
      <div className={styles.toggle}>
        <p className={styles.description}>Automatically sets Twitch's theme to match the system's theme</p>
        <Toggle checked={value} onChange={(state) => setValue(state)} />
      </div>
    </Panel>
  );
}

export default registerComponent(AutoTheme, {
  settingId: SettingIds.AUTO_THEME_MODE,
  name: 'Auto Theme Mode',
  category: CategoryTypes.CHANNEL,
  keywords: ['dark', 'mode', 'light', 'theme', 'white', 'black', 'auto'],
});
