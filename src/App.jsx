import './App.css';

import { useContext, useState, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FormClient } from '@opentext/forms-client';
import { convertStringToNumber } from './utils/string-util';
import AppContext from './store/context/app-context';
import Notification from './components/Notification';
import SpinnerWithMessage from './components/SpinnerWithMessage';
import Header from './components/Header';
import FormListPage from './pages/FormListPage';
import FormDesignPage from './pages/FormDesignPage';
import FormRuntimePage from './pages/FormRuntimePage';

function App() {
  const { hideSpinner, showSpinner, setFormClient } = useContext(AppContext);
  const {
    isAuthenticated,
    isLoading,
    user,
    signinRedirect,
    signoutRedirect,
  } = useAuth();
  const [email, setEmail] = useState();
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [initializedFormClient, setInitializedFormClient] = useState();

  useEffect(() => {
    if (isLoading) {
      showSpinner('Loading...');
    } else if (!isAuthenticated) {
      signinRedirect();
      showSpinner('Authenticating...');
    } else if (!isAppLoaded) {
      setEmail(user.profile?.email);
      setIsAppLoaded(true);
      hideSpinner();
    }
  }, [
    hideSpinner,
    isAppLoaded,
    isAuthenticated,
    isLoading,
    showSpinner,
    signinRedirect,
    user,
  ]);

  useEffect(() => {
    if (initializedFormClient && isAuthenticated) {
      if (user?.access_token) {
        initializedFormClient.updateConfig({
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.access_token}`,
          },
          failedAuthenticationCallback: () => {
            signinRedirect();
          },
        });
      } else {
        signinRedirect();
      }
      setFormClient(initializedFormClient);
    }
  }, [initializedFormClient, isAuthenticated, setFormClient, signinRedirect, user]);

  useEffect(() => {
    setInitializedFormClient(new FormClient(
      {
        supportedLocales: ['en', 'ja', 'de', 'fr', 'es', 'nl', 'it', 'pt', 'pl'],
        currentLocale: process.env.REACT_APP_CURRENT_LOCALE,
        localizationFolder: './',
      },
      {
        baseUrl: `${process.env.REACT_APP_BASE_SERVICE_URL}/ui`,
        runtimeConfig: {
          controlConfig: {
            dataSource: {
              users: {
                config: {
                  uri: `${process.env.REACT_APP_BASE_SERVICE_URL}/admin/api/v1/organizations/${process.env.REACT_APP_ORGANIZATION_ID}/tenants/${process.env.REACT_APP_TENANT_ID}/apps/${process.env.REACT_APP_APP_ID}/users?items-per-page=9999&ignore-case=true&searchValue=$query`, // $query will be replaced by value given from user control in runtime
                  root: '_embedded.users',
                  id: 'id',
                  idUri: `${process.env.REACT_APP_BASE_SERVICE_URL}/admin/api/v1/organizations/${process.env.REACT_APP_ORGANIZATION_ID}/tenants/${process.env.REACT_APP_TENANT_ID}/users/$query`,
                  name: "firstName & ' ' & lastName",
                  email: 'email',
                },
              },
            },
          },
        },
        designConfig: {
          autoSave: process.env.REACT_APP_AUTO_SAVE !== 'false',
          formCheckpointCount:
            convertStringToNumber(process.env.REACT_APP_FORM_CHECKPOINT_COUNT, 1),
        },
      },
    ));
  }, []);

  return (
    <>
      <Notification />
      {/* Only show header when authenticated */}
      {isAuthenticated && <Header email={email} onLogout={() => signoutRedirect()} />}
      <SpinnerWithMessage />
      <div className="app" hidden={!isAuthenticated}>
        <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
          <Routes>
            <Route path="/" element={<FormListPage />} />
            <Route path="/edit" element={<FormDesignPage />} />
            <Route path="/runtime" element={<FormRuntimePage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
