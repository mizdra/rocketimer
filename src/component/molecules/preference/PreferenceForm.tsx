import { Button, TextField } from '@material-ui/core';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import { soundOffsetState } from '../../../recoil/preference';

type FormData = {
  soundOffset: number;
};

export function PreferenceForm() {
  const [soundOffset, setSoundOffset] = useRecoilState(soundOffsetState);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: { soundOffset },
  });

  const onSubmit = useCallback(
    (data: FormData) => {
      setSoundOffset(data.soundOffset);
    },
    [setSoundOffset],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        name="soundOffset"
        type="number"
        inputRef={register({
          valueAsNumber: true,
        })}
        label="SoundOffset"
        variant="outlined"
        placeholder="0"
      />
      <Button type="submit" variant="contained" color="primary">
        設定を保存
      </Button>
    </form>
  );
}
