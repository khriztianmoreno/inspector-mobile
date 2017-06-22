/**
 * Auth Reducer
 */

const initialState = {
  logged: false,
  token: null,
  sessionData: null,
};

export default function auth(state = initialState, action) {
  switch (action.type) {
  case 'LOGGING_USER':
    return {
      logged: true,
      token: action.token,
      email: action.email,
      sessionData: action.sessionData,
    };
  case 'LOGOUT_USER':
    return {
      ...initialState,
    };
  default:
    return state;
  }
}
