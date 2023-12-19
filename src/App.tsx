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
import { db } from './api/firebase';
import { useState } from 'react';

export default function App() {
  const cms = UseCms();
  const [isWorking, setIsWorking] = useState(false);

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

  const checkIsGitActionWorking = async () => {
    const url = 'https://api.github.com/repos/NAMSAN-MT/Namsan/actions/runs';
    const result = await db.collection('config').get();
    const githubPAT = result.docs[0].data().WEBHOOK_TOKEN;
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: 'token ' + githubPAT,
        },
      });

      const data = await res.json();

      const workflow = data.workflow_runs[0];
      if (workflow.status === 'in_progress') {
        alert('현재 배포가 진행중입니다. 잠시 후 다시 시도해주세요.');
        return true;
      }

      return false;
    } catch (error) {
      alert('Get info failed');
      console.error(error);
    }
  };

  const handleDeployment = async () => {
    if (await checkIsGitActionWorking()) return;
    if (confirm('배포를 하시겠습니까?')) {
      const url = 'https://api.github.com/repos/NAMSAN-MT/Namsan/dispatches';
      const result = await db.collection('config').get();
      const githubPAT = result.docs[0].data().WEBHOOK_TOKEN;
      try {
        await fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/vnd.github+json',
            Authorization: 'token ' + githubPAT,
          },
          body: JSON.stringify({
            event_type: 'TRIGGER_DEPLOYMENT',
          }),
        });
        setIsWorking(true);
        setTimeout(() => {
          setIsWorking(false);
        }, 60000);
      } catch (error) {
        alert('Deploy failed');
        console.error(error);
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
            {(props: any) => {
              let component;
              if (props.loading) {
                component = <CircularProgressCenter />;
              } else if (!props.context.authController.user) {
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
                          opacity: isWorking ? 0.5 : 1,
                        }}
                        disabled={isWorking}
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
