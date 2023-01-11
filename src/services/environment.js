export const environment = {
  production: false,
  base_url: 'https://test.softrig.com/api/',
  authority: 'https://test-login.softrig.com',
  client_id: '6c96f499-4057-4bb7-9047-1e19bd96f9c0',
  redirect_uri: `${window.location.origin}/assets/auth.html`,
  post_logout_redirect_uri: window.location.origin,
  silent_redirect_uri: `${window.location.origin}/assets/silent-renew.html`,
  automaticSilentRenew: true,
  response_type: 'code',
  scope: 'AppFramework Sales.Admin openid profile',
  filterProtocolClaims: true, // prevents protocol level claims such as nbf, iss, at_hash, and nonce from being extracted from the identity token as profile data
  loadUserInfo: true,
};
