import './FormListPage.css';

import {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Tab, Tabs } from 'react-bootstrap';
import { convertStringToNumber } from '../utils/string-util';
import AppContext from '../store/context/app-context';
import { notificationTypes } from '../components/Notification';
import Toolbar from '../components/Toolbar';
import DesignerConfigPicker from '../components/DesignerConfigPicker';
import FormsTable from '../components/FormsTable';
import FormSpecsModal from '../components/FormSpecsModal';

function FormSpecsPage() {
  const {
    activeForm,
    formClient,
    isSpinnerVisible,
    hideSpinner,
    isUnsaved,
    setActiveForm,
    setIsUnsaved,
    showNotification,
    showSpinner,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const [remoteForm, setRemoteForm] = useState();
  const [localForms, setLocalForms] = useState([]);
  const [remoteForms, setRemoteForms] = useState([]);
  const [clearSelectedLocalFormToggle, setClearSelectedLocalFormToggle] = useState(false);
  const [clearSelectedRemoteFormToggle, setClearSelectedRemoteFormToggle] = useState(false);
  const [canCreate, setCanCreate] = useState(true);
  const [canEditDesign, setCanEditDesign] = useState(false);
  const [canLoad, setCanLoad] = useState(false);
  const [canSave, setCanSave] = useState(false);
  const [canRun, setCanRun] = useState(false);
  const [canEditSpecs, setCanEditSpecs] = useState(false);
  const [showFormSpecsModal, setShowFormSpecsModal] = useState(false);
  const isMounted = useRef(false);

  const refreshLocalFormsList = useCallback(() => {
    if (formClient) {
      formClient.listLocalForms({})
        .then((localFormsList) => setLocalForms(
          localFormsList.map((localForm) => (
            { localRef: localForm.localRef, ...localForm.metadata }
          )),
        ));
    }
  }, [formClient]);

  const refreshRemoteFormsList = useCallback(() => {
    if (formClient) {
      showSpinner(('Retrieving remote forms...'));
      formClient.listRemoteForms({
        size: convertStringToNumber(process.env.REACT_APP_REMOTE_LIST_SIZE, 100),
      })
        .then((remoteFormsList) => {
          setRemoteForms(
            remoteFormsList,
          );
          hideSpinner();
        })
        .catch((err) => {
          hideSpinner();
          /* If no error message, this is because the access token needs refreshing,
          so in that case not raising any error notification */
          if (err?.message) {
            showNotification(`Error fetching remote forms list: ${err.message}`, notificationTypes.error);
          }
        });
    }
  }, [formClient, hideSpinner, showNotification, showSpinner]);

  const handleOnFormDeselect = () => {
    setActiveForm();
    setRemoteForm();
    setCanLoad(false);
    setCanRun(false);
  };

  const handleOnLocalFormSelect = ({ selectedRows }) => {
    handleOnFormDeselect();
    const form = selectedRows[0];
    if (form) {
      setClearSelectedRemoteFormToggle(!clearSelectedRemoteFormToggle);
      const { localRef } = form;
      const unsaved = isUnsaved(localRef);
      setActiveForm(localRef);
      setCanRun(!canSave);
      setCanSave(unsaved);
    }
  };

  const handleOnRemoteFormSelect = ({ selectedRows }) => {
    handleOnFormDeselect();
    const form = selectedRows[0];
    if (form) {
      setClearSelectedLocalFormToggle(!clearSelectedLocalFormToggle);
      setRemoteForm({ namespace: form.namespace, name: form.name });
      setCanCreate(false);
      setCanLoad(true);
    }
  };

  const handleOnFormsSpecsModalClose = () => {
    refreshLocalFormsList();
    setShowFormSpecsModal(false);
  };

  const handleOnClickLoad = () => {
    showSpinner('Loading form...');
    formClient.loadForm({ namespace: remoteForm?.namespace, name: remoteForm?.name })
      .then((loadedForm) => {
        setActiveForm(loadedForm);
        setIsUnsaved(loadedForm, false);
        setCanSave(false);
        setCanLoad(false);
        refreshLocalFormsList();
        hideSpinner();
      })
      .catch((err) => {
        showNotification(err.message, notificationTypes.error);
        hideSpinner();
      });
  };

  const handleOnClickSave = async () => {
    showSpinner('Saving form...');
    formClient.saveForm({ localReference: activeForm })
      .then(async () => {
        setIsUnsaved(activeForm, false);
        setCanSave(false);
        refreshLocalFormsList();
        refreshRemoteFormsList();
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

  const handleUnsaved = (localReference) => {
    setIsUnsaved(localReference, true);
    setCanSave(true);
  };

  const handleOnClickEditDesign = async () => {
    navigate('/edit');
  };

  useEffect(() => {
    setCanCreate(!activeForm && !canLoad);
    setCanEditSpecs(!!activeForm);
    setCanEditDesign(!!activeForm);
  }, [activeForm, canLoad]);

  useEffect(() => {
    if (formClient && isMounted.current && activeForm && activeForm !== 'undefined') {
      formClient.getForm({ localReference: activeForm }).then(({ data }) => {
        if (data.id) {
          setCanRun(!canSave);
        } else {
          setCanRun(false);
        }
      });
    }
  }, [activeForm, canSave, formClient]);

  useEffect(() => {
    setActiveForm();
  }, [setActiveForm]);

  useEffect(() => {
    if (formClient && !isMounted.current) {
      refreshLocalFormsList();
      refreshRemoteFormsList();
      isMounted.current = true;
    }
  }, [formClient, refreshLocalFormsList, refreshRemoteFormsList]);

  return (
    <div hidden={isSpinnerVisible}>
      {isMounted.current
      && (
        <FormSpecsModal
          show={showFormSpecsModal}
          onHide={handleOnFormsSpecsModalClose}
          onUnsaved={handleUnsaved}
        />
      )}
      <Toolbar
        title="Local and Remote Forms"
        buttons={[
          {
            label: 'CREATE',
            visible: canCreate,
            onClick: () => setShowFormSpecsModal(true),
          },
          {
            label: 'EDIT SPECS',
            visible: canEditSpecs,
            onClick: () => setShowFormSpecsModal(true),
          },
          {
            label: 'LOAD',
            visible: canLoad,
            onClick: handleOnClickLoad,
          },
          {
            disabled: !canSave,
            label: 'SAVE',
            visible: canEditSpecs,
            onClick: handleOnClickSave,
          },
          {
            disabled: !canEditDesign,
            label: 'DESIGN',
            onClick: handleOnClickEditDesign,
          },
          {
            disabled: !canRun,
            label: 'RUN',
            onClick: () => navigate('/runtime'),
          },
        ]}
      >
        <DesignerConfigPicker />
      </Toolbar>
      <Container fluid>
        <Tabs className="pt-2">
          <Tab eventKey="localForms" title="Local forms" className="form-list-tab">
            <FormsTable
              clearSelectedRow={clearSelectedLocalFormToggle}
              forms={localForms}
              keyField="localRef"
              onFormSelect={handleOnLocalFormSelect}
            />
          </Tab>
          <Tab eventKey="remoteForms" title="Remote forms" className="form-list-tab">
            <FormsTable
              clearSelectedRow={clearSelectedRemoteFormToggle}
              forms={remoteForms}
              keyField="id"
              onFormSelect={handleOnRemoteFormSelect}
            />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}

export default FormSpecsPage;
