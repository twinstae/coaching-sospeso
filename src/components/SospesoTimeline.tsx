import { Bean } from "@/shared/icons/Bean";
import { Coffee } from "@/shared/icons/Coffee";
import { Letter } from "@/shared/icons/Letter";
import type { SospesoStatus } from "@/sospeso/domain";

export function SospesoTimeline({
  status = "issued",
}: {
  status: SospesoStatus;
}) {
  return (
    <ul className="timeline">
      <li>
        <div className="timeline-middle">
          <div className="w-[43px] h-[43px] bg-white rounded-full flex justify-center items-center">
            {status === "issued" ||
            status === "pending" ||
            status === "consumed" ? (
              <Bean color="#FFD362" />
            ) : null}
          </div>
        </div>
        <div className="timeline-end timeline-box bg-transparent border-transparent shadow-none">
          발행
        </div>
        <hr className="bg-white" />
      </li>
      <li>
        <hr className="bg-white" />
        <div className="timeline-middle">
          <div className="w-[43px] h-[43px] bg-white rounded-full flex justify-center items-center">
            {status === "pending" || status === "consumed" ? (
              <Coffee color="#FFD362" />
            ) : null}
          </div>
        </div>
        <div className="timeline-end timeline-box bg-transparent border-transparent shadow-none">
          신청
        </div>
        <hr className="bg-white" />
      </li>
      <li>
        <hr className="bg-white" />
        <div className="timeline-middle">
          <div className="w-[43px] h-[43px] bg-white rounded-full flex justify-center items-center">
            {status === "consumed" ? <Letter color="#FFD362" /> : null}
          </div>
        </div>
        <div className="timeline-end timeline-box bg-transparent border-transparent shadow-none">
          사용
        </div>
      </li>
    </ul>
  );
}

// ! 테스트 코드까지
