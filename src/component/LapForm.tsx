import React, { useCallback } from 'react';
import TextField from '@material-ui/core/TextField';
import { useForm, useFieldArray } from 'react-hook-form';
import InputAdornment from '@material-ui/core/InputAdornment';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

export type OuterFormData = {
  lapConfigs: {
    title: string;
    duration: number;
  }[];
};

type InnnerFormData = {
  lapConfigs: {
    title: string;
    duration: string;
  }[];
};

export type LapFormProps = {
  onSave?: (formData: OuterFormData) => void;
};

export function LapForm({ onSave }: LapFormProps) {
  const { control, register, handleSubmit, errors } = useForm<InnnerFormData>({
    defaultValues: {
      lapConfigs: [{ title: '', duration: '' }],
    },
  });
  const { fields, append, remove } = useFieldArray<InnnerFormData['lapConfigs'][0]>({
    control,
    name: 'lapConfigs',
  });

  const handleAddField = useCallback(() => {
    append({ title: '', duration: '' });
  }, [append]);

  const onSubmit = useCallback(
    (innerFormData: InnnerFormData) => {
      const outerFormData: OuterFormData = {
        lapConfigs: innerFormData.lapConfigs.slice(0, -1).map((lapConfig) => ({
          title: lapConfig.title,
          duration: +lapConfig.duration,
        })),
      };
      onSave?.(outerFormData);
      console.log(outerFormData, errors);
    },
    [errors, onSave],
  );

  const items = fields.map((field, index) => {
    const isLastField = index === fields.length - 1;
    return (
      <div key={field.id}>
        <TextField
          name={`lapConfigs[${index}].title`}
          inputRef={register()}
          label="タイトル"
          variant="outlined"
          placeholder="例: エンカウントまで"
          onClick={isLastField ? handleAddField : undefined}
          onChange={isLastField ? handleAddField : undefined}
        />
        <TextField
          name={`lapConfigs[${index}].duration`}
          inputRef={register()}
          label="待機時間"
          variant="outlined"
          placeholder="例: 10"
          type="number"
          required={!isLastField}
          inputProps={{
            min: 0,
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">秒</InputAdornment>,
          }}
          onClick={isLastField ? handleAddField : undefined}
          onChange={isLastField ? handleAddField : undefined}
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
