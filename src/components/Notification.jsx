import './Notification.css';

import { useContext, useEffect, useState } from 'react';
import { CloseButton, Toast } from 'react-bootstrap';
import AppContext from '../store/context/app-context';

export const notificationTypes = {
  error: 'danger',
  success: 'success',
};

function Notification() {
  const { notificationProps } = useContext(AppContext);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (
      notificationProps?.message
      && Object.values(notificationTypes).includes(notificationProps?.type)
    ) {
      setShow(true);
    }
  }, [notificationProps]);

  return (
    <div className="notification">
      <Toast
        bg={notificationProps.type}
        show={show}
        delay={5000}
        autohide
        onClose={() => setShow(false)}
      >
        <div className="d-flex">
          <Toast.Body className="text-white">{notificationProps.message}</Toast.Body>
          <CloseButton variant="white" onClick={() => setShow(false)} className="me-2 m-auto" />
        </div>
      </Toast>
    </div>
  );
}

export default Notification;
