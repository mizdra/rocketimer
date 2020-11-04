import { atom, DefaultValue } from 'recoil';
import { kvsEnvStorage } from '@kvs/env';

const storagePromise = kvsEnvStorage<StorageSchema>({
  name: 'user-preference',
  version: 1,
});

type StorageSchema = {
  audioOffset: number;
};

export const audioOffsetState = atom<number>({
  key: 'user-preference/audioOffset',
  default: storagePromise
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    .then((storage) => storage.get('audioOffset'))
    .then((rawAudioOffset) => rawAudioOffset ?? 0),
  effects_UNSTABLE: [
    ({ onSet }) => {
      storagePromise
        .then((storage) => {
          onSet((audioOffset) => {
            if (audioOffset instanceof DefaultValue) return;
            // TODO: handle error
            storage.set('audioOffset', audioOffset).catch(console.error);
          });
        })
        // TODO: handle error
        .catch(console.error);
    },
  ],
});
