'use client';

import Link from 'next/link';
import UserExamSubmitList from './components/UserExamSubmitList';
import { useEffect, useState } from 'react';
import Loading from '@/app/loading';
import Image from 'next/image';
import codeImg from '@/public/images/code.png';
import axiosInstance from '@/app/utils/axiosInstance';
import { ProblemInfo } from '@/app/types/problem';
import { userInfoStore } from '@/app/store/UserInfo';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchCurrentUserInfo } from '@/app/utils/fetchCurrentUserInfo';
import { UserInfo } from '@/app/types/user';

// 문제 정보 조회 API
const fetchExamProblemDetailInfo = ({ queryKey }: any) => {
  const problemId = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/problem/${problemId}`,
  );
};

interface DefaultProps {
  params: {
    eid: string;
    problemId: string;
  };
}

export default function UserExamSubmits(props: DefaultProps) {
  const eid = props.params.eid;
  const problemId = props.params.problemId;

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['examProblemDetailInfo', problemId],
    queryFn: fetchExamProblemDetailInfo,
    retry: 0,
  });

  const resData = data?.data.data;
  const examProblemInfo: ProblemInfo = resData;

  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);

  const [isLoading, setIsLoading] = useState(true);

  const currentTime = new Date();
  const contestStartTime = new Date(examProblemInfo?.parentId.testPeriod.start);
  const contestEndTime = new Date(examProblemInfo?.parentId.testPeriod.end);

  const router = useRouter();

  useEffect(() => {
    // (로그인 한) 사용자 정보 조회 및 관리자 권한 확인, 그리고 게시글 작성자인지 확인
    fetchCurrentUserInfo(updateUserInfo).then((userInfo: UserInfo) => {
      if (examProblemInfo) {
        const isContestant = examProblemInfo.parentId.students.some(
          (student_id) => student_id === userInfo._id,
        );

        if (
          isContestant &&
          contestStartTime <= currentTime &&
          currentTime < contestEndTime
        ) {
          setIsLoading(false);
          return;
        }

        alert('접근 권한이 없습니다.');
        router.back();
      }
    });
  }, [updateUserInfo, examProblemInfo, eid, router]);

  if (isLoading) return <Loading />;

  return (
    <div className="mt-2 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[60rem] mx-auto">
        <div className="flex flex-col gap-8">
          <p className="flex items-center text-2xl font-semibold tracking-tight">
            <Image
              src={codeImg}
              alt="code"
              width={70}
              height={0}
              quality={100}
              className="ml-[-1rem] fade-in-fast drop-shadow-lg"
            />
            <div className="lift-up">
              <span className="ml-4 text-3xl font-semibold tracking-wide">
                내 제출 현황
              </span>
              <Link
                href={`/exams/${eid}/problems/${problemId}`}
                className="mt-1 ml-1 text-xl font-medium cursor-pointer hover:underline hover:text-[#0038a8] focus:underline focus:text-[#0038a8] text-[#1048b8]"
              >
                ({examProblemInfo.title})
              </Link>
            </div>
          </p>

          <div className="flex justify-end pb-3 border-gray-300">
            <div className="flex gap-3">
              <span className="font-semibold">
                시험명: <span className="font-light">코딩테스트 1차</span>
              </span>
              <span className='relative bottom-[0.055rem] font-thin before:content-["|"]' />
              <span className="font-semibold">
                수업명:{' '}
                <span className="font-light">
                  2023-01-자료구조(소프트웨어학부 01반)
                </span>
              </span>
            </div>
          </div>
        </div>

        <section className="dark:bg-gray-900">
          <UserExamSubmitList eid={eid} problemId={problemId} />
        </section>
      </div>
    </div>
  );
}
