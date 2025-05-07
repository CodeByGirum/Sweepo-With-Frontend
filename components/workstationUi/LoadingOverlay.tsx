// LoadingOverlay.tsx
import Loading from "./loading";

export const LoadingOverlay = ({ isLoading }: { isLoading: boolean }) => (
  isLoading ? (
    <div className={`absolute top-0 right-0 bottom-0 left-0 inset-0 z-50 font-bold flex items-center justify-center bg-transparent backdrop-blur-sm w-full]`}>
      <Loading />
    </div>
  ) : null
);