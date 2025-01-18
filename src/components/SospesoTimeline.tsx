import { Bean } from "@/shared/icons/Bean";
import { Coffee } from "@/shared/icons/Coffee";
import { Letter } from "@/shared/icons/Letter";

export function SospesoTimeline() {
  return (
    <ul className="timeline">
      <li>
        <div className="timeline-middle">
          <div className="w-[43px] h-[43px] bg-white rounded-full flex justify-center items-center">
            <Bean color="#FFD362" />
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
            <Coffee color="#FFD362" />
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
            <Letter color="#FFD362" />
          </div>
        </div>
        <div className="timeline-end timeline-box bg-transparent border-transparent shadow-none">
          사용
        </div>
      </li>
    </ul>
  );
}
