import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';

import axiosInstance, { endpoints } from 'src/lib/axios';

import { AuthContext } from '../auth-context';

import type { UserType, AuthState } from '../../types';
// ----------------------------------------------------------------------

/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<AuthState>({
    user: null,
    loading: true,
  });

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem('token');

      if (accessToken) {
        // While there is no dedicated 'me' endpoint for current session verification in the snippet provided,
        // we assume the token is valid or we can implement a check if available.
        // For now, we will assume if token exists, we are somewhat authenticated, but ideally we fetch user profile.
        // Based on the user request, the login response returns the account.
        // We persist the account in local storage or re-fetch it.
        // Since we don't have a 'me' endpoint documented, let's try to get it from storage or assume validation.

        // Actually, looking at axios config, we defined 'me': '/users/me'.
        // If that exists, we should use it. If not, we might need to rely on stored user data.
        // Let's check if we can store the user object in localStorage on login and retrieve it here.

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setState({ user: JSON.parse(storedUser), loading: false });
        } else {
          setState({ user: null, loading: false });
        }
      } else {
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const login = useCallback(
    async (payload: Record<string, any>) => {
      // Add device tracking info
      const loginData = {
        ...payload,
        device: 'Desktop',
        browser: navigator.userAgent.match(/Chrome\/([0-9.]+)/)
          ? `Chrome ${navigator.userAgent.match(/Chrome\/([0-9.]+)/)?.[1]}`
          : 'Unknown',
        os: navigator.platform || 'Unknown',
      };

      const res = await axiosInstance.post(endpoints.auth.signIn, loginData);
      const { token, account } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(account));

      setState({ user: account });
    },
    [setState]
  );

  const logout = useCallback(async () => {
    try {
      // Call logout endpoint to invalidate token on server
      await axiosInstance.post(endpoints.auth.signOut);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setState({ user: null });
    }
  }, [setState]);

  const updateUser = useCallback(
    (user: UserType) => {
      localStorage.setItem('user', JSON.stringify(user));
      setState({ user });
    },
    [setState]
  );

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user ? { ...state.user } : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      login,
      logout,
      updateUser,
    }),
    [checkUserSession, login, logout, updateUser, state.user, status]
  );

  return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}
