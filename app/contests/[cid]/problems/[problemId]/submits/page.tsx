'use client';

import Link from 'next/link';
import UserContestSubmitList from './components/UserContestSubmitList';
import { useEffect, useState } from 'react';
import Loading from '@/app/loading';
import Image from 'next/image';
import codeImg from '@/public/images/code.png';
import axiosInstance from '@/app/utils/axiosInstance';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { fetchCurrentUserInfo } from '@/app/utils/fetchCurrentUserInfo';
import { userInfoStore } from '@/app/store/UserInfo';
import { UserInfo } from '@/app/types/user';
import { ProblemInfo } from '@/app/types/problem';

// 대회 문제 열람 비밀번호 확인 API
const confirmContestConfirm = ({
  cid,
  password,
}: {
  cid: string;
  password: string;
}) => {
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/contest/confirm/${cid}?password=${password}`,
  );
};

// 문제 정보 조회 API
const fetchContestProblemDetailInfo = ({ queryKey }: any) => {
  const problemId = queryKey[1];
  return axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_VERSION}/problem/${problemId}`,
  );
};

interface DefaultProps {
  params: {
    cid: string;
    problemId: string;
  };
}

export default function UserContestSubmits(props: DefaultProps) {
  const cid = props.params.cid;
  const problemId = props.params.problemId;

  const confirmContestConfirmMutation = useMutation({
    mutationFn: confirmContestConfirm,
    onError: (error: AxiosError) => {
      const resData: any = error.response?.data;
      switch (resData.status) {
        case 400:
          switch (resData.code) {
            case 'CONTEST_PASSWORD_NOT_MATCH':
              alert('비밀번호가 일치하지 않습니다.');
              deleteCookie(cid);
              router.back();
              break;
            default:
              alert('정의되지 않은 http code입니다.');
          }
          break;
        default:
          alert('정의되지 않은 http status code입니다');
      }
    },
    onSuccess: (data) => {
      const resData = data.data;
      const httpStatusCode = resData.status;

      switch (httpStatusCode) {
        case 200:
          setCookie(cid, password, { maxAge: 60 * 60 * 24 });
          setIsPasswordChecked(true);
          break;
        default:
          alert('정의되지 않은 http status code입니다');
      }
    },
  });

  const [password, setPassword] = useState('');
  const [isPasswordChecked, setIsPasswordChecked] = useState(false);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['contestProblemDetailInfo', problemId],
    queryFn: fetchContestProblemDetailInfo,
    retry: 0,
  });

  const resData = data?.data.data;
  const contestProblemInfo: ProblemInfo = resData;

  const updateUserInfo = userInfoStore((state: any) => state.updateUserInfo);

  const [isLoading, setIsLoading] = useState(true);

  const currentTime = new Date();
  const contestEndTime = new Date(contestProblemInfo?.parentId.testPeriod.end);

  const router = useRouter();

  useEffect(() => {
    // (로그인 한) 사용자 정보 조회 및 관리자 권한 확인, 그리고 게시글 작성자인지 확인
    fetchCurrentUserInfo(updateUserInfo).then((userInfo: UserInfo) => {
      if (contestProblemInfo) {
        const isContestant = contestProblemInfo.parentId.contestants.some(
          (contestant_id) => contestant_id === userInfo._id,
        );

        if (isContestant && currentTime < contestEndTime) {
          setIsLoading(false);
          const contestPasswordCookie = getCookie(cid);
          if (contestPasswordCookie) {
            setPassword(contestPasswordCookie);
            confirmContestConfirmMutation.mutate({
              cid,
              password: contestPasswordCookie,
            });
            return;
          }

          const inputPassword = prompt('비밀번호를 입력해 주세요');
          if (inputPassword !== null && inputPassword.trim() !== '') {
            setPassword(inputPassword);
            confirmContestConfirmMutation.mutate({
              cid,
              password: inputPassword,
            });
            return;
          }

          router.back();
          return;
        }

        alert('접근 권한이 없습니다.');
        router.back();
      }
    });
  }, [updateUserInfo, contestProblemInfo, cid, router]);

  if (isLoading || !isPasswordChecked) return <Loading />;

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
                href={`/contests/${cid}/problems/${problemId}`}
                className="mt-1 ml-1 text-xl font-medium cursor-pointer hover:underline hover:text-[#0038a8] focus:underline focus:text-[#0038a8] text-[#1048b8]"
              >
                ({contestProblemInfo.title})
              </Link>
            </div>
          </p>

          <div className="flex justify-end pb-3 border-gray-300">
            <div className="flex gap-3">
              <span className="font-semibold">
                대회:{' '}
                <span className="font-light">
                  {contestProblemInfo.parentId.title}
                </span>
              </span>
            </div>
          </div>
        </div>

        <section className="dark:bg-gray-900">
          <UserContestSubmitList cid={cid} problemId={problemId} />
        </section>
      </div>
    </div>
  );
}
