import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import { audioOffsetState } from '../../recoil/user-preference';

type FormData = {
  audioOffset: string;
};

export type UserPreferenceProps = {};

export function UserPreference(_props: UserPreferenceProps) {
  const [audioOffset, setAudioOffset] = useRecoilState(audioOffsetState);

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: { audioOffset: audioOffset.toString() },
  });

  const onSubmit = useCallback(
    (data: FormData) => {
      setAudioOffset(+data.audioOffset);
    },
    [setAudioOffset],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        name="audioOffset"
        inputRef={register()}
        label="音出しのタイミング調整"
        variant="outlined"
        placeholder="例: 10 / -3"
        type="number"
        required
        InputProps={{
          endAdornment: <InputAdornment position="end">ms</InputAdornment>,
        }}
      />
      <Button type="submit" variant="contained" color="primary">
        設定を保存
      </Button>
    </form>
  );
}
