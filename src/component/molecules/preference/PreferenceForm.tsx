import { Button, TextField } from '@material-ui/core';
import React, { useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import { soundOffsetState } from '../../../recoil/preference';

type FormData = {
  soundOffset: string;
};

export function PreferenceForm() {
  const [soundOffset, setSoundOffset] = useRecoilState(soundOffsetState);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, control } = useForm<FormData>({
    defaultValues: { soundOffset: soundOffset.toString() },
  });

  const onSubmit = useCallback(
    (data: FormData) => {
      setSoundOffset(+data.soundOffset);
    },
    [setSoundOffset],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="soundOffset"
        control={control}
        rules={{ required: true }}
        render={({ field }) => <TextField type="number" {...field} variant="outlined" placeholder="0" />}
      />
      <Button type="submit" variant="contained" color="primary">
        設定を保存
      </Button>
    </form>
  );
}
