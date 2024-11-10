import Github from "@/shared/icons/Github.tsx";
import Google from "@/shared/icons/Google.tsx";
import Twitter from "@/shared/icons/Twitter.tsx";

export function LoginForm() {
  return (
    <div className="max-w-md flex flex-col gap-4 card bg-base-100 shadow-xl p-8 m-auto mt-32">
      <h2 className="text-2xl font-bold text-center mb-8">로그인</h2>

      <div className="space-y-4">
        <button className="btn btn-outline w-full">
          <Google className="w-5 h-5" />
          구글로 계속하기
        </button>

        <button className="btn btn-twitter w-full">
          <Twitter className="w-5 h-5" />
          트위터로 계속하기
        </button>

        <button className="btn btn-primary w-full">
          <Github className="w-5 h-5" />
          깃허브로 계속하기
        </button>
      </div>
    </div>
  );
}
