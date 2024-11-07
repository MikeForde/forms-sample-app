import { useContext, useEffect, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import AppContext from '../store/context/app-context';

const actions = [
  { key: 'hide', value: 'hide' },
  { key: 'show', value: 'show' },
  { key: 'enable', value: 'enable' },
  { key: 'disable', value: 'disable' },
  { key: 'sendError', value: 'validate' },
  { key: 'clearErrors', value: 'clearErrors' },
];

function FormActionDispatcher() {
  const { activeForm, formClient } = useContext(AppContext);
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState();
  const [selectedAction, setSelectedAction] = useState();
  const [errorMessage, setErrorMessage] = useState('');

  const handlePropertyPathSelection = ({ target }) => {
    setSelectedField(target.value);
  };

  const handleActionSelection = ({ target }) => {
    const { value } = target;
    if (value !== 'validate') {
      setErrorMessage('');
    }
    setSelectedAction(value);
  };

  const handleErrorMessage = ({ target }) => {
    setErrorMessage(target.value);
  };

  const submitFormAction = async () => {
    formClient.dispatchFormAction(({
      localReference: activeForm,
      type: selectedAction,
      propertyPath: selectedField,
      errorMessage,
    }));
  };

  useEffect(() => {
    formClient.getForm({ localReference: activeForm })
      .then(({ data }) => {
        setFields([
          ...new Set(
            data.content?.design.controls.reduce((accumulator, control) => {
              const field = control.data.runtime.propertyPath;
              if (field) {
                accumulator.push(field);
              }
              return accumulator;
            }, []),
          ),
        ]);
      });
  }, [activeForm, formClient]);

  return (
    <Form>
      <InputGroup>
        <InputGroup.Text>Form action</InputGroup.Text>
        <Form.Select
          onChange={handlePropertyPathSelection}
          value={selectedField}
        >
          <option value="">Select Field</option>
          {
            fields.map((field) => <option key={field} value={field}>{field}</option>)
          }
        </Form.Select>
        <Form.Select
          onChange={handleActionSelection}
          value={selectedAction}
          disabled={!selectedField}
        >
          <option value="">Select action</option>
          {
            actions.map((action) => (
              <option value={action.value} key={action.key}>
                {action.key}
              </option>
            ))
          }
        </Form.Select>
        <Form.Control
          onChange={handleErrorMessage}
          value={errorMessage}
          disabled={selectedAction !== 'validate' && selectedField}
        />
        <Button
          color="primary"
          onClick={submitFormAction}
          disabled={
            !(selectedField && selectedAction)
            || (selectedField && selectedAction === 'validate' && errorMessage === '')
          }
        >
          Submit action
        </Button>
      </InputGroup>
    </Form>
  );
}

export default FormActionDispatcher;
