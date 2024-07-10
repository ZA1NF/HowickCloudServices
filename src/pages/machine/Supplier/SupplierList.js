import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
import { Link as useNavigate } from 'react-router-dom';
// @mui
import {
  Table,
  Button,
  TableBody,
  Container,
  TableContainer,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from 'react-redux';
// routes
import { getSuppliers, deleteSupplier,   ChangeRowsPerPage,
  ChangePage,
  setFilterBy, } from '../../../redux/slices/products/supplier';
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
// import { useSettingsContext } from '../../../components/settings';
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../../components/table';
// import Iconify from '../../../components/iconify/Iconify';
import Scrollbar from '../../../components/scrollbar';
// import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import ConfirmDialog from '../../../components/confirm-dialog/ConfirmDialog';
// sections
import SupplierListTableRow from './SupplierListTableRow';
import SupplierListTableToolbar from './SupplierListTableToolbar';
// import MachineDashboardNavbar from '../util/MachineDashboardNavbar';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { fDate } from '../../../utils/formatTime';
import TableCard from '../../components/ListTableTools/TableCard';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'xs1', label: 'Contact Name', align: 'left' },
  { id: 'md1', label: 'City', align: 'left' },
  { id: 'xs2', label: 'Country', align: 'left' },
  { id: 'isDisabled', label: 'Active', align: 'center' },
  { id: 'createdAt', label: 'Created At', align: 'right' },
];

const STATUS_OPTIONS = [
  // { id: '1', value: 'Order Received' },
  // { id: '2', value: 'In Progress' },
  // { id: '3', value: 'Ready For Transport' },
  // { id: '4', value: 'In Freight' },
  // { id: '5', value: 'Deployed' },
  // { id: '6', value: 'Archived' },
];

export default function SupplierList() {
  const [tableData, setTableData] = useState([]);
  const {
    dense,
    // page,
    order,
    orderBy,
    // rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    //
    onSort,
    // onChangePage,
    // onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'name',
  });

  const dispatch = useDispatch();

  // const { themeStretch } = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [filterName, setFilterName] = useState('');

  const [filterStatus, setFilterStatus] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const { suppliers, filterBy, page, rowsPerPage, isLoading, error, initial, responseMessage } = useSelector(
    (state) => state.supplier
  );

    
  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  useLayoutEffect(() => {
    // console.log('Testing done')
    dispatch(getSuppliers());
  }, [dispatch]);
  useEffect(() => {
    if (initial) {
        setTableData(suppliers);
    }
  }, [suppliers, error, responseMessage, enqueueSnackbar, initial]);

  const dataFiltered = applyFilter(
    {
      inputData: tableData,
      comparator: getComparator(order, orderBy),
      filterName,
      filterStatus,
    },
    [suppliers]
  );

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 60 : 80;

  const isFiltered = filterName !== '' || !!filterStatus.length;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  // const handleOpenConfirm = () => {
  //   setOpenConfirm(true);
  // };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const debouncedSearch = useRef(debounce((value) => {
    dispatch(ChangePage(0))
    dispatch(setFilterBy(value))
  }, 500))

  const handleFilterName = (event) => {
    debouncedSearch.current(event.target.value);
    setFilterName(event.target.value)
    setPage(0);
  };
  
  useEffect(() => {
      debouncedSearch.current.cancel();
  }, [debouncedSearch]);
  
  useEffect(()=>{
      setFilterName(filterBy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleDeleteRow = async (id) => {
    await dispatch(deleteSupplier(id));
    try {
      // console.log(id);
      // await dispatch(deleteSupplier(id));
      dispatch(getSuppliers());
      setSelected([]);

      if (page > 0) {
        if (dataInPage.length < 2) {
          setPage(page - 1);
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  // const handleDeleteRows = async (selectedRows, handleClose) => {
  //   // console.log(selectedRows)
  //   const deleteRows = tableData.filter((row) => !selectedRows.includes(row._id));
  //   setSelected([]);
  //   setTableData(deleteRows);

  //   if (page > 0) {
  //     if (selectedRows.length === dataInPage.length) {
  //       setPage(page - 1);
  //     } else if (selectedRows.length === dataFiltered.length) {
  //       setPage(0);
  //     } else if (selectedRows.length > dataInPage.length) {
  //       const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
  //       setPage(newPage);
  //     }
  //   }

  //   // dispatch delete supplier
  //   // await dispatch(deleteSuppliers(selectedRows));
  //   // await dispatch(getSuppliers())
  //   handleClose();
  // };

  // const handleEditRow = (id) => {
  //   // console.log(id);
  //   navigate(PATH_MACHINE.machines.settings.supplier.edit(id));
  // };

  const handleViewRow = (id) => {
    // console.log(id,PATH_MACHINE.supplier.view(id));
    navigate(PATH_MACHINE.machines.settings.supplier.view(id));
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  return (
    <>
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name="Suppliers" icon="material-symbols:list-alt-outline" setting />
        </StyledCardContainer>

        <TableCard>
          <SupplierListTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            statusOptions={STATUS_OPTIONS}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
          />
          {!isNotFound && <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />}
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            {/* <TableSelectedAction

              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row._id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
            /> */}

            <Scrollbar>
              <Table size="small" sx={{ minWidth: 360 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  // rowCount={tableData.length}
                  // numSelected={selected.length}
                  onSort={onSort}
                  // onSelectAllRows={(checked) =>
                  //   onSelectAllRows(
                  //     checked,
                  //     tableData.map((row) => row._id)
                  //   )
                  // }
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <SupplierListTableRow
                          key={row._id}
                          row={row}
                          selected={selected.includes(row._id)}
                          onSelectRow={() => onSelectRow(row._id)}
                          onDeleteRow={() => handleDeleteRow(row._id)}
                          // onEditRow={() => handleEditRow(row._id)}
                          onViewRow={() => handleViewRow(row._id)}
                        />
                      ) : (
                        !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                      )
                    )}
                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          {!isNotFound && <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />}
        </TableCard>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRow(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (filterSupplier) =>
        filterSupplier?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        filterSupplier?.contactName?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        filterSupplier?.address?.city?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        filterSupplier?.address?.country?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        // (product?.isActive ? "Active" : "Deactive")?.toLowerCase().indexOf(filterName.toLowerCase())  >= 0 ||
        fDate(filterSupplier?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  return inputData;
}
