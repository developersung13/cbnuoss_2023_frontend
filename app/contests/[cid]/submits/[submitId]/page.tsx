'use client';

import { OPERATOR_ROLES } from '@/app/constants/role';
import Loading from '@/app/loading';
import { userInfoStore } from '@/app/store/UserInfo';
import { ContestSubmitInfo } from '@/app/types/contest';
import { SubmitInfo } from '@/app/types/submit';
import { UserInfo } from '@/app/types/user';
import axiosInstance from '@/app/utils/axiosInstance';
import { fetchCurrentUserInfo } from '@/app/utils/fetchCurrentUserInfo';
import { formatDateToYYMMDDHHMMSS } from '@/app/utils/formatDate';
import { getCodeSubmitResultTypeDescription } from '@/app/utils/getCodeSubmitResultTypeDescription';
import { getLanguageCode } from '@/app/utils/getLanguageCode';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// 코드 제출 정보 조회 API
const fetchSubmitInfo = ({ queryKey }: any) => {
  const submitId = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/submit/${submitId}`,
  );
};

interface DefaultProps {
  params: {
    cid: string;
    submitId: string;
  };
}

const MarkdownPreview = dynamic(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false },
);

export default function UsersContestSubmit(props: DefaultProps) {
  const cid = props.params.cid;
  const submitId = props.params.submitId;

  const { isPending, data } = useQuery({
    queryKey: ['submitInfo', submitId],
    queryFn: fetchSubmitInfo,
  });

  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);

  const resData = data?.data.data;
  const submitInfo: SubmitInfo = resData;

  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const handleGoToContestSubmits = () => {
    router.push(`/contests/${cid}/submits`);
  };

  // 페이지 접근 권한 설정
  useEffect(() => {
    fetchCurrentUserInfo(updateUserInfo).then((userInfo: UserInfo) => {
      if (submitInfo) {
        if (
          userInfo.isAuth &&
          ((OPERATOR_ROLES.includes(userInfo.role) &&
            userInfo._id === submitInfo.parentId.writer._id) ||
            submitInfo.parentId.contestants[0] === userInfo._id)
        ) {
          setIsLoading(false);
          return;
        }

        alert('접근 권한이 없습니다.');
        router.back();
      }
    });
  }, [updateUserInfo, submitInfo, router]);

  if (isLoading || isPending) return <Loading />;

  return (
    <div className="mt-6 mb-24 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[60rem] mx-auto">
        <div className="flex justify-end items-center pb-3">
          <button
            onClick={handleGoToContestSubmits}
            className="flex justify-center items-center gap-[0.375rem] text-[#f9fafb] bg-[#717171] px-2 py-[0.45rem] rounded-[6px] focus:bg-[#686868] hover:bg-[#686868]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="17.5"
              viewBox="0 -960 960 960"
              width="17.5"
              fill="white"
            >
              <path d="m313-440 196 196q12 12 11.5 28T508-188q-12 11-28 11.5T452-188L188-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l264-264q11-11 27.5-11t28.5 11q12 12 12 28.5T508-715L313-520h447q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H313Z" />
            </svg>
            뒤로가기
          </button>
        </div>
        <div className="border-y border-[#e4e4e4] border-t-2 border-t-gray-400">
          <MarkdownPreview
            className="markdown-preview"
            source={`
\`\`\`${getLanguageCode(submitInfo.language)}
${submitInfo.code}`}
          />
        </div>

        <div className="relative mt-10 dark:bg-gray-800 overflow-hidden rounded-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase dark:text-gray-400 text-center">
                <tr>
                  <th scope="col" className="px-4 py-2">
                    대회명
                  </th>
                  <th scope="col" className="px-4 py-2">
                    문제명
                  </th>
                  <th scope="col" className="px-4 py-2">
                    이름
                  </th>
                  <th scope="col" className="px-4 py-2">
                    결과
                  </th>
                  <th scope="col" className="px-4 py-2">
                    메모리
                  </th>
                  <th scope="col" className="px-4 py-2">
                    시간
                  </th>
                  <th scope="col" className="px-4 py-2">
                    언어
                  </th>
                  <th scope="col" className="px-4 py-2">
                    제출 시간
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t dark:border-gray-700 text-xs text-center bg-[#f9f9f9]">
                  <th
                    scope="row"
                    className="py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {submitInfo.parentId.title}
                  </th>
                  <td className="">{submitInfo.problem.title}</td>
                  <td className="">{submitInfo.user.name}</td>
                  <td
                    className={`${
                      submitInfo.result.type === 'done'
                        ? 'text-[#0076C0]'
                        : 'text-red-500'
                    } font-semibold`}
                  >
                    {getCodeSubmitResultTypeDescription(submitInfo.result.type)}
                  </td>
                  <td>
                    <span>
                      {(submitInfo.result.memory / 1048576).toFixed(2)}{' '}
                    </span>
                    <span className="ml-[-1px] text-red-500">KB</span>
                  </td>
                  <td className="">
                    <span>{submitInfo.result.time} </span>{' '}
                    <span className="ml-[-1px] text-red-500">ms</span>
                  </td>
                  <td className="">{submitInfo.language}</td>
                  <td className="">
                    {formatDateToYYMMDDHHMMSS(submitInfo.createdAt)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="flex gap-3 justify-end"></div>
        </div>
      </div>
    </div>
  );
}
