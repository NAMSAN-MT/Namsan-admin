import { GoogleAuthProvider } from 'firebase/auth';
import {
  createCMSDefaultTheme,
  FirebaseAuthController,
  useBuildModeController,
  useFirebaseAuthController,
  useFirebaseStorageSource,
  useFirestoreDataSource,
  useInitialiseFirebase,
  useValidateAuthenticator,
  useBrowserTitleAndIcon,
} from 'firecms';
import { firebaseConfig } from '../api/firebase';
import { useMemo } from 'react';
import favicon from '../../src/assets/favicon.png';

const DEFAULT_SIGN_IN_OPTIONS = [GoogleAuthProvider.PROVIDER_ID];

export default function UseCms() {
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

  useBrowserTitleAndIcon('NAMSAN', favicon);

  const storageSource = useFirebaseStorageSource({ firebaseApp });
  const modeController = useBuildModeController();
  const theme = useMemo(
    () => createCMSDefaultTheme({ mode: modeController.mode }),
    [modeController.mode],
  );

  const { canAccessMainView } = useValidateAuthenticator({
    authController,
    authentication: async ({ user }: { user: any }) => {
      if (!user)
        throw new Error("You don't have permission to access this page.");

      if (user.email !== 'namsan.official@gmail.com') {
        window.alert('해당 페이지에 접근할 수 있는 권한이 없습니다.');
        throw new Error("You don't have permission to access this page.");
      }
      return true;
    },
    dataSource,
    storageSource,
  });

  const isDarkMode = modeController.mode === 'dark';

  return {
    firebaseConfigLoading,
    configError,
    firebaseConfigError,
    authController,
    dataSource,
    storageSource,
    modeController,
    theme,
    canAccessMainView,
    firebaseApp,
    signInOptions,
    isDarkMode,
  };
}
