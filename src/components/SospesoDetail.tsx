import {
  browserClipboardApi,
  type ClipboardApiI,
} from "@/adapters/clipboardApi";
import { toastifyToastApi, type ToastApiI } from "@/adapters/toastApi.tsx";
import { href } from "@/routing/href.ts";
import { Link } from "@/routing/Link.tsx";

export function SospesoDetail({
  sospeso,
  clipboardApi = browserClipboardApi,
  toastApi = toastifyToastApi,
}: {
  sospeso:
    | {
        id: string;
        from: string;
        to: string;
        status: "issued" | "pending";
        consuming: undefined;
      }
    | {
        id: string;
        from: string;
        to: string;
        status: "consumed";
        consuming: {
          consumer: { id: string; nickname: string };
          content: string;
        };
      };
  clipboardApi?: ClipboardApiI;
  toastApi?: ToastApiI;
}) {
  return (
    <div>
      <p>From. {sospeso.from}</p>
      <p>To. {sospeso.to}</p>
      {sospeso.status === "issued" && (
        <Link
          className="btn btn-primary"
          routeKey="소스페소-신청"
          params={{ sospesoId: sospeso.id }}
        >
          신청하기
        </Link>
      )}

      {sospeso.status === "pending" && (
        <div
          role="tooltip"
          id="pendingSospeso"
          data-tip="승인을 기다리고 있는 소스페소입니다."
          className="tooltip"
        >
          <button
            aria-describedby="pendingSospeso"
            className="btn btn-primary !pointer-events-auto"
            disabled
          >
            대기중
          </button>
        </div>
      )}

      {sospeso.status === "consumed" && <img alt="사용됨" />}

      {sospeso.status === "consumed" && (
        <div>
          <span>{sospeso.consuming.consumer.nickname}</span>
          <p>{sospeso.consuming.content}</p>
        </div>
      )}

      <button
        className="btn btn-primary"
        onClick={async () => {
          try {
            await clipboardApi.copy(
              window.origin + href("소스페소-상세", { sospesoId: sospeso.id }),
            );
            toastApi.toast("소스페소 링크를 복사했어요!", "success");
          } catch {
            toastApi.toast("복사 권한을 허용했는지 확인해 주세요.", "error");
          }
        }}
      >
        공유 링크 복사하기
      </button>
    </div>
  );
}
