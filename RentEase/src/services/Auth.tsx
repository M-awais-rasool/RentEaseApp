import {API} from '../api/api';

async function SignIn(data: any) {
  console.log()
  const res = await API.post('Auth/sign-in', data);
  return res;
}

async function SignUp(data: any) {
  console.log()
  const res = await API.post('Auth/sign-up', data);
  return res;
}

export {SignIn, SignUp};
