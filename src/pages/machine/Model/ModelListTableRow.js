import PropTypes from 'prop-types';
import { useState } from 'react';
// import { sentenceCase } from 'change-case';
// @mui
import {
  Switch,
  Button,
  TableRow,
  MenuItem,
  TableCell,
} from '@mui/material';
// utils
// import { fData, fCurrency } from '../../../utils/formatNumber';
// components
import Iconify from '../../../components/iconify/Iconify';
import MenuPopover from '../../../components/menu-popover/MenuPopover';
import ConfirmDialog from '../../../components/confirm-dialog';
// import Label from '../../../components/label';
import { fDate } from '../../../utils/formatTime';
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
// import { useSelector } from '../../../redux/store';
import { useScreenSize } from '../../../hooks/useResponsive';

// ----------------------------------------------------------------------

ModelListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function ModelListTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const { name, category, isActive, createdAt } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const smScreen = useScreenSize('sm')

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  // const handleOpenPopover = (event) => {
  //   setOpenPopover(event.currentTarget);
  // };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <LinkTableCell align="left" onClick={onViewRow} param={name} />
        { smScreen && <TableCell align="left">{category?.name || ''}</TableCell>}

        <TableCell align="center">
          {' '}
          <Switch checked={isActive} disabled sx={{ my: -1 }} />{' '}
        </TableCell>

        <TableCell align="right">{fDate(createdAt)}</TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
