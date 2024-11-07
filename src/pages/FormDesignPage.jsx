import 'split-pane-react/esm/themes/default.css';

import {
  useContext, useState, useEffect, useRef,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Col, Container, Row, Tab, Tabs,
} from 'react-bootstrap';
import AppContext from '../store/context/app-context';
import { notificationTypes } from '../components/Notification';
import Toolbar from '../components/Toolbar';
import FormStatusDisplay from '../components/FormStatusDisplay';
import CheckpointControl from '../components/CheckpointControl';
import FormDesigner, { FORM_DESIGNER_ELEMENT_ID } from '../components/FormDesigner';
import Preview from '../components/Preview';
import DesignConfig from '../components/DesignConfig';

const tabs = {
  designer: 'designer',
  preview: 'preview',
  designConfig: 'designConfig',
};

function FormDesignPage() {
  const {
    activeForm,
    formClient,
    isSpinnerVisible,
    isUpdated,
    hideSpinner,
    setIsUpdated,
    showNotification,
    showSpinner,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const [formStatus, setFormStatus] = useState('');
  const [canSave, setCanSave] = useState(false);
  const [canPublish, setCanPublish] = useState(false);
  const [activeTab, setActiveTab] = useState('designer');
  const [isAutoSave, setIsAutoSave] = useState(true);
  const checkpointControlRef = useRef();

  const handleOnClickSave = async () => {
    showSpinner('Saving form...');
    /* If auto-save is turned of, create a checkpoint that matches the moment of saving
    (to support resetting to that moment) */
    if (!isAutoSave) {
      await formClient.setForm({ htmlElementId: FORM_DESIGNER_ELEMENT_ID });
    }
    formClient.saveForm({ localReference: activeForm })
      .then(async (savedFormMetadata) => {
        setFormStatus(savedFormMetadata.version.status);
        if (!isAutoSave) {
          checkpointControlRef.current.refreshCheckpoints();
        }
        setIsUpdated(false);
        setCanSave(false);
        setCanPublish(true);
        hideSpinner();
      })
      .catch((err) => {
        hideSpinner();
        if (typeof err === 'string') {
          showNotification(err, notificationTypes.error);
        } else if (typeof err === 'object' && err.message) {
          showNotification(err.message, notificationTypes.error);
        } else {
          showNotification('Server error, please try later ', notificationTypes.error);
        }
      });
  };

  const handleOnClickPublish = () => {
    showSpinner('Publishing form...');
    formClient.publishForm({ localReference: activeForm })
      .then(async (publishedForm) => {
        setFormStatus(publishedForm.version.status);
        setCanPublish(false);
        hideSpinner();
      })
      .catch((err) => {
        hideSpinner();
        showNotification(err.message, notificationTypes.error);
      });
  };

  useEffect(() => {
    setIsAutoSave(formClient.getConfig().designConfig?.autoSave);
  }, [formClient]);

  useEffect(() => {
    formClient.getForm({ localReference: activeForm }).then(({ data }) => {
      if (!data.id || isUpdated) {
        setCanSave(true);
      } else if (data.status === 'DRAFT') {
        setCanPublish(true);
      }
    });

    // Sets the callback which will be triggered on every change to the canvas
    formClient.updateConfig(
      {
        designConfig: {
          afterFormDesignChangeCallback: () => {
            setCanSave(true);
            setCanPublish(false);
            if (!isAutoSave) {
              checkpointControlRef.current.enableSetCheckPointButton();
              checkpointControlRef.current.enableResetToCheckpointButton();
            }
          },
        },
      },
    );
  }, [activeForm, formClient, isAutoSave, isUpdated]);

  return (
    <div hidden={isSpinnerVisible}>
      <Toolbar
        title="Design Form"
        buttons={[
          {
            label: 'BACK',
            onClick: () => navigate(-1),
          },
          {
            disabled: !canSave,
            label: 'SAVE',
            onClick: handleOnClickSave,
          },
          {
            disabled: !canPublish,
            label: 'PUBLISH',
            onClick: handleOnClickPublish,
          },
          {
            disabled: canSave,
            label: 'RUN',
            onClick: () => navigate('/runtime'),
          },
        ]}
      >
        {!isAutoSave && <CheckpointControl ref={checkpointControlRef} />}
        <FormStatusDisplay formStatus={formStatus} />
      </Toolbar>
      <Container fluid>
        <Row>
          <Col>
            <Tabs
              activeKey={activeTab}
              onSelect={(key) => {
                setActiveTab(key);
              }}
            >
              <Tab
                eventKey={tabs.designer}
                title="Designer"
              >
                <FormDesigner />
              </Tab>
              <Tab
                eventKey={tabs.preview}
                title="Preview"
                unmountOnExit
              >
                <Preview />
              </Tab>
              <Tab
                eventKey={tabs.designConfig}
                title="Design Config"
                unmountOnExit
              >
                <DesignConfig />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default FormDesignPage;
