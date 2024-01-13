'use client';

import Loading from '@/app/loading';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DefaultProps {
  params: {
    eid: string;
    problemId: string;
  };
}

const PDFViewer = dynamic(() => import('@/app/components/PDFViewer'), {
  ssr: false,
});

export default function ExamProblem(props: DefaultProps) {
  const [isExamProblemReady, setIsExamProblemReady] = useState(false);
  const [isMarkdownPreviewReady, setIsMarkdownPreviewReady] = useState(false);

  const eid = props.params.eid;
  const problemId = props.params.problemId;

  const router = useRouter();

  const handleGoToExamProblems = () => {
    router.push(`/exams/${eid}/problems`);
  };

  const handleGoToUserContestSubmits = () => {
    router.push(`/exams/${eid}/problems/${problemId}/submits`);
  };

  const handleGoToSubmitContestProblemCode = () => {
    router.push(`/exams/${eid}/problems/${problemId}/submit`);
  };

  const handleEditProblem = () => {
    router.push(`/exams/${eid}/problems/${problemId}/edit`);
  };

  const handleDeleteProblem = () => {
    const userResponse = confirm('문제를 삭제하시겠습니까?');
    if (!userResponse) return;
    alert('문제를 삭제하였습니다.');
    router.push(`/exams/${eid}/problems`);
  };

  useEffect(() => {
    setIsMarkdownPreviewReady(true);
    setIsExamProblemReady(true);
  }, []);

  return isExamProblemReady && isMarkdownPreviewReady ? (
    <div className="mt-6 mb-24 px-5 2lg:px-0 overflow-x-auto">
      <div className="flex flex-col w-[60rem] mx-auto">
        <div className="flex flex-col gap-8">
          <p className="text-2xl font-bold tracking-tight">A+B</p>
          <div className="flex justify-between pb-3 border-b border-gray-300">
            <div className="flex gap-3">
              <span className="font-semibold">
                시간 제한:
                <span className="font-mono font-light">
                  {' '}
                  <span>1</span>초
                </span>
              </span>
              <span className='relative bottom-[0.055rem] font-thin before:content-["|"]' />
              <span className="font-semibold">
                메모리 제한:
                <span className="font-mono font-light">
                  {' '}
                  <span className="mr-1">5</span>MB
                </span>
              </span>
            </div>
            <div className="flex gap-3">
              <span className="font-semibold">
                시험:{' '}
                <span className="font-light">
                  2023-01-자료구조(소프트웨어학부 01반)
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-4">
          <button
            onClick={handleGoToExamProblems}
            className="flex gap-[0.375rem] items-center text-white bg-green-500 px-2 py-[0.4rem] rounded-[0.2rem] font-light focus:bg-[#3e9368] hover:bg-[#3e9368] box-shadow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 -960 960 960"
              width="20"
              fill="white"
            >
              <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520h200L520-800v200Z" />
            </svg>
            문제 목록
          </button>
          <button
            onClick={handleGoToUserContestSubmits}
            className="flex gap-[0.375rem] items-center text-white bg-[#6860ff] px-2 py-[0.4rem] rounded-[0.2rem] font-light focus:bg-[#5951f0] hover:bg-[#5951f0] box-shadow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 -960 960 960"
              width="20"
              fill="white"
            >
              <path d="M320-242 80-482l242-242 43 43-199 199 197 197-43 43Zm318 2-43-43 199-199-197-197 43-43 240 240-242 242Z" />
            </svg>
            내 제출 현황
          </button>
          <button
            onClick={handleGoToSubmitContestProblemCode}
            className="flex gap-[0.375rem] items-center text-white bg-[#3870e0] px-3 py-[0.4rem] rounded-[0.2rem] font-light focus:bg-[#3464c2] hover:bg-[#3464c2] box-shadow"
          >
            제출하기
          </button>
          <button
            onClick={handleEditProblem}
            className="flex gap-[0.375rem] items-center text-white bg-[#eba338] px-2 py-[0.4rem] rounded-[0.2rem] font-light focus:bg-[#dc9429] hover:bg-[#dc9429] box-shadow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 -960 960 960"
              width="20"
              fill="white"
            >
              <path d="M794-666 666-794l42-42q17-17 42.5-16.5T793-835l43 43q17 17 17 42t-17 42l-42 42Zm-42 42L248-120H120v-128l504-504 128 128Z" />
            </svg>
            문제 수정
          </button>
          <button
            onClick={handleDeleteProblem}
            className="flex gap-[0.375rem] items-center text-white bg-red-500 px-2 py-[0.4rem] rounded-[0.2rem] font-light focus:bg-[#e14343] hover:bg-[#e14343] box-shadow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              viewBox="0 -960 960 960"
              width="20"
              fill="white"
            >
              <path d="m361-299 119-121 120 121 47-48-119-121 119-121-47-48-120 121-119-121-48 48 120 121-120 121 48 48ZM261-120q-24 0-42-18t-18-42v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Z" />
            </svg>
            문제 삭제
          </button>
        </div>

        <div className="gap-5 border-b mt-8 mb-4 pb-5">
          <PDFViewer pdfFileURL={'/pdfs/test.pdf'} />
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
}