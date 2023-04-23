import { User as FirebaseUser } from 'firebase/auth';
import { Authenticator } from 'firecms';

export default function UseAuth() {
  const myAuthenticator: Authenticator<FirebaseUser> = async (arg: any) => {
    if (arg.user?.email?.includes('flanders')) {
      throw Error('Stupid Flanders!');
    }

    const sampleUserRoles = await Promise.resolve(['admin']);
    arg.authController.setExtra(sampleUserRoles);

    return true;
  };
  return myAuthenticator;
}
