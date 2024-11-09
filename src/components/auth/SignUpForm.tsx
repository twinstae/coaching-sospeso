import { authApi } from '@/adapters/authApi';

export function SignUpForm() {
  return (
    <button
    className='btn btn-primary'
      onClick={async () => {
        authApi.signUp.email({
            email: 'test@test.com',
            password: '12341234',
            name: '김토끼',
            phone: '010-1234-1234',
            nickname: '흰'
        })
      }}
    >회원가입하기!</button>
  );
}
