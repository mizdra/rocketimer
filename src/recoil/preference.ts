import { atom } from 'recoil';

export const soundOffsetState = atom<number>({
  key: 'preference/soundOffset',
  default: 0,
});
