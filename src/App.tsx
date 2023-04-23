import { FirebaseCMSApp } from 'firecms';
import 'typeface-rubik';
import '@fontsource/ibm-plex-mono';
import { firebaseConfig } from './api/firebase';
import UseAuth from './hooks/useAuth';
import Work from './schema/work';

export default function App() {
  const myAuthenticator = UseAuth();
  return (
    <FirebaseCMSApp
      name={'NAMSAN'}
      authentication={myAuthenticator}
      collections={[Work]}
      firebaseConfig={firebaseConfig}
    />
  );
}
