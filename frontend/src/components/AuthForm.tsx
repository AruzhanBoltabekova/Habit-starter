import {API_URL} from "@/utils";
import axios from "axios";
import {useState} from "react";

type AuthForm = 'login' | 'register';

type AuthReq = {
  email: string;
  password: string;
}

type AuthResponse = {
  data: {
    email: string
    id: number
    jwt: string
  }
}

const AuthForm = () => {
  const [password, setPassword] = useState('password');
  const [email, setEmail] = useState('user@example.com');
  const [loginError, setLoginError] = useState<any | null>(null);
  const [type, setType] = useState<AuthForm>('login');

  return (
    <div>
      <header className={'flex items-center justify-between py-3'}>
        <span>
          <h1 className={'h1'}>{type.toLocaleUpperCase()}</h1>
        </span>
        <select onChange={(e) => setType(e.target.value as AuthForm)}>
          <option value={'login'}>Login</option>
          <option value={'register'}>Register</option>
        </select>
      </header>
      <hr/>
      <form className={'space-y-4 py-4'} onSubmit={async e => {
        e.preventDefault();

        const reqUrl = `${API_URL}/api/${type}`;
        const reqData: AuthReq = {email, password};

        try {
          const response = await axios.post(reqUrl, reqData);
          localStorage.setItem('jwt', response.data.jwt);
          localStorage.setItem('userId', response.data.id);
          console.log(response.data)
        } catch (error) {
          // @ts-expect-error - error is an AxiosError
          setLoginError(`${error.code} - ${error.message}`);
        }

      }}>
        <input type={'email'} required value={email} onChange={(e) => setEmail(e.target.value)}/>
        <input type={'password'} required value={password} min={1} onChange={(e) => setPassword(e.target.value)}/>
        <input type={'submit'} value={type} className={'btn'}/>
      </form>
      {loginError && <div className={'bg-red-300'}>{loginError}</div>}
    </div>
  );
};

export default AuthForm;
