import Link from 'next/link';

export default function CasePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-noir-bg text-noir-text font-serif p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-noir-accent">
          Case #001
        </h1>
        <p className="text-xl md:text-2xl">The Vanishing Symphony</p>
        <p className="text-lg text-gray-400">Game content coming soon.</p>
      </div>
      <Link href="/" className="mt-12 px-6 py-2 border border-noir-text text-noir-text rounded-md hover:bg-noir-accent hover:border-noir-accent transition-colors duration-300">
          Back to Weather
      </Link>
    </div>
  );
}
