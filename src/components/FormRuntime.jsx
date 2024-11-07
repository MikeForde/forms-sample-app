import './FormRuntime.css';

import { useContext, useEffect } from 'react';
import AppContext from '../store/context/app-context';
import { notificationTypes } from './Notification';

export const FORM_RUNTIME_ELEMENT_ID = 'form';

function FormRuntime() {
  const {
    activeForm,
    formClient,
    setDataSourceErrorHandler,
    showNotification,
  } = useContext(AppContext);

  useEffect(() => {
    // Set error handler for users (for user control) data source
    setDataSourceErrorHandler('users', (err) => showNotification(err.message, notificationTypes.error));

    /* REMARK: in this sample app we are passing one single htmlElementId
    as there is only one active runtime form.
    However, you could decide to launch multiple forms at once passing different
    htmlElementId values to differeent renderForm calls. */
    formClient.renderForm(
      {
        localReference: activeForm,
        htmlElementId: FORM_RUNTIME_ELEMENT_ID,
        formData: {},
      },
    );
  }, [activeForm, formClient, setDataSourceErrorHandler, showNotification]);

  return (
    <div id={FORM_RUNTIME_ELEMENT_ID} className="form-runtime" />
  );
}

export default FormRuntime;
