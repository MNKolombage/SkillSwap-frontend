import HeroImage from "../../assets/HeroImage.jpeg"

const HeroSection = () => {
    return(
        <div className="flex flex-col items-center justify-center space-y-8 py-8">
            <img src={HeroImage} alt="SkillSwap Logo" className="rounded-md shadow-lg max-w-6xl" />

            <p className="text-center text-gray-700 max-w-4xl text-sm leading-relaxed">
                Whether you're a coding wizard, a design genius, a language learner, or just someone eager to grow — you've found your place. <br />
                Here, you can teach what you know and learn what you don’t, one swap at a time.
            </p>

            <div className="bg-purple-100 rounded-xl shadow-md p-8 max-w-xl text-center">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Connect. Learn. Grow. Together.
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                    Ready to level up your skills while helping others do the same? <br />
                    Join SkillSwap — where knowledge goes both ways.
                </p>
            </div>

            <div className="text-4xl font-bold text-black">⋯</div>
        </div>
    );
};

export default HeroSection;