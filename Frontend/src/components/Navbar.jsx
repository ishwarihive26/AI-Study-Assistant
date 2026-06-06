function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-slate-900 border-b border-slate-800">
      <h1 className="text-2xl font-bold text-green-400">
        AI Study Assistant
      </h1>

      <div className="flex gap-6 text-gray-300">
        <a href="#">Home</a>
        <a href="#">Features</a>
        <a href="#">Dashboard</a>
      </div>
    </nav>
  )
}

export default Navbar