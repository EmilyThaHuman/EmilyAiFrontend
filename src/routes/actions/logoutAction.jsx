// actions/logoutAction.js
import { redirect } from 'react-router-dom';

import { dispatch } from 'store/index';

export async function logoutAction() {
  try {
    sessionStorage.clear();
    localStorage.clear();
    window.location.reload();
    return redirect('/');
  } catch (error) {
    console.error('Logout failed:', error);
    sessionStorage.clear();
    localStorage.clear();
    dispatch({ type: 'LOGOUT' });
    return redirect('/auth/sign-in');
  }
}
