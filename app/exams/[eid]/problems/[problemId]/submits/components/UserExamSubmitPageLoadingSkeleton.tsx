export default function UserExamSubmitPageLoadingSkeleton() {
  return (
    <div className="mt-6 mb-24 w-[21rem] xs:w-[90%] xl:w-[74%] mx-auto">
      <div className="flex flex-col pb-3">
        <div className="flex items-end gap-x-2">
          <div className="skeleton w-[13rem] h-[3rem]" />
          <div className="skeleton w-[22.5rem] h-[2rem]" />
        </div>
        <div className="mt-7 flex justify-end items-center gap-x-4">
          <div className="flex gap-x-2 h-[1.25rem]">
            <div className="skeleton w-[15rem]" />
            <span className='hidden relative bottom-[0.055rem] font-thin before:content-["|"] 3md:block' />
            <div className="skeleton w-[12.5rem]" />
          </div>
          <div
            className="skeleton w-[5.5rem] h-[2.15rem] "
            style={{ borderRadius: '0.35rem' }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <div className="skeleton h-[2rem]" />
        <div className="skeleton h-[2.15rem]" />
        <div className="skeleton h-[2.15rem]" />
        <div className="skeleton h-[2.15rem]" />
        <div className="skeleton h-[2.15rem]" />
        <div className="skeleton h-[2.15rem]" />
      </div>
    </div>
  );
}
