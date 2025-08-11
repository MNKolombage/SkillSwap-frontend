const WelcomeSection = () => {
    return(
        <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
            <h1 className="text-4xl font-bold tracking-tight">
                Wlcome to SkillSwap!
            </h1>
            <p className="text-gray-600 max-w-lg">
                A vibrant community where skills are shared, not just showcased.
            </p>
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 text-xs uppercase tracking-wider">
                Start Your Learning Journey
            </button>
        </div>
    );
};

export default WelcomeSection;