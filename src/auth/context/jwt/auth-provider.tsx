import cookies from 'js-cookie';
import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';

import { decodeToken } from 'src/utils/decode';

import axios, { endpoints } from 'src/lib/axios';

import { AuthContext } from '../auth-context';

import type { AuthState } from '../../types';
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
    user: {
      id: 'admin-id',
      username: 'admin',
      displayName: 'Admin User',
      email: 'admin@polimax.com',
      photoURL: '',
      role: 'admin',
      roles: ['admin'],
      phone: '+998 90 123 45 67',
      authProvider: 'jwt',
      lastSeen: new Date().toISOString(),
      status: 'active',
    },
    loading: false,
  });

  const checkUserSession = useCallback(async () => {
    setState({ loading: false });
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;
  const memoizedValue = useMemo(
    () => ({
      user: state.user ? { ...state.user } : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}
