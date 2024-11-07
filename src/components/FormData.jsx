import {
  useContext, useEffect, useState,
} from 'react';
import { Button, ButtonGroup, Form } from 'react-bootstrap';
import { FORM_RUNTIME_ELEMENT_ID } from './FormRuntime';
import AppContext from '../store/context/app-context';

function FormData() {
  const { formClient } = useContext(AppContext);
  const [formDataString, setFormDataString] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const handleSetFormData = async () => {
    try {
      await formClient.setFormData({
        htmlElementId: FORM_RUNTIME_ELEMENT_ID,
        formData: JSON.parse(formDataString),
      });
      setIsEditMode(false);
    } catch (e) {
      setIsValid(false);
    }
  };

  const handleFormdataStringChange = ({ target }) => {
    const { value } = target;
    setFormDataString(value);
    try {
      JSON.parse(value);
      setIsValid(true);
    } catch (err) {
      setIsValid(false);
    }
  };

  useEffect(() => {
    // Sets the callback which will be triggered on every change to the form data
    formClient.updateConfig(
      {
        runtimeConfig: {
          afterFormDataChangeCallback: () => {
            formClient.getFormData({ htmlElementId: FORM_RUNTIME_ELEMENT_ID })
              .then(({ formData }) => {
                setFormDataString(JSON.stringify(formData, null, 2));
                setIsEditMode(false);
                setIsValid(true);
              });
          },
        },
      },
    );
  }, [formClient]);

  return (
    <>
      <ButtonGroup className="ms-2 my-1">
        <Button
          onClick={() => setIsEditMode(true)}
          disabled={isEditMode}
        >
          Edit
        </Button>
        <Button
          color="primary"
          onClick={handleSetFormData}
          disabled={!isEditMode || !isValid}
        >
          Set
        </Button>
      </ButtonGroup>
      <Form className="m-2">
        <Form.Group>
          <Form.Control
            as="textarea"
            disabled={!isEditMode}
            isInvalid={!isValid}
            rows={26}
            value={formDataString}
            onChange={handleFormdataStringChange}
          />
          <Form.Control.Feedback type="invalid">Invalide Form Data JSON</Form.Control.Feedback>
        </Form.Group>
      </Form>
    </>
  );
}

export default FormData;
