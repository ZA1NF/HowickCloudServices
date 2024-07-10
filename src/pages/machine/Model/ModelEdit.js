import { Helmet } from 'react-helmet-async';
import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { useDispatch,useSelector } from 'react-redux';
import { Container } from '@mui/material';
import { getMachineModel} from '../../../redux/slices/products/model';
import ModelEditForm from './ModelEditForm';
// redux

// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections



// ----------------------------------------------------------------------

export default function ModelEdit() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const { id } = useParams(); 
  // console.log(id);

  
  const { machinemodel } = useSelector((state) => state.machinemodel);

  useLayoutEffect(() => {
     dispatch(getMachineModel(id));
  }, [dispatch, id]);

  
  return (
    <>

      <Container maxWidth={false }>
        <ModelEditForm/>
      </Container>
    </>
  );
}
