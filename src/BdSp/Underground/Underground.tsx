import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Toolbar from '@mui/material/Toolbar';

import { wrap } from 'comlink';
import { useTranslation } from 'react-i18next';

import { RNGInfo } from './RNGInfo';
import { Filters } from './Filters';
import { Results } from './Results';

export const calculatePokemon = wrap<AnyPromiseFunction>(
  new Worker('./workers/getResults.ts'),
);

export function Underground() {
  const { t } = useTranslation();
  const [searching, setSearching] = React.useState(false);
  const [state, setState] = React.useState({
    state0: '',
    state1: '',
    state2: '',
    state3: '',
    shiny_filter: 4,
    min_advances: 0,
    max_advances: 10000,
    delay: 0,
    nature_filter: [25],
    ability_filter: 3,
    encounter: 12,
    gender_ratio: 256,
    gender_filter: 256,
    tiles: 0,
    large_room: false,
    diglett_boost: false,
    minIVs: { hp: '0', atk: '0', def: '0', spa: '0', spd: '0', spe: '0' },
    maxIVs: { hp: '31', atk: '31', def: '31', spa: '31', spd: '31', spe: '31' },
  });

  const [results, setResults] = React.useState([
    {
      advances: 0,
      shiny_value: 'None',
      state0: 0,
      state1: 0,
      ec: 0,
      pid: 0,
      encounter: 0,
      nature: 'Any',
      ability: 0,
      ivs: [0, 0, 0, 0, 0, 0],
      gender: 256,
    },
  ]);

  const {
    state0,
    state1,
    state2,
    state3,
    shiny_filter,
    min_advances,
    max_advances,
    delay,
    nature_filter,
    ability_filter,
    encounter,
    gender_ratio,
    gender_filter,
    tiles,
    large_room,
    diglett_boost,
    minIVs,
    maxIVs,
  } = state;

  const handleSubmit = event => {
    event.preventDefault();
    setSearching(true);

    return calculatePokemon(
      parseInt(state0, 16),
      parseInt(state1, 16),
      parseInt(state2, 16),
      parseInt(state3, 16),
      shiny_filter,
      min_advances,
      max_advances,
      delay,
      nature_filter,
      ability_filter,
      encounter,
      gender_ratio,
      gender_filter,
      tiles,
      large_room,
      diglett_boost,
      [
        parseInt(minIVs.hp),
        parseInt(minIVs.atk),
        parseInt(minIVs.def),
        parseInt(minIVs.spa),
        parseInt(minIVs.spd),
        parseInt(minIVs.spe),
      ],
      [
        parseInt(maxIVs.hp),
        parseInt(maxIVs.atk),
        parseInt(maxIVs.def),
        parseInt(maxIVs.spa),
        parseInt(maxIVs.spd),
        parseInt(maxIVs.spe),
      ],
    ).then(data => {
      setResults(data), setSearching(false);
    });
  };

  return (
    <Box
      component="form"
      autoComplete="off"
      onSubmit={handleSubmit}
      sx={{
        width: { sm: '75%' },
        maxWidth: '1000px',
        ml: 'auto',
        mr: 'auto',
        mb: '30px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Toolbar />
      <RNGInfo setState={setState} state={state} />
      <Filters setState={setState} state={state} />
      <Button
        disabled={searching}
        type="submit"
        variant="contained"
        fullWidth
        sx={{ margin: '10px', ml: 'auto', mr: 'auto', maxWidth: '300px' }}
      >
        {searching ? <CircularProgress size={24} /> : t('Search')}
      </Button>
      <Results results={results} state={state} />
    </Box>
  );
}
