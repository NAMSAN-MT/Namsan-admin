import { GoogleAuthProvider } from 'firebase/auth';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';

import 'typeface-rubik';
import '@fontsource/ibm-plex-mono';
import Logo from '../src/assets/logo.svg';

import {
  buildCollection,
  CircularProgressCenter,
  createCMSDefaultTheme,
  FirebaseAuthController,
  FirebaseLoginView,
  FireCMS,
  ModeControllerProvider,
  NavigationRoutes,
  Scaffold,
  SideDialogs,
  SnackbarProvider,
  useBuildModeController,
  useFirebaseAuthController,
  useFirebaseStorageSource,
  useFirestoreDataSource,
  useInitialiseFirebase,
  useValidateAuthenticator,
  DrawerNavigationItem,
} from 'firecms';

import { firebaseConfig } from './api/firebase';
import UseAuth from './hooks/useAuth';
import Work from './schema/work';
import { useMemo } from 'react';
import Members from './schema/members';

const DEFAULT_SIGN_IN_OPTIONS = [GoogleAuthProvider.PROVIDER_ID];

export default function App() {
  const signInOptions = DEFAULT_SIGN_IN_OPTIONS;
  const {
    firebaseApp,
    firebaseConfigLoading,
    configError,
    firebaseConfigError,
  } = useInitialiseFirebase({ firebaseConfig });

  const authController: FirebaseAuthController = useFirebaseAuthController({
    firebaseApp,
    signInOptions,
  });

  const dataSource = useFirestoreDataSource({
    firebaseApp,
  });

  const storageSource = useFirebaseStorageSource({ firebaseApp });
  const modeController = useBuildModeController();
  const theme = useMemo(
    () => createCMSDefaultTheme({ mode: modeController.mode }),
    [modeController.mode],
  );

  const { canAccessMainView } = useValidateAuthenticator({
    authController,
    authentication: async ({ user }: { user: any }) => {
      console.log('Allowing access to', user?.email);
      return true;
    },
    dataSource,
    storageSource,
  });

  if (configError) {
    return <div> {configError} </div>;
  }

  if (firebaseConfigError) {
    return (
      <div>
        It seems like the provided Firebase config is not correct. If you are
        using the credentials provided automatically by Firebase Hosting, make
        sure you link your Firebase app to Firebase Hosting.
      </div>
    );
  }

  if (firebaseConfigLoading || !firebaseApp) {
    return <CircularProgressCenter />;
  }

  return (
    <Router>
      <SnackbarProvider>
        <ModeControllerProvider value={modeController}>
          <FireCMS
            authController={authController}
            collections={[Work, Members]}
            dataSource={dataSource}
            storageSource={storageSource}
            entityLinkBuilder={({ entity }: { entity: any }) =>
              `https://console.firebase.google.com/project/${firebaseApp.options.projectId}/firestore/data/${entity.path}/${entity.id}`
            }
          >
            {({ loading }: { loading: boolean }) => {
              let component;
              if (loading) {
                component = <CircularProgressCenter />;
              } else if (!canAccessMainView) {
                component = (
                  <FirebaseLoginView
                    allowSkipLogin={false}
                    signInOptions={signInOptions}
                    firebaseApp={firebaseApp}
                    authController={authController}
                    // logo={Logo}
                  />
                );
              } else {
                component = (
                  <Scaffold name={'NAMSAN'} logo={Logo} autoOpenDrawer>
                    <NavigationRoutes />
                    <SideDialogs />
                  </Scaffold>
                );
              }

              return (
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  {component}
                </ThemeProvider>
              );
            }}
          </FireCMS>
        </ModeControllerProvider>
      </SnackbarProvider>
    </Router>
  );
}
