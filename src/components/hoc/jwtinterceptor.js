import { useAuth } from 'oidc-react';

export const JWTInterceptor = () => {
  const { userManager } = useAuth();
  const auth = useAuth();

  const handleUnauthorized = async (response) => {
    if (response.status === 401) {
      try {
        await userManager.signinSilent();
        return true;
      } catch (error) {
        console.error(error);
      }
    }
    return false;
  };

  const fetchData = async (url, options) => {
    try {
      // Get the current access token
      const user = await userManager.getUser();
      if (!auth.userData) {
        throw new Error('Not authenticated');
      }
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${auth.userData.access_token}`,
      };

      // Perform the fetch request
      let response = await fetch(url, options);

      // Check if the response is unauthorized
      if (await handleUnauthorized(response)) {
        // Get the renewed access token
        const renewedUser = await userManager.getUser();
        options.headers.Authorization = `Bearer ${renewedUser.access_token}`;
        // Perform the fetch request again with the renewed token
        response = await fetch(url, options);
      }

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return { fetchData };
};
