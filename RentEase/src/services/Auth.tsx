import {API} from '../api/api';

async function SignIn(data: any) {
  const res = await API.post('Auth/sign-in', data);
  return res;
}

async function SignUp(data: any) {
  const res = await API.post('Auth/sign-up', data);
  return res;
}

export {SignIn, SignUp};
