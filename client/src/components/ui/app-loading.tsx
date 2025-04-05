import LoadingAnime from "./loading-anime";

const AppLoading = () => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-[#222] rounded-xl p-12 shadow-2xl border border-gray-800 transform animate-fade-in-up">
        <LoadingAnime size="lg" text="Loading anime content..." />
        <h1 className="mt-8 text-[#ff3a3a] font-bold text-2xl text-center">Anime Oasis</h1>
        <p className="text-gray-400 text-center mt-2">Your gateway to anime paradise</p>
      </div>
    </div>
  );
};

export default AppLoading;