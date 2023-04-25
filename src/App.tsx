import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';

import 'typeface-rubik';
import '@fontsource/ibm-plex-mono';
import Logo from '../src/assets/logo.svg';

import {
  CircularProgressCenter,
  FirebaseLoginView,
  FireCMS,
  ModeControllerProvider,
  NavigationRoutes,
  Scaffold,
  SideDialogs,
  SnackbarProvider,
} from 'firecms';

import Work from './schema/work';
import Members from './schema/members';
import UseCms from './hooks/useCms';

export default function App() {
  const cms = UseCms();

  if (cms.configError) {
    return <div> {cms.configError} </div>;
  }

  if (cms.firebaseConfigError) {
    return (
      <div>
        It seems like the provided Firebase config is not correct. If you are
        using the credentials provided automatically by Firebase Hosting, make
        sure you link your Firebase app to Firebase Hosting.
      </div>
    );
  }

  if (cms.firebaseConfigLoading || !cms.firebaseApp) {
    return <CircularProgressCenter />;
  }

  return (
    <Router>
      <SnackbarProvider>
        <ModeControllerProvider value={cms.modeController}>
          <FireCMS
            authController={cms.authController}
            collections={[Work, Members]}
            dataSource={cms.dataSource}
            storageSource={cms.storageSource}
            entityLinkBuilder={({ entity }: { entity: any }) =>
              `https://console.firebase.google.com/project/${cms.firebaseApp.options.projectId}/firestore/data/${entity.path}/${entity.id}`
            }
          >
            {({ loading }: { loading: boolean }) => {
              let component;
              if (loading) {
                component = <CircularProgressCenter />;
              } else if (!cms.canAccessMainView) {
                component = (
                  <FirebaseLoginView
                    allowSkipLogin={false}
                    signInOptions={cms.signInOptions}
                    firebaseApp={cms.firebaseApp}
                    authController={cms.authController}
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
                <ThemeProvider theme={cms.theme}>
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
