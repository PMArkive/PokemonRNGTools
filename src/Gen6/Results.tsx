import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

import { useTranslation } from 'react-i18next';
import { NoResults } from '../Components/NoResults';
import { Target } from './Target';

import { formatIVs } from '../Utils/formatIVs';

const ShowResults = ({ results, t, handleClick, selected }) => {
  if (results.length === 0) {
    return <NoResults />;
  } else {
    return results.map((result, index) => {
      const isItemSelected = selected === result.pid;
      return (
        <TableRow
          selected={isItemSelected}
          onClick={event => handleClick(event, result.pid, result)}
          key={result.pid}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell align="left">{result.advances}</TableCell>
          <TableCell align="left">{formatIVs(result.ivs)}</TableCell>
          <TableCell align="left">
            {t(`hiddenpower.${result.hidden_power}`)}
          </TableCell>
          <TableCell align="left">{result.psv}</TableCell>
          <TableCell align="left">{result.pid.toString(16)}</TableCell>
        </TableRow>
      );
    });
  }
};

export const Results = ({ setState, results, state }) => {
  const { t } = useTranslation();
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [selected, setSelected] = React.useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClick = (event, pid, result) => {
    setSelected(pid);
    setState({ ...state, target: { is_set: true, ...result } });
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - results.length) : 0;

  return (
    <React.Fragment>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="results table">
          <TableHead>
            <TableRow>
              <TableCell>{t('Advances')}</TableCell>
              <TableCell align="left">{t('IVs')}</TableCell>
              <TableCell align="left">{t('Hidden Power')}</TableCell>
              <TableCell align="left">{t('PSV')}</TableCell>
              <TableCell align="left">{t('PID')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <Target state={state} t={t} />
            <ShowResults
              selected={selected}
              handleClick={handleClick}
              results={
                rowsPerPage > 0
                  ? results.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage,
                    )
                  : results
              }
              t={t}
            />
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          sx={{ overflow: 'initial' }}
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={results.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </React.Fragment>
  );
};
