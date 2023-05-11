import React from 'react';
import {
  isArray as _isArray,
  isNumber as _isNumber,
  isString as _isString,
} from 'lodash-es';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import ListItemText from '@mui/material/ListItemText';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

type SharedConfig = {
  id: string;
  label: string;
  // Normally each field would have a specific type,
  // but we should be defensive against bad external configs.
  // This will also make types easier on the wasm side.
  defaultValue: string;
  required?: boolean;
};

type SelectOption = {
  label: string;
  value: string;
};

export type FieldConfig = SharedConfig &
  (
    | {
        type: 'select' | 'multiselect';
        options: SelectOption[];
        minValue?: never;
        maxValue?: never;
      }
    | {
        type: 'number';
        options?: never;
        minValue?: number;
        maxValue?: number;
      }
    | {
        type: 'hex_u64' | 'hex_number' | 'text' | 'checkbox';
        options?: never;
        minValue?: never;
        maxValue?: never;
      }
  );

type Props = FieldConfig;

export const InputField = ({
  id,
  type,
  label: nonTranslatedLabel,
  options,
  required = true,
  minValue,
  maxValue,
}: Props) => {
  const { t } = useTranslation();
  const label = t(nonTranslatedLabel);
  const formik = useFormikContext<Record<string, unknown>>();

  const inputProps = React.useMemo(() => {
    if (type === 'number') {
      return { min: minValue, max: maxValue };
    }

    if (type === 'hex_number') {
      return { pattern: '[0-9A-Fa-f]{1,8}' };
    }

    if (type === 'hex_u64') {
      return { pattern: '[0-9A-Fa-f]{1,16}' };
    }

    return {};
  }, [type, minValue, maxValue]);

  const value = formik.values[id];
  const error = formik.touched[id] && Boolean(formik.errors[id]);
  const helperText = formik.touched[id] && formik.errors[id];

  if (type === 'checkbox') {
    return (
      <FormControlLabel
        sx={{ userSelect: 'none' }}
        label={label}
        control={
          <Checkbox
            id={id}
            checked={!!value}
            onChange={formik.handleChange}
            inputProps={{ 'aria-label': label }}
          />
        }
      />
    );
  }

  if (type === 'number') {
    return (
      <TextField
        fullWidth
        required={required}
        id={id}
        label={label}
        variant="outlined"
        type="number"
        autoComplete="off"
        onChange={formik.handleChange}
        value={value}
        error={error}
        helperText={helperText}
        inputProps={inputProps}
      />
    );
  }

  if (type === 'text') {
    return (
      <TextField
        fullWidth
        required={required}
        id={id}
        label={label}
        variant="outlined"
        autoComplete="off"
        onChange={formik.handleChange}
        value={value}
        error={error}
        helperText={helperText}
      />
    );
  }

  if (type === 'hex_number' || type === 'hex_u64') {
    return (
      <TextField
        fullWidth
        required={required}
        id={id}
        label={label}
        variant="outlined"
        autoComplete="off"
        onChange={formik.handleChange}
        value={value}
        error={error}
        helperText={helperText}
        inputProps={inputProps}
      />
    );
  }

  if (type === 'select') {
    return (
      <TextField
        select
        fullWidth
        required={required}
        id={id}
        name={id}
        label={label}
        autoComplete="off"
        onChange={formik.handleChange}
        value={value}
        error={error}
      >
        {options.map(option => (
          <MenuItem key={option.label} value={option.value}>
            {t(option.label)}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  if (type === 'multiselect') {
    const safeValue = isArray(value) ? value : String(value).split(',');
    return (
      <FormControl fullWidth>
        <InputLabel id={`${id}-label`}>{label}</InputLabel>
        <Select
          multiple
          fullWidth
          required={required}
          id={id}
          name={id}
          label={label}
          autoComplete="off"
          onChange={formik.handleChange}
          value={safeValue}
          error={error}
          labelId={`${id}-label`}
          renderValue={selectedValues => {
            return selectedValues
              .map(selectedValue => {
                const option = options.find(
                  option => option.value == selectedValue,
                );
                return option == null ? null : option.label;
              })
              .join(', ');
          }}
        >
          {options.map(option => (
            <MenuItem key={option.label} value={option.value}>
              <Checkbox checked={safeValue.includes(option.value)} />
              <ListItemText primary={t(option.label)} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
};

export type ParsedValue = string | boolean | number | string[];
type ValueParser = (value: string) => ParsedValue;

const VALUE_PARSERS: Record<FieldConfig['type'], ValueParser> = {
  checkbox: value => value === 'true',
  // JS can only handle up to 0x1fffffffffffff
  // and wasm can't natively handle bigint.
  // Converting String -> u64 will happen in wasm.
  hex_u64: value => value,
  hex_number: value => {
    const num = parseInt(value, 16);
    return isNaN(num) ? 0 : num;
  },
  number: value => {
    const num = parseInt(value, 10);
    return isNaN(num) ? 0 : num;
  },
  select: value => value,
  text: value => value,
  multiselect: value => value.split(','),
};

export const getValueParser = (type: FieldConfig['type']): ValueParser => {
  const parser = VALUE_PARSERS[type];
  return parser == null ? VALUE_PARSERS.text : parser;
};

export const isArray = (value: unknown): value is string[] => {
  return _isArray(value);
};

export const isNumber = (value: unknown): value is number => {
  return _isNumber(value);
};

export const isString = (value: unknown): value is string => {
  return _isString(value);
};
