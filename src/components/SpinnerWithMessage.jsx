import './SpinnerWithMessage.css';

import { useContext } from 'react';
import { Spinner } from 'react-bootstrap';
import AppContext from '../store/context/app-context';

function SpinnerWithMessage() {
  const { isSpinnerVisible, spinnerMessage } = useContext(AppContext);

  return (
    <div hidden={!isSpinnerVisible} className="spinner-container">
      <center className="spinner-wrapper">
        <br />
        <Spinner variant="primary" />
        <span className="spinner-message">{spinnerMessage}</span>
      </center>
    </div>
  );
}

export default SpinnerWithMessage;
