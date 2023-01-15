import { useState, useEffect } from 'react';

import { useAuth } from 'oidc-react';
function SilentRenew() {
  const { userManager } = useAuth();

  const [isRenewing, setIsRenewing] = useState(true);

  useEffect(() => {
    userManager
      .signinSilentCallback()
      .then(() => {
        setIsRenewing(false);
        window.location.hash = '/';
      })
      .catch((error) => {
        setIsRenewing(false);
        window.location.hash = '/login';
      });
  }, []);

  if (isRenewing) {
    return <div>Renewing...</div>;
  }

  return null;
}

export default SilentRenew;
