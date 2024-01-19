'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppDispatch, useAppSelector } from '../redux/store';
import { useDispatch } from 'react-redux';
import { signOut } from '../redux/features/authSlice';
import { useRouter } from 'next/navigation';
import ChannelService from '../third-party/ChannelTalk';

export default function Navbar() {
  useEffect(() => {
    const CT = new ChannelService();
    CT.loadScript();
    CT.boot({ pluginKey: process.env.NEXT_PUBLIC_CHANNEL_TALK_PLUGIN_KEY! });

    //for unmount
    return () => {
      CT.shutdown();
    };
  }, []);

  const [rightPos, setRightPos] = useState('-right-full');

  const isAuth = useAppSelector((state) => state.authReducer.value.isAuth);
  const username = useAppSelector((state) => state.authReducer.value.username);

  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const handleSignOut = () => {
    router.push('/');
    dispatch(signOut());
  };

  return (
    <nav
      className={`w-full z-10 p-2 pl-3 fixed top-0 border-b border-[#e6e8ea] whitespace-nowrap bg-white`}
    >
      <div className="2lg:w-[60rem] flex items-center mx-auto">
        <div className="py-2 2md:py-0">
          <Link href="/">
            <div className="flex gap-1">
              <img
                src="/images/logo.png"
                alt="logo"
                style={{ width: '35px', height: '24px' }}
                className="relative top-[2px]"
              />
              <span className="hidden 2lg:block tracking-tight text-lg font-semibold">
                SW Online Judge
              </span>
            </div>
          </Link>
        </div>
        <div className="hidden ml-16 2md:block">
          <div className="flex gap-3 font-medium mx-auto">
            <Link
              href="/contests"
              className="px-4 py-2 rounded-md hover:bg-[#f3f4f5] focus:bg-[#f3f4f5]"
            >
              대회
            </Link>
            <Link
              href="/exams"
              className="px-3 py-2 rounded-md hover:bg-[#f3f4f5] focus:bg-[#f3f4f5]"
            >
              시험
            </Link>
            <Link
              href="/practices"
              className="px-3 py-2 rounded-md hover:bg-[#f3f4f5] focus:bg-[#f3f4f5]"
            >
              연습문제
            </Link>
            <Link
              href="/notices"
              className="px-3 py-2 rounded-md hover:bg-[#f3f4f5] focus:bg-[#f3f4f5]"
            >
              공지사항
            </Link>
          </div>
        </div>
        <div className="hidden w-[17.5rem] ml-auto 2md:flex">
          <div className="flex ml-auto gap-3">
            {isAuth ? (
              <>
                <Link
                  href="/mypage"
                  className="px-3 py-2 rounded-md hover:bg-[#f3f4f5]"
                >
                  <span className="font-semibold">{username}</span>님
                </Link>
                <button
                  className="px-3 py-2 rounded-md hover:bg-[#f3f4f5]"
                  onClick={handleSignOut}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 rounded-md hover:bg-[#f3f4f5]"
                >
                  로그인
                </Link>
                <a
                  href="https://sw7up.cbnu.ac.kr/account/join"
                  target="_blank"
                  className="px-3 py-2 rounded-md hover:bg-[#f3f4f5]"
                >
                  회원가입
                </a>
              </>
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            setRightPos('right-0');
          }}
          className={`block 2md:hidden px-[0.6rem] py-3 ml-auto mr-[0.1rem] rounded-full focus:outline-none`}
        >
          <div className="w-[1.1rem] h-[2px] bg-[#262626] mb-[4px]"></div>
          <div className="w-[1.1rem] h-[2px] bg-[#262626] mb-[4px]"></div>
          <div className="w-[1.1rem] h-[2px] bg-[#262626]"></div>
          <div
            className={`absolute top-0 ${rightPos} h-screen w-full bg-white border opacity-95 transition-all duration-300 cursor-default`}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                setRightPos('-right-full');
              }}
              className="w-fit ml-auto mt-2 mr-2 p-1 rounded-full cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="33"
                viewBox="0 -960 960 960"
                width="33"
              >
                <path d="M480-455.897 265.949-241.846q-4.795 4.795-11.667 5.179-6.872.385-12.436-5.179t-5.564-12.051q0-6.488 5.564-12.052L455.897-480 241.846-694.051q-4.795-4.795-5.179-11.667-.385-6.872 5.179-12.436t12.051-5.564q6.488 0 12.052 5.564L480-504.103l214.051-214.051q4.795-4.795 11.667-5.179 6.872-.385 12.436 5.179t5.564 12.051q0 6.488-5.564 12.052L504.103-480l214.051 214.051q4.795 4.795 5.179 11.667.385 6.872-5.179 12.436t-12.051 5.564q-6.488 0-12.052-5.564L480-455.897Z" />
              </svg>
            </div>
            <ul className="flex flex-col items-center w-full text-base cursor-pointer pt-4">
              <div className="flex flex-col w-full border-b-[0.75rem] text-sm">
                {isAuth ? (
                  <>
                    <Link
                      href="/login"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRightPos('-right-full');
                      }}
                      className="hover:bg-gray-200 focus:bg-grey-200 py-4 px-6 w-full"
                    >
                      <span className="font-semibold">{username}</span>님
                    </Link>
                    <button
                      className="hover:bg-gray-200 focus:bg-grey-200 py-4 px-6 w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRightPos('-right-full');
                        handleSignOut();
                      }}
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRightPos('-right-full');
                      }}
                      className="hover:bg-gray-200 focus:bg-grey-200 py-4 px-6 w-full"
                    >
                      로그인
                    </Link>
                    <a
                      href="https://sw7up.cbnu.ac.kr/account/join"
                      target="_blank"
                      className="hover:bg-gray-200 focus:bg-grey-200 py-4 px-6 w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      회원가입
                    </a>
                  </>
                )}
              </div>
              <Link
                href="/contests"
                onClick={(e) => {
                  e.stopPropagation();
                  setRightPos('-right-full');
                }}
                className="hover:bg-gray-200 focus:bg-grey-200 py-4 px-6 w-full font-medium"
              >
                대회
              </Link>
              <Link
                href="/exams"
                onClick={(e) => {
                  e.stopPropagation();
                  setRightPos('-right-full');
                }}
                className="hover:bg-gray-200 focus:bg-grey-200 py-4 px-6 w-full font-medium"
              >
                시험
              </Link>
              <Link
                href="/practices"
                onClick={(e) => {
                  e.stopPropagation();
                  setRightPos('-right-full');
                }}
                className="hover:bg-gray-200 focus:bg-grey-200 py-4 px-6 w-full font-medium"
              >
                연습문제
              </Link>
              <Link
                href="/notices"
                onClick={(e) => {
                  e.stopPropagation();
                  setRightPos('-right-full');
                }}
                className="hover:bg-gray-200 focus:bg-grey-200 py-4 px-6 w-full font-medium"
              >
                공지사항
              </Link>
            </ul>
          </div>
        </button>
      </div>
    </nav>
  );
}
