import { Bean } from "@/shared/icons/Bean";
import { Coffee } from "@/shared/icons/Coffee";
import { Letter } from "@/shared/icons/Letter";
import type { SospesoStatus } from "@/sospeso/domain";

export function SospesoTimeline({
  status = "issued",
}: {
  status: SospesoStatus;
}) {
  const issued =
    status === "issued" || status === "pending" || status === "consumed";

  const pending = status === "pending" || status === "consumed";

  const consumed = status === "consumed";

  return (
    <ul className="timeline">
      <li aria-label="발행됨" aria-current={issued ? "step" : undefined}>
        <div className="timeline-middle">
          <div className="w-icon-size h-icon-size bg-white rounded-full flex justify-center items-center">
            {issued ? <Bean color="#FFD362" /> : null}
          </div>
        </div>
        <div className="timeline-end timeline-box bg-transparent border-transparent shadow-none">
          발행
        </div>
        <hr className="bg-white" />
      </li>
      <li aria-label="신청됨" aria-current={pending ? "step" : undefined}>
        <hr className="bg-white" />
        <div className="timeline-middle">
          <div className="w-icon-size h-icon-size bg-white rounded-full flex justify-center items-center">
            {pending ? <Coffee color="#FFD362" /> : null}
          </div>
        </div>
        <div className="timeline-end timeline-box bg-transparent border-transparent shadow-none">
          신청
        </div>
        <hr className="bg-white" />
      </li>
      <li aria-label="사용됨" aria-current={consumed ? "step" : undefined}>
        <hr className="bg-white" />
        <div className="timeline-middle">
          <div className="w-icon-size h-icon-size bg-white rounded-full flex justify-center items-center">
            {consumed ? <Letter color="#FFD362" /> : null}
          </div>
        </div>
        <div className="timeline-end timeline-box bg-transparent border-transparent shadow-none">
          사용
        </div>
      </li>
    </ul>
  );
}
