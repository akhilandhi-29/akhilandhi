import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden flex flex-col relative font-mono selection:bg-[#ff00ff]/30">
      <div className="fixed inset-0 pointer-events-none z-50 mix-blend-overlay opacity-30 static-noise"></div>
      <div className="fixed inset-0 pointer-events-none z-50 w-full h-[10px] bg-[#00ffff] opacity-10 animate-scanline"></div>
      
      <main className="relative z-10 flex-1 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
        
        <header className="w-full max-w-4xl flex flex-col items-center mb-8 animate-tear">
          <h1 
            className="text-6xl md:text-7xl tracking-widest mb-2 glitch-text text-[#00ffff] drop-shadow-[0_0_10px_#00ffff]"
            data-text="SYSTEM.CORE"
          >
            SYSTEM.CORE
          </h1>
          <p className="text-2xl md:text-3xl text-[#ff00ff] border-b-4 border-[#00ffff] px-4 py-1 tracking-[0.3em] uppercase bg-[#00ffff]/20 animate-glitch">
            <span className="text-[#00ffff]">STATUS:</span> CORRUPTED
          </p>
        </header>

        <div className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center gap-12">
          
          <div className="w-full flex justify-center animate-tear" style={{ animationDelay: '0.5s' }}>
             <SnakeGame />
          </div>

          <div className="w-full flex justify-center mt-auto pb-4 animate-tear" style={{ animationDelay: '1.5s' }}>
            <MusicPlayer />
          </div>

        </div>
      </main>
    </div>
  );
}
