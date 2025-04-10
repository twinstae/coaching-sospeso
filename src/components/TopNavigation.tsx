import { authApi } from "@/adapters/authApi";
import { Link } from "@/routing/Link.tsx";
import { SospesoLogo } from "@/shared/icons/SospesoLogo";
import { useEffect, useState } from "react";

export function TopNavigation() {
  const [user, setUser] = useState<
    | {
        id: string;
        nickname: string;
        role: "user" | "admin";
      }
    | undefined
  >(undefined);

  useEffect(() => {
    authApi
      .fetchCurrentUser()
      .then((user) => {
        setUser(user);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link
          className="btn btn-ghost text-xl"
          routeKey="홈"
          params={{ page: 1 }}
        >
          <SospesoLogo aria-label="코칭 소스페소" className="w-full h-12" />
        </Link>
      </div>
      <div className="flex-none">
        {user ? (
          <Link routeKey="프로필" params={undefined} className="btn btn-ghost">
            프로필
          </Link>
        ) : (
          <Link routeKey="로그인" params={{}} className="btn btn-ghost">
            로그인
          </Link>
        )}
      </div>
    </div>
  );
}
