import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AppContext from '../store/context/app-context';

function FormStatusDisplay({ formStatus = '' }) {
  const [statusToDisplay, setStatusToDisplay] = useState('');
  const { formClient, activeForm } = useContext(AppContext);

  useEffect(() => {
    formClient.getForm({ localReference: activeForm }).then(({ data }) => {
      setStatusToDisplay(data.status);
    });
  }, [activeForm, formClient]);

  useEffect(() => {
    if (formStatus) {
      setStatusToDisplay(formStatus);
    }
  }, [formStatus]);

  return (
    <h5 className="pt-1">
      Form Status:
      {' '}
      {statusToDisplay}
    </h5>
  );
}

FormStatusDisplay.propTypes = {
  formStatus: PropTypes.string,
};

export default FormStatusDisplay;
