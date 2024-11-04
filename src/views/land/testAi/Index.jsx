import { Header } from './Header';
import { Hero } from './Hero';
import { Tests } from './Tests';
import '@/app/globals.css';

export const TestAi = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="container mx-auto px-4">
          <Hero />
          <Tests />
        </div>
      </main>
    </div>
  );
};

export default TestAi;
