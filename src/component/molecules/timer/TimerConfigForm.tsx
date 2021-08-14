import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import React, { useCallback } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

export type TimerConfig = {
  laps: {
    title: string;
    duration: number;
  }[];
};

type FormData = {
  laps: {
    title: string;
    duration: string;
  }[];
};

export type TimerConfigFormProps = {
  onSave: (timerConfig: TimerConfig) => void;
};

export function TimerConfigForm({ onSave }: TimerConfigFormProps) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      laps: [{ title: '', duration: '' }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'laps',
  });

  const handleAddField = useCallback(() => {
    append({ title: '', duration: '' });
  }, [append]);

  const onSubmit = useCallback(
    (data: FormData) => {
      onSave({
        laps: data.laps.slice(0, -1).map((lapConfig) => ({
          title: lapConfig.title,
          // 秒をミリ秒に直す
          duration: +lapConfig.duration * 1000,
        })),
      });
    },
    [onSave],
  );

  const items = fields.map((field, index) => {
    const isLastField = index === fields.length - 1;
    return (
      <div key={field.id}>
        <Controller
          name={`laps.${index}.title`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="タイトル"
              variant="outlined"
              placeholder="例: エンカウントまで"
              onFocus={isLastField ? handleAddField : undefined}
            />
          )}
        />
        <Controller
          name={`laps.${index}.duration`}
          control={control}
          rules={{ required: !isLastField, min: 0 }}
          render={({ field }) => (
            <TextField
              {...field}
              label="待機時間"
              variant="outlined"
              placeholder="例: 10"
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">秒</InputAdornment>,
              }}
              onFocus={isLastField ? handleAddField : undefined}
            />
          )}
        />
        {!isLastField && (
          <IconButton aria-label="ラップを削除" onClick={() => remove(index)}>
            <CloseIcon />
          </IconButton>
        )}
      </div>
    );
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>{items}</div>
      <Button type="submit" variant="contained" color="primary">
        設定を保存
      </Button>
    </form>
  );
}
