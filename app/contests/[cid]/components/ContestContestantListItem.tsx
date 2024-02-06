'use client';

import { userInfoStore } from '@/app/store/UserInfo';
import { ContestInfo } from '@/app/types/contest';
import { maskEmail, maskString } from '@/app/utils/maskString';

interface ContestContestantListItemProps {
  contestantInfo: ContestInfo['contestants'][number]; // This denotes a single contestant object
}

export default function ContestContestantListItem(
  props: ContestContestantListItemProps,
) {
  const { contestantInfo } = props;

  const userInfo = userInfoStore((state: any) => state.userInfo);

  return (
    <tr className="border-b dark:border-gray-700 text-xs text-center">
      <th
        scope="row"
        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {userInfo.no === contestantInfo.no ? (
          <>{contestantInfo.no}</>
        ) : (
          <>{maskString(contestantInfo.no, 4, contestantInfo.no.length)}</>
        )}
      </th>
      <td className="font-medium">
        {userInfo.no === contestantInfo.no ? (
          <>{contestantInfo.name}</>
        ) : (
          <>{maskString(contestantInfo.name, 1, contestantInfo.name.length)}</>
        )}
      </td>
      <td className="font-medium">{contestantInfo.university}</td>
      <td className="font-medium">{contestantInfo.department}</td>
      <td className="font-medium">
        {userInfo.no === contestantInfo.no ? (
          <>{contestantInfo.email}</>
        ) : (
          <>{maskEmail(contestantInfo.email)}</>
        )}
      </td>
    </tr>
  );
}
