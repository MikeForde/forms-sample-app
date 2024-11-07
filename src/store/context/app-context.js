import { createContext } from 'react';

const AppContext = createContext({
  activeForm: '',
  formClient: {},
  isSpinnerVisible: false,
  isUpdated: false,
  notificationProps: { message: '', type: '' },
  selectedDesignerConfig: '',
  spinnerMessage: '',
  hideSpinner: () => {},
  setDataSourceErrorHandler: () => {},
  setFormClient: () => {},
  showNotification: () => {},
  showSpinner: () => {},
});

export default AppContext;
