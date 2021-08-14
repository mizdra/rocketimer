import { Button, TextField } from '@material-ui/core';
import React, { useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import { soundOffsetState } from '../../../recoil/preference';

type FormData = {
  soundOffset: number;
};

export function PreferenceForm() {
  const [soundOffset, setSoundOffset] = useRecoilState(soundOffsetState);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, control } = useForm<FormData>({
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
      <Controller
        name="soundOffset"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <TextField
            type="number"
            {...field}
            variant="outlined"
            placeholder="0"
            onChange={(e) => {
              return parseInt(e.target.value, 10);
            }}
          />
        )}
      />
      <Button type="submit" variant="contained" color="primary">
        設定を保存
      </Button>
    </form>
  );
}
