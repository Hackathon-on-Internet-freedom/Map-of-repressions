import { createEffect, createEvent, createStore } from 'effector';

import { API_KEY, SPREADSHEET_ID } from '../../constants';

const onInit = createEvent();
const isInit = createStore(false)
  .on(onInit, state => true);

export const initFx = createEffect('init').use(async () => {
  if (isInit.getState()) {
    return;
  }

  await new Promise(resolve => (
    window.gapi.load('client', resolve)
  ));

  await window.gapi.client.init({
    apiKey: API_KEY,
    // Your API key will be automatically added to the Discovery Document URLs.
    discoveryDocs: [
      'https://sheets.googleapis.com/$discovery/rest?version=v4',
    ],
  });

  await new Promise(resolve => (
    window.gapi.client.load('sheets', 'v4', resolve)
  ));

  onInit();
});

export const getValuesFx = createEffect('get values').use(
  async params => {
    await initFx();

    try {
      const data = await window.gapi.client.sheets.spreadsheets.values
        .get({
          ...params,
          spreadsheetId: SPREADSHEET_ID,
        });

      return data.result.values;
    } catch (e) {
      console.log('Load error:', e);
    }
  });
