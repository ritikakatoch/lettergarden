import NavBar from '@/components/NavBar';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#eeecea]">
      <NavBar />

      {/* Light blue soft glows matching reference */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#e6f0ff]/40 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#e6f0ff]/40 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <main className="flex-1 w-full max-w-[700px] mx-auto px-6 pt-[7rem] sm:pt-[8rem] pb-32 relative z-10 flex flex-col justify-start items-start">
        <div className="font-reenie text-[20px] leading-[normal] text-[#000000] relative shrink-0 w-full">
          <p className="mb-0">Dear gardener,</p>
          <p className="mb-0">&nbsp;</p>

          <p className="mb-0">
            In a world where most conversations happen through quick texts, notifications, and disappearing messages, we often forget the beauty of slowing down and saying what we truly feel.          </p>
          <p className="mb-0">&nbsp;</p>

          <p className="mb-0">
            LetterGarden was created as a small space for meaningful words to bloom again. A place where letters feel personal, thoughtful, and lasting—like something you’d want to keep tucked away and revisit years later.          </p>
          <p className="mb-0">&nbsp;</p>

          <p className="mb-0">
            Every letter shared here is like a seed planted—it brightens someone's day, offers comfort, or simply says “I’m thinking of you.” There’s no rush, no pressure, no clutter—just space for care to grow.          </p>
          <p className="mb-0">&nbsp;</p>

          <p className="mb-0">
            Thank you for being here and helping this little garden grow. Feel free to send your suggestions  on <a href="mailto:[worksspacesmails@gmail.com]]" className="underline decoration-1 underline-offset-4 hover:text-black transition-colors">here</a>.
          </p>
          <p className="mb-0">&nbsp;</p>

          <p className="mb-0">With love,</p>
          <p className="mb-0">&nbsp;</p>

          <div className="flex items-center gap-3 mb-0">
            <img
              src="/stickers/profilephoto.jpeg"
              alt="Ritika Katoch"
              className="w-10 h-10 rounded-full object-cover object-top shadow-sm"
            />
            <span>Ritika K</span>
          </div>
          <p className="mb-0">&nbsp;</p>

          <p className="mb-0">P.S. Never forget to touch real grass.</p>
        </div>
      </main>

      {/* Decorative Flowers at bottom right — sourced directly from /stickers */}
      <div className="fixed bottom-0 right-0 pointer-events-none z-10 w-[520px] h-[380px]">
        {/* Far-back flower — small, rotated hard right */}
        <img
          src="/stickers/flower3.png"
          alt=""
          className="w-56 sm:w-72 h-auto absolute bottom-0 right-2 rotate-[-5deg] opacity-95 drop-shadow-lg"
        />
        {/* Mid flower — rotated right, slightly raised */}
        {/* <img
          src="/stickers/233e2136f1cb0d91b0ace9deafea0ed0417cf7e0.png"
          alt=""
          className="w-44 sm:w-56 h-auto absolute bottom-4 right-[150px] rotate-[15deg] opacity-90 drop-shadow-md"
        /> */}
      </div>
    </div>
  );
}
