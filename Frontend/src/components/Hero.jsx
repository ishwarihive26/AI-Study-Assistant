function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center mt-32 px-6">
      <h1 className="text-7xl font-bold text-green-400 leading-tight">
        Learn Smarter <br /> With AI 🚀
      </h1>

      <p className="mt-6 text-gray-300 text-xl max-w-2xl">
        AI-powered study assistant with notes summarizer,
        quizzes, flashcards and smart learning tools.
      </p>

      <div className="flex gap-4 mt-10">
        <button className="px-8 py-4 bg-green-500 rounded-2xl">
          Get Started
        </button>

        <button className="px-8 py-4 border border-green-500 rounded-2xl">
          Explore
        </button>
      </div>
    </section>
  )
}

export default Hero
