import { createEffect, createEvent, createStore } from 'effector';

import { API_KEY, MAP_ID_KEY, SPREADSHEET_ID } from '../../constants';

const onInit = createEvent();
const isInit = createStore(false)
  .on(onInit, state => true);

export const initFx = createEffect('init').use(async (apiKey) => {
  if (isInit.getState()) {
    return;
  }

  await new Promise(resolve => (
    window.gapi.load('client', resolve)
  ));

  await window.gapi.client.init({
    apiKey: apiKey,
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
    await initFx(API_KEY);

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

export const getMapValues = createEffect('get map values').use(
  async params => {
    await initFx(params.apiKey);

    try {
      const data = await window.gapi.client.sheets.spreadsheets.values
        .batchGet({
          spreadsheetId: params.spreadsheetId,
          ranges: params.ranges,
          majorDimension: params.majorDimension,
        });
      return data.result.valueRanges;
    } catch (e) {
      console.error('Load error:', e);
    }
  }
)

export const getDataFx = createEffect('get data').use(
  async params => {
    if (
      rawData.getState().length &&
      Object.keys(colorSchema.getState()).length &&
      Object.keys(mapSettings.getState()).length
    ) {
      return;
    }

    const [data] = await Promise.all([
      getValuesFx({
        range: 'LENTA!A2:J1038',
      }),
      getSettingsFx(),
    ]);

    // console.log('data', data[0]);

    setRawData(data);
  }
);

export const getSettingsFx = createEffect('get settings').use(
  async params => {
    if (
      Object.keys(colorSchema.getState()).length &&
      Object.keys(mapSettings.getState()).length
    ) {
      return;
    }

    const [{ values: settings }, colors] = await getMapValues({
      apiKey: 'AIzaSyCv-UFnDjRvdIR34CQjOlwM4R3gxAoh3Iw',
      ranges: ['A1:I86', 'M2:N2'],
      majorDimension: 'ROWS',
      spreadsheetId: '1Ak5b1x9Qf7yDw9f3uXliCG3PghE1JpJwPUGhsGF2VoE',
    });

    const keys = settings.shift();

    const map = settings.reduce((acc, row) => {
      const obj = row.reduce((acc2, value, i) => {
        acc2[keys[i]] = value;
        return acc2;
      }, {});

      acc[obj[MAP_ID_KEY]] = obj;
      return acc;
    }, {});

    setMapSettings(map);

    const [hot, cold] = colors.values[0];

    setColorSchema({
      hot,
      cold,
    });
  }
);

export const setSelectedTile = createEvent();
export const selectedTile = createStore('')
  .on(setSelectedTile, (state, data) => data === state ? '' : data);

export const setSelectedSocial = createEvent();
export const selectedSocial = createStore('Все площадки')
  .on(setSelectedSocial, (state, data) => data);

export const setColorSchema = createEvent();
export const colorSchema = createStore({})
  .on(setColorSchema, (state, data) => data);

export const setMapSettings = createEvent();
export const mapSettings = createStore({})
  .on(setMapSettings, (state, data) => data);

export const setRawData = createEvent();
export const rawData = createStore([])
  .on(setRawData, (state, data) => data);

export const casesByDates = rawData.map(rows => {
  return rows.reduce((acc, row) => {
    const date = row[0].replace(/^(\d\d)\.(\d\d)\.(\d{4})$/, '$3-$2-$1');
    acc[date] = 1 + (acc[date] || 0);
    return acc;
  }, {});
});

export const casesByMonths = casesByDates.map(map => {
  return Object.entries(map).reduce((acc, row) => {
    const month = row[0].slice(0, 7);
    acc[month] = row[1] + (acc[month] || 0);
    return acc;
  }, {});
});

export const casesByYears = casesByDates.map(map => {
  return Object.entries(map).reduce((acc, row) => {
    const year = row[0].slice(0, 4);
    acc[year] = row[1] + (acc[year] || 0);
    return acc;
  }, {});
});

export const dataBySocials = rawData.map(rows => {
  return rows.reduce((acc, row) => {
    row[6].split(',').forEach(social => {
      const trimmed = social.trim();
      if (!acc[trimmed]) {
        acc[trimmed] = [];
      }

      acc[trimmed].push(row);
    });
    return acc;
  }, {});
});

export const casesBySocials = dataBySocials.map(data => {
  const values = Object.keys(data).map(name => ({
    name,
    value: data[name].length,
  }));

  values.sort((a, b) => b.value - a.value);

  return {
    data: [
      ...values.slice(0, 10),
      values.slice(10).reduce((acc, { value }) => {
        acc.value += value;
        return acc;
      }, { name: 'Другое', value: 0 }),
    ],
    fold: {
      name: 'Другое',
      items: values.slice(10).map(({ name }) => name),
    },
  };
});
