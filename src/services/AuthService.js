import { useEffect, useState, createContext } from 'react';
import { UserManager } from 'oidc-client';
export const AuthServiceContext = createContext();
/*const settings = {
  production: new Boolean(process.env.PRODUCTION),
  base_url: process.env.BASE_URL,
  authority: process.env.AUTHORITY,
  client_id: process.env.CLIENT_ID,
  redirect_uri: process.env.REDIRECT_URI,
  post_logout_redirect_uri: process.env.POST_LOGOUT_REDIRECT_URI,
  response_type: process.env.RESPONSE_TYPE,
  scope: process.env.SCROPE,
  filterProtocolClaims: new Boolean(process.env.FILTER_PROTOCO_CLAIMS),
  loadUserInfo: process.env.LOAD_USER_INFO,
  automaticSilentRenew: new Boolean(process.env.AUTOMATIC_SILENT_RENEW),
  silent_redirect_uri: new Boolean(process.environment.SILENT_REDIRECT_URI),
};*/
const settingsValues = {
  base_url: 'https://test.softrig.com/api/',
  authority: 'https://test-login.softrig.com',
  client_id: '6c96f499-4057-4bb7-9047-1e19bd96f9c0',
  redirect_uri: 'http://localhost:3000/',
  post_logout_redirect_uri: 'http://localhost:3000/login',
  silent_redirect_uri: 'http://localhost:3000/',
  automaticSilentRenew: true,
  response_type: 'code',
  silentRenew: true,
  scope: 'AppFramework Sales.Admin openid profile',
  loadUserInfo: true,
};

function AuthService({ Children }) {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [authHeaders, setAuthHeaders] = useState({});

  const config = settingsValues;

  const userManager = new UserManager(config);

  const login = () => {
    userManager.signinRedirect().catch((error) => {
      console.error(error);
    });
  };

  const logout = () => {
    userManager.signoutRedirect();
  };

  const getAccessToken = async () => {
    let user = await userManager.getUser();
    if (!user) {
      await userManager.signinSilent();
      user = await userManager.getUser();
    }
    if (!user) {
      throw new Error('Failed to get user');
    }
    setUser(user);
    setAuthHeaders({
      headers: new Headers({
        'Authorization': `Bearer ${user.access_token}`,
      }),
    });
    setLoggedIn(true);
    return user.access_token;
  };

  useEffect(() => {
    const checkUser = async () => {
      const user = await userManager.getUser();
      if (user) {
        setUser(user);
        setLoggedIn(true);
      } else {
        setUser(null);
        setLoggedIn(false);
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    const renewToken = async () => {
      if (loggedIn) {
        const user = await userManager.getUser();
        if (user.expired) {
          try {
            await userManager.signinSilent();
          } catch (error) {
            console.error(error);
          }
        }
      }
    };
    renewToken();
  }, [loggedIn]);

  const methods = {
    user,
    loggedIn,
    authHeaders,
    login,
    logout,
    getAccessToken,
  };

  return (
    <AuthServiceContext.Provider value={methods}>
      {Children}
    </AuthServiceContext.Provider>
  );
}

export default AuthService;
