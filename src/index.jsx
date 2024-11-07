import 'bootstrap/dist/css/bootstrap.css';

import ReactDOM from 'react-dom/client';
import { AuthProvider } from 'react-oidc-context';
import AppContextProvider from './store/context/AppContextProvider';
import App from './App';
import OidcConfig from './authorization/oidc-config';

ReactDOM.createRoot(document.getElementById('root')).render(
  // eslint-disable-next-line react/jsx-props-no-spreading
  <AuthProvider {...OidcConfig}>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </AuthProvider>,
);
