import { authApi } from "@/adapters/authApi";
import { Link } from "@/routing/Link";
import { navigate } from "@/routing/navigate";

export function LoginForm() {
  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={async () => {
          authApi.login
            .magicLink({
              email: "test@test.com",
            })
            .then(() => {
              navigate("가짜-이메일-인박스", { 
                emailAddress: "test@test.com", });
            });
        }}
      >
        로그인
      </button>

      <Link
        className="btn btn-info"
        routeKey="가짜-이메일-인박스"
        params={{
          emailAddress: "test@test.com",
        }}
      >
        인박스로 가기
      </Link>
    </div>
  );
}
