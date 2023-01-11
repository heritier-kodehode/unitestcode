import { useEffect, useState } from 'react';
import { environment } from './environment';
import { UserManager } from 'oidc-client';

const settings = {
  authority: environment.authority,
  client_id: environment.client_id,
  redirect_uri: environment.redirect_uri,
  post_logout_redirect_uri: environment.post_logout_redirect_uri,
  response_type: environment.response_type,
  scope: environment.scope,
  filterProtocolClaims: environment.filterProtocolClaims,
  loadUserInfo: environment.loadUserInfo,
  automaticSilentRenew: true,
  silent_redirect_uri: environment.silent_redirect_uri,
};

const AuthService = () => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [authHeaders, setAuthHeaders] = useState({});

  const config = settings;

  const userManager = new UserManager(config);

  const login = () => {
    userManager.signinRedirect().catch((error) => {
      console.log(error);
    });
  };

  const logout = () => {
    userManager.signoutRedirect();
  };

  const getAccessToken = async () => {
    const user = await userManager.getUser();
    if (!user) {
      await userManager.signinSilent();
      return await userManager.getUser().then((u) => {
        if (!u) {
          throw new Error('Failed to get user');
        }
        setUser(u);
        setAuthHeaders({
          headers: new Headers({
            'Authorization': `Bearer ${u.access_token}`,
          }),
        });
        setLoggedIn(true);
        return u.access_token;
      });
    } else {
      setAuthHeaders({
        headers: new Headers({
          'Authorization': `Bearer ${user.access_token}`,
        }),
      });
      setLoggedIn(true);
      return user.access_token;
    }
  };

  useEffect(() => {
    userManager.getUser().then((user) => {
      if (user) {
        setUser(user);
        setLoggedIn(true);
      }
    });
  }, []);

  return {
    user,
    loggedIn,
    authHeaders,
    login,
    logout,
    getAccessToken,
  };
};

export default AuthService;
