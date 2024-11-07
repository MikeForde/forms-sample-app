import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import Toolbar from '../components/Toolbar';
import FormStatusDisplay from '../components/FormStatusDisplay';
import RuntimeFormInfo, { runtimeFormInfoTabs } from '../components/RuntimeFormInfo';
import FormRuntime from '../components/FormRuntime';
import FormActionDispatcher from '../components/FormActionDispatcher';

function FormRuntimePage() {
  const [runtimeInfoActiveTab, setRuntimeInfoActiveTab] = useState(runtimeFormInfoTabs.formData);
  const runtimeFormInfoRef = useRef();
  const navigate = useNavigate();

  return (
    <>
      <Toolbar
        title="Run Form"
        buttons={[
          {
            label: 'BACK',
            onClick: () => navigate(-1),
          },
          {
            label: 'VALIDATE FORM DATA',
            onClick: () => {
              runtimeFormInfoRef.current.validateFormData();
              setRuntimeInfoActiveTab(runtimeFormInfoTabs.validationErrors);
            },
          },
        ]}
      >
        <FormActionDispatcher />
        <FormStatusDisplay />
      </Toolbar>
      <Container fluid>
        <Row>
          <Col md={9}>
            <FormRuntime />
          </Col>
          <Col md={3}>
            <RuntimeFormInfo
              ref={runtimeFormInfoRef}
              activeTab={runtimeInfoActiveTab}
              onTabSelect={(selectedTab) => setRuntimeInfoActiveTab(selectedTab)}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default FormRuntimePage;
