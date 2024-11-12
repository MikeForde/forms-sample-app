import { createContext } from 'react';

const AppContext = createContext({
  activeForm: '',
  formClient: {},
  isSpinnerVisible: false,
  notificationProps: { message: '', type: '' },
  selectedDesignerConfig: '',
  spinnerMessage: '',
  hideSpinner: () => {},
  isUnsaved: () => {},
  setActiveForm: () => {},
  setDataSourceErrorHandler: () => {},
  setIsUnsaved: () => {},
  setFormClient: () => {},
  setSelectedDesignerConfig: () => {},
  showNotification: () => {},
  showSpinner: () => {},
});

export default AppContext;
