import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';

import 'typeface-rubik';
import '@fontsource/ibm-plex-mono';
import LightLogo from '../src/assets/logo.png';
import DarkLogo from '../src/assets/darkLogo.png';

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
import News from './schema/news';

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

  const handleDeployment = async () => {
    if (confirm('배포를 하시겠습니까?')) {
      const url = 'https://api.github.com/repos/NAMSAN-MT/Namsan/dispatches';
      const githubPAT = import.meta.env.VITE_WEBHOOK_TOKEN;
      try {
        await fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/vnd.github.v3+json',
            Authorization: 'token ' + githubPAT,
          },
          body: JSON.stringify({
            event_type: 'TRIGGER_DEPLOYMENT',
          }),
        });
      } catch (error) {
        console.error(error);
        alert('Deploy failed');
      }
    }
  };

  return (
    <Router>
      <SnackbarProvider>
        <ModeControllerProvider value={cms.modeController}>
          <FireCMS
            name={'NAMSAN'}
            authController={cms.authController}
            collections={[Work, Members, News]}
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
                    logo={cms.isDarkMode ? LightLogo : DarkLogo}
                    title={'NAMSAN'}
                  />
                );
              } else {
                component = (
                  <Scaffold
                    name={'NAMSAN'}
                    logo={cms.isDarkMode ? LightLogo : DarkLogo}
                    autoOpenDrawer
                  >
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                      }}
                    >
                      <button
                        style={{
                          width: '100px',
                          height: '40px',
                          backgroundColor: '#0070f4',
                          marginRight: '24px',
                          marginTop: '10px',
                          borderRadius: '7px',
                          fontWeight: 'bold',
                          padding: '10px 30px',
                        }}
                        onClick={handleDeployment}
                      >
                        Deploy
                      </button>
                    </div>
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
