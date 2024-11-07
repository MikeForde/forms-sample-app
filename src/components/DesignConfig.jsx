import { useContext, useEffect, useState } from 'react';
import { Form, Container } from 'react-bootstrap';
import AppContext from '../store/context/app-context';

function DesignConfig() {
  const { activeForm, formClient } = useContext(AppContext);
  const [designConfig, setDesignConfig] = useState('');

  useEffect(() => {
    formClient.getForm({ localReference: activeForm })
      .then((activeFormObj) => {
        if (activeFormObj.canRender) {
          setDesignConfig(JSON.stringify(activeFormObj.data.content.design, null, 2));
        }
      });
  }, [activeForm, formClient]);

  return (
    <Container fluid className="px-0 pt-2">
      <Form>
        <Form.Group>
          <Form.Control
            as="textarea"
            value={designConfig}
            readOnly
            rows={29}
          />
        </Form.Group>
      </Form>
    </Container>
  );
}

export default DesignConfig;
