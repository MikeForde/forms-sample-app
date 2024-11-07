import './FormDesigner.css';

import { useContext, useEffect } from 'react';
import AppContext from '../store/context/app-context';

export const FORM_DESIGNER_ELEMENT_ID = 'designer';

function FormDesigner() {
  const {
    activeForm,
    formClient,
  } = useContext(AppContext);

  useEffect(() => {
    formClient.editForm({
      localReference: activeForm,
      htmlElementId: FORM_DESIGNER_ELEMENT_ID,
    });
  }, [activeForm, formClient]);

  return (
    <div id={FORM_DESIGNER_ELEMENT_ID} className="form-designer" />
  );
}

export default FormDesigner;
