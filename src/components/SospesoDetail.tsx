import {
  Tooltip,
  TooltipAnchor,
  TooltipProvider,
} from "@ariakit/react/tooltip";

import {
  browserClipboardApi,
  type ClipboardApiI,
} from "@/adapters/clipboardApi";
import { toastifyToastApi, type ToastApiI } from "@/adapters/toastApi.tsx";
import { href } from "@/routing/href.ts";
import { Link } from "@/routing/Link.tsx";
import { SospesoLogo } from "@/shared/icons/SospesoLogo";
import { format년월일 } from "@/adapters/dateApi";

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
        issuedAt: Date;
        consuming: undefined;
      }
    | {
        id: string;
        from: string;
        to: string;
        status: "consumed";
        issuedAt: Date;
        consuming: {
          consumer: { id: string; nickname: string };
          content: string;
        };
      };
  clipboardApi?: ClipboardApiI;
  toastApi?: ToastApiI;
}) {
  return (
    <div className="max-w-md m-auto mt-4">
      <div className="flex flex-col gap-4 card bg-base-100 shadow-xl p-8">
        <div className="flex justify-between">
          <p>
            <strong className="font-bold uppercase">From.</strong>{" "}
            {sospeso.from}
          </p>

          <time className="text" dateTime={sospeso.issuedAt.toISOString()}>
            {format년월일(sospeso.issuedAt)}
          </time>
        </div>
        <div className="flex gap-4 font-bold items-center uppercase mt-2 border-b-2 border-black">
          <div className="text-2xl">To.</div>
          <div className="text-3xl">{sospeso.to}</div>
        </div>

        <p>
          코칭 2회 이용권 (1회기 평균 1시간 반)
        </p>
      </div>
      <div className="flex justify-around p-2 gap-2 flex-col">
        {sospeso.status === "issued" && (
          <a
            className="btn btn-primary  w-full"
            href="https://docs.google.com/forms/d/e/1FAIpQLSeMsxctQJib-YI7Y9OO-PkOc7aNn52XaKvruErDERg6RYPiRw/viewform"
            target="_blank"
          >
            신청하기
          </a>
        )}

        {sospeso.status === "pending" && (
          <TooltipProvider timeout={100}>
            <TooltipAnchor
              render={
                <button
                  aria-describedby="pendingSospeso"
                  className="btn aria-disabled:btn-gray cursor-wait"
                  aria-disabled="true"
                >
                  <span className="loading loading-spinner"></span>
                  대기중
                </button>
              }
            />
            <Tooltip className="tooltip tooltip-content">
              이미 신청한 사람이 있어 코칭을 기다리고 있습니다
            </Tooltip>
          </TooltipProvider>
        )}

        <button
          className="btn btn-secondary w-full"
          onClick={async () => {
            try {
              await clipboardApi.copy(
                window.origin +
                  href("소스페소-상세", { sospesoId: sospeso.id }),
              );
              toastApi.toast("소스페소 링크를 복사했어요!", "success");
            } catch {
              toastApi.toast("복사 권한을 허용했는지 확인해 주세요.", "error");
            }
          }}
        >
          공유하기
        </button>
      </div>

      {sospeso.status === "consumed" && <div className="stamp">사용함</div>}

      {sospeso.status === "consumed" && (
        <div>
          <span>{sospeso.consuming.consumer.nickname}</span>
          <p>{sospeso.consuming.content}</p>
        </div>
      )}
    </div>
  );
}
