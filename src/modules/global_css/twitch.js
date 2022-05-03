import {SettingIds} from '../../constants.js';
import settings from '../../settings.js';
import twitch from '../../utils/twitch.js';

const TWITCH_THEME_CHANGED_DISPATCH_TYPE = 'core.ui.THEME_CHANGED';
const TWITCH_THEME_STORAGE_KEY = 'twilight.theme';
const TwitchThemes = {
  LIGHT: 0,
  DARK: 1,
};

let connectStore;

function setTwitchTheme(value) {
  if (!connectStore) return;

  const theme = value === true ? TwitchThemes.DARK : TwitchThemes.LIGHT;
  try {
    localStorage.setItem(TWITCH_THEME_STORAGE_KEY, JSON.stringify(theme));
  } catch (_) {}
  connectStore.dispatch({
    type: TWITCH_THEME_CHANGED_DISPATCH_TYPE,
    theme,
  });
}

settings.on(`changed.${SettingIds.DARKENED_MODE}`, (value, temporary) => {
  if (temporary) return;
  setTwitchTheme(value);
});

function systemMatchTwitchTheme() {
  // Will only match the system theme if the browser is also configured to match the system theme
  if (!connectStore) return;

  const twitchIsDarkMode = connectStore.getState().ui.theme === TwitchThemes.DARK;
  const systemIsDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (systemIsDarkMode ^ twitchIsDarkMode) {
    setTwitchTheme(!twitchIsDarkMode);
  }
}

settings.on(`changed.${SettingIds.AUTO_THEME_MODE}`, (value, temporary) => {
  if (temporary) return;
  if (value) systemMatchTwitchTheme();
});

(() => {
  connectStore = twitch.getConnectStore();
  if (!connectStore) return;

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (settings.get(SettingIds.AUTO_THEME_MODE)) systemMatchTwitchTheme();
  });

  if (settings.get(SettingIds.AUTO_THEME_MODE)) {
    systemMatchTwitchTheme();
  }

  connectStore.subscribe(() => {
    const isDarkMode = connectStore.getState().ui.theme === TwitchThemes.DARK;
    if (settings.get(SettingIds.DARKENED_MODE) === isDarkMode) {
      return;
    }

    settings.set(SettingIds.DARKENED_MODE, isDarkMode, true);
  });
})();
