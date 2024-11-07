import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { FormClient } from '@opentext/forms-client';
import AppContext from './app-context';

function AppContextProvider({ children }) {
  const [activeForm, setActiveForm] = useState(() => sessionStorage.getItem('activeForm') || '');
  const [formClient, setFormClient] = useState(() => {
    const formClientSessionStorage = sessionStorage.getItem('formClient');
    if (formClientSessionStorage) {
      const storedFormClient = JSON.parse(formClientSessionStorage);
      return new FormClient(
        storedFormClient.localeDefinition,
        storedFormClient.config,
      );
    }
    return undefined;
  });
  const [selectedDesignerConfig, setSelectedDesignerConfig] = useState(() => sessionStorage.getItem('selectedDesignerConfig') || '');
  const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [notificationProps, setNotificationProps] = useState({ message: '', type: '' });
  const [spinnerMessage, setSpinnerMessage] = useState('');

  const hideSpinner = () => {
    setIsSpinnerVisible(false);
    setSpinnerMessage('');
  };

  const showSpinner = (message) => {
    setSpinnerMessage(message);
    setIsSpinnerVisible(true);
  };

  const showNotification = (message, type) => setNotificationProps({ message, type });

  const setDataSourceErrorHandler = useCallback((dataSourceKey, dataSourceErrorCallback) => {
    formClient?.updateConfig(
      {
        runtimeConfig: {
          controlConfig: {
            dataSource: {
              [dataSourceKey]: {
                config: {
                  ...formClient?.getConfig()
                    .runtimeConfig.controlConfig.dataSource[dataSourceKey].config,
                },
                errorCallback: dataSourceErrorCallback,
              },
            },
          },
        },
      },
    );
  }, [formClient]);

  /* Store context elements that should persist across screens in session storage
  to ensure they don't get lost as long as the browser session is active */
  useEffect(() => {
    if (activeForm) {
      sessionStorage.setItem('activeForm', activeForm);
    } else {
      sessionStorage.removeItem('activeForm');
    }
  }, [activeForm]);

  useEffect(() => {
    if (formClient) {
      sessionStorage.setItem('formClient', JSON.stringify(formClient));
    } else {
      sessionStorage.removeItem('formClient');
    }
  }, [formClient]);

  useEffect(() => {
    if (selectedDesignerConfig) {
      sessionStorage.setItem('selectedDesignerConfig', selectedDesignerConfig);
    } else {
      sessionStorage.removeItem('selectedDesignerConfig');
    }
  }, [selectedDesignerConfig]);

  const value = useMemo(() => (
    {
      activeForm,
      formClient,
      isSpinnerVisible,
      isUpdated,
      notificationProps,
      selectedDesignerConfig,
      spinnerMessage,
      hideSpinner,
      setDataSourceErrorHandler,
      setActiveForm,
      setFormClient,
      setIsUpdated,
      showNotification,
      setSelectedDesignerConfig,
      showSpinner,
    }
  ), [
    activeForm,
    formClient,
    isSpinnerVisible,
    isUpdated,
    notificationProps,
    selectedDesignerConfig,
    setDataSourceErrorHandler,
    spinnerMessage,
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

AppContextProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default AppContextProvider;
