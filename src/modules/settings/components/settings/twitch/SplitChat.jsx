import React from 'react';
import Panel from 'rsuite/Panel';
import Toggle from 'rsuite/Toggle';
import {registerComponent} from '../../Store.jsx';
import {CategoryTypes, SettingIds} from '../../../../../constants.js';
import styles from '../../../styles/header.module.css';
import useStorageState from '../../../../../common/hooks/StorageState.jsx';

function SplitChat() {
  const [value, setValue] = useStorageState(SettingIds.SPLIT_CHAT);

  return (
    <Panel header="Split Chat">
      <div className={styles.settingRow}>
        <p className={styles.settingDescription}>
          Alternates backgrounds between messages in chat to improve readability
        </p>
        <Toggle checked={value} onChange={(state) => setValue(state)} />
      </div>
    </Panel>
  );
}

registerComponent(SplitChat, {
  settingId: SettingIds.SPLIT_CHAT,
  name: 'Split Chat',
  category: CategoryTypes.CHAT,
  keywords: ['split', 'chat'],
});
