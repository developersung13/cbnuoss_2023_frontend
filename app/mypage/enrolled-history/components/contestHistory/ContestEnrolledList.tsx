'use client';

import Loading from '@/app/loading';
import EmptyContestEnrolledListItem from './EmptyContestEnrolledListItem';
import ContestEnrolledListItem from './ContestEnrolledListItem';
import axiosInstance from '@/app/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { ContestEnrolledInfo } from '@/app/types/contest';

// 참가했던 대회 목록 반환 API
const fetchEnrolledContests = () => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/contest/enroll/me`,
  );
};

export default function ContestEnrolledList() {
  const { isPending, data } = useQuery({
    queryKey: ['myEnrolledContests'],
    queryFn: fetchEnrolledContests,
  });

  const resData = data?.data.data;
  const numberOfItems = resData?.length;

  if (isPending) return <Loading />;

  return (
    <div className="mx-auto mt-6 w-full">
      <div className="border dark:bg-gray-800 relative overflow-hidden rounded-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 text-center">
              <tr>
                <th scope="col" className="w-16 px-4 py-2">
                  번호
                </th>
                <th scope="col" className="px-4 py-2">
                  대회명
                </th>
              </tr>
            </thead>
            <tbody>
              {numberOfItems === 0 && <EmptyContestEnrolledListItem />}
              {resData?.map(
                (contestEnrolledInfo: ContestEnrolledInfo, index: number) => (
                  <ContestEnrolledListItem
                    contestEnrolledInfo={contestEnrolledInfo}
                    total={numberOfItems}
                    index={index}
                    key={index}
                  />
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
