import { SospesoApplicationDashboard, type SospesoApplicationDto } from '@/components/SospesoApplicationDashboard.tsx';

export function SospesoApplicationDashboardWithActions({
    applicationList,
  }: {
    applicationList: SospesoApplicationDto[];
  }) {
    return (
      <SospesoApplicationDashboard
        applicationList={applicationList}
        actions={{
          approveApplication: async () => {
            // TODO! 실제 action 연결해줘야 함
          },
          rejectApplication: async () => {
            // TODO! 실제 action 연결해줘야 함
          },
        }}
      />
    );
  }