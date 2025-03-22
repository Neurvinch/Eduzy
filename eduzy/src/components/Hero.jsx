import React, { useState, useEffect } from 'react';

const testimonials = [
  {
    quote: "This course completely changed the way I handle money! I learned how to save, invest, and manage my expenses without stress. Now, I feel financially secure and confident about my future .",
    company: "SmartWealth",
    logo: "https://cdn.prod.website-files.com/6513c48ced436181a3a12349/651e56f5b528c95cab915324_Mobile%20grid.svg"
  },
  {
    quote: "I had no idea how vulnerable I was online until I took this course. Now, I can spot scams, protect my data, and even secure my crypto assets with confidence. A must-learn skill in today's digital world !",
    company: "CyberShield",
    logo: "https://cdn.prod.website-files.com/6513c48ced436181a3a12349/65291586cabc4a6c07b52a86_Indifolio%20mobile.svg"
  },
  {
    quote: "From better eating habits to stress management techniques, this course has improved my daily routine. I feel healthier, more energetic, and mentally stronger than ever before !",
    company: "VitaMind",
    logo: "https://cdn.prod.website-files.com/6513c48ced436181a3a12349/652918cd59b860fb606e2341_pawsome%20(1).svg"
  },
  {
    quote: "Public speaking was my biggest fear, but this course helped me overcome it. Now, I communicate with confidence, think critically, and solve problems like a pro !",
    company: "Mindfluence",
    logo: "https://cdn.prod.website-files.com/6513c48ced436181a3a12349/65291915ce92e9979574e387_Ionet%20mobile.svg"
  }
];
const PortfolioItem = ({ title, image, link, tags }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-all duration-300">
      <div className="relative aspect-video">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end">
          <div className="p-4 text-white">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <span key={idx} className="text-xs bg-yellow-400 text-black px-2 py-1 rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

const Hero = () => {
  const portfolioItems = [
    {
      title: "",
      image: "/b.pmg.jpg",
      link: "https://www.icuerious.com/images/blockchain-img.jpg",
      tags: ["BUDGET", "INVEST", "CREDIT"]
    },
    {
      title: "Village by Boa",
      image: "/b2.avif",
      link: "https://www.villagebyboa.com",
      tags: ["SCAM", "PRIVACY", "THREAT"]
    },
    {
      title: "Slay",
      image: "/b3.png",
      link: "https://www.borntoslay.in",
      tags: ["STRESS", "FITNESS", "MIND"]
    },
    {
      title: "Speckles",
      image: "/b4.jpg",
      link: "https://specklesforkids.com",
      tags: ["SPEAK", "DECISION", "LOGIC"]
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Background grid */}
      <div className="absolute inset-0 bg-white" style={{ backgroundImage: 'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      {/* Header */}
      <header className="relative p-4">
        <div className="text-left">
          <h1 className="text-3xl font-bold text-orange-600">byooooob</h1>
        </div>
        <div className="absolute top-4 right-4 flex space-x-1">
          <div className="flex flex-wrap w-12">
            <div className="w-2 h-2 bg-black rounded-full m-1"></div>
            <div className="w-2 h-2 bg-black rounded-full m-1"></div>
            <div className="w-2 h-2 bg-black rounded-full m-1"></div>
            <div className="w-2 h-2 bg-black rounded-full m-1"></div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="relative px-6 pt-8">
        {/* Decorative elements */}
        <div className="absolute left-60 top-60">
          <svg width="100" height="100" viewBox="0 0 100 100" className="w-24 h-24">
            <path d="M50,0 L60,40 L100,50 L60,60 L50,100 L40,60 L0,50 L40,40 Z" stroke="black" strokeWidth="2" fill="none"></path>
          </svg>
        </div>

        <span className="ml-4 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>


        <div className="absolute right-60 top-60 animate-spin">
          <svg width="100" height="100" viewBox="0 0 100 100" className="w-24 h-24">
            <path d="M50,0 L60,40 L100,50 L60,60 L50,100 L40,60 L0,50 L40,40 Z" stroke="black" strokeWidth="2" fill="none"></path>
          </svg>
        </div>
        
        <div className="absolute right-12 top-2">
          <svg width="50" height="50" viewBox="0 0 100 100" className="w-16 h-16">
            <path d="M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10 Z" fill="#FF5722" stroke="none">
              <path d="M30,30 L70,30 L70,70 L30,70 Z" fill="#FF5722"></path>
            </path>
          </svg>
        </div>
        
        {/* Profile card */}
        <div className="absolute right-12 top-48 transform rotate-4">
          <div className="w-24 h-32 rounded-lg overflow-hidden">
            <div className="h-2/3 bg-yellow-500 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-gray-400"></div>
            </div>
            <div className="h-1/3 bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">BITCOIN</span>
            </div>
          </div>
        </div>

        <div className="absolute left-60 top-20 ">
          <div className="w-24 h-32 ">
           
            <div className="h-1/3 bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">ETHEREUM</span>
            </div>
          </div>
        </div>

        <div className="absolute right-60 top-48 transform rotate-12">
          <div className="w-24 h-32 ">
           
            <div className="h-1/3 bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">BINANCE</span>
            </div>
          </div>
        </div>
        
        <div className="absolute left-12 top-48 transform rotate-12">
          <div className="w-24 h-32 rounded-lg overflow-hidden">
            <div className="h-2/3 bg-orange-500 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-gray-400"></div>
            </div>
            <div className="h-1/3 bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold"></span>
            </div>
          </div>
        </div>
        
        {/* Left side decorative elements */}
        <div className="absolute left-8 bottom-32">
          <div className="flex space-x-0">
            <div className="w-8 h-16 bg-green-600 rounded-l-full"></div>
            <div className="w-8 h-16 bg-green-600 opacity-80 rounded-l-full transform -translate-x-4"></div>
            <div className="w-8 h-16 bg-green-600 opacity-60 rounded-l-full transform -translate-x-8"></div>
          </div>
            {/* Bottom profile card */}
      
        
          <div className="mt-4 w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-black relative">
              <div className="absolute inset-0 border-t-2 border-l-2 border-gray-800 rounded-full transform rotate-45"></div>
              <div className="absolute inset-0 border-b-2 border-r-2 border-gray-800 rounded-full transform rotate-45"></div>
            </div>
          </div>
        </div>
        
      
        
       
        
        {/* Main text content */}
        <div className="relative z-10 mt-16 mb-4 text-center px-8">
          <h2 className="text-4xl font-black uppercase">Monetize Your Knowledge in</h2>
          <h2 className="text-4xl font-black uppercase"> High-Demand Skills with </h2>
          <h2 className="text-4xl font-bold text-pink-400 mt-1 uppercase">Crypto</h2>
          
          <p className="mt-8 text-gray-800 text-lg">
            Teach & Earn in the Web3 Economy.
          </p>
          
          {/* CTA Button */}
          <div className="mt-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-black rounded-full transform translate-x-2 translate-y-2"></div>
              <button className="relative bg-white px-8 py-3 rounded-full border-2 border-black font-bold uppercase">
                learn <span className="bg-yellow-400 px-2 py-1 rounded-lg text-sm   mr-1">pay</span>own
              </button>
            </div>
          </div>
        </div>
        
        {/* Portfolio Items Section */}
        <div className="mt-16 px-4">
          <h2 className="text-3xl font-black text-center mb-8">OUR WORK</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolioItems.map((item, index) => (
              <PortfolioItem
                key={index}
                title={item.title}
                image={item.image}
                link={item.link}
                tags={item.tags}
              />
            ))}
          </div>
        </div>
      </main>
      {/* Purple band with infinite scrolling marquee */}
      <div className="bg-indigo-600 py-2 relative mt-12 overflow-hidden">
        <style jsx>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .scroll-container {
            display: inline-block;
            white-space: nowrap;
            animation: scroll 15s linear infinite;
          }
        `}</style>
        <div className="whitespace-nowrap">
          <div className="scroll-container uppercase">
            <span className="text-xl text-pink-200 mx-4 inline-block">No Banks</span>
            <div className="w-8 h-8 mx-4 bg-pink-300 rounded-full inline-block"></div>
            <span className="text-xl text-pink-200 mx-4 inline-block"> No Borders</span>
            <div className="w-8 h-8 mx-4 bg-pink-300 rounded-full inline-block"></div>
            <span className="text-xl text-pink-200 mx-4 inline-block"> Just Learning with Crypto</span>
            <div className="w-8 h-8 mx-4 bg-pink-300 rounded-full inline-block"></div>
            <span className="text-xl text-pink-200 mx-4 inline-block">No Banks</span>
            <div className="w-8 h-8 mx-4 bg-pink-300 rounded-full inline-block"></div>
          </div>
          <div className="scroll-container uppercase" style={{ display: 'inline-block' }}>
            <span className="text-xl text-pink-200 mx-4 inline-block"> No Borders</span>
            <div className="w-8 h-8 mx-4 bg-pink-300 rounded-full inline-block"></div>
            <span className="text-xl text-pink-200 mx-4 inline-block"> Just Learning with Crypto</span>
            <div className="w-8 h-8 mx-4 bg-pink-300 rounded-full inline-block"></div>
            <span className="text-xl text-pink-200 mx-4 inline-block">No Banks</span>
            <div className="w-8 h-8 mx-4 bg-pink-300 rounded-full inline-block"></div>
            <span className="text-xl text-pink-200 mx-4 inline-block"> No Borders</span>
            <div className="w-8 h-8 mx-4 bg-pink-300 rounded-full inline-block"></div>
          </div>
        </div>
      </div>
      
     
       {/* Added Skills Section */}
       <section className="py-20 relative">
        {/* Background grid continues */}
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-pink-200 to-transparent"></div>

        {/* Decorative elements for this section */}
        <div className="absolute right-8 top-16">
          <svg width="40" height="40" viewBox="0 0 100 100" className="w-10 h-10 animate-spin-slow">
            <path d="M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10 Z" fill="#FF5722" stroke="none">
              <path d="M30,30 L70,30 L70,70 L30,70 Z" fill="#FF5722"></path>
            </path>
          </svg>
        </div>
        
        <div className="absolute left-12 top-32">
          <svg width="30" height="30" viewBox="0 0 100 100" className="w-8 h-8 animate-pulse">
            <polygon points="50,0 61,35 100,35 69,56 82,90 50,70 18,90 31,56 0,35 39,35" fill="none" stroke="#000" strokeWidth="2" />
          </svg>
        </div>

        <div className="container mx-auto px-4 pt-16 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-8 inline-flex items-center uppercase">
            Empower Your Learning: Watch, Earn, and Decide !
              <span className="ml-4 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </h2>

            <p className="max-w-3xl mx-auto text-lg text-gray-700">
            Experience the future of learning! 🚀 Earn rewards while watching courses, vote for new content, and join live-streamed sessions with experts.
             Powered by Web3 & crypto, ensuring a secure & decentralized experience. 🎓💡
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Skill cards with same styling as the original page */}
            <div className="bg-white rounded-lg p-6 shadow-md border-2 border-black transform hover:scale-105 transition-transform">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">UX Designers</h3>
              <p className="text-gray-600">Creating intuitive, user-focused experiences that delight and convert.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md border-2 border-black transform hover:scale-105 transition-transform">
              <h3 className="text-xl font-semibold text-green-500 mb-2">DEVELOPERS</h3>
              <p className="text-gray-600">Building robust, future-proof websites and applications.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md border-2 border-black transform hover:scale-105 transition-transform">
              <h3 className="text-xl font-semibold text-pink-500 mb-2">STRATEGISTS</h3>
              <p className="text-gray-600">Planning campaigns and content that align with your business goals.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md border-2 border-black transform hover:scale-105 transition-transform">
              <h3 className="text-xl font-semibold text-yellow-500 mb-2">CREATORS</h3>
              <p className="text-gray-600">Crafting engaging content that builds your brand and drives engagement.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <div className="relative bg-pink-100 py-16">
        {/* Decorative elements for testimonials section */}
        <div className="absolute left-12 top-12">
          <svg width="40" height="40" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="#FF5722" />
          </svg>
        </div>
        
        <div className="absolute right-20 bottom-20">
          <svg width="60" height="60" viewBox="0 0 100 100">
            <path d="M20,20 L80,20 L80,80 L20,80 Z" fill="none" stroke="#4F46E5" strokeWidth="4" />
          </svg>
        </div>
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black">What Our Learners Say</h2>
            <h2 className="text-3xl font-black"></h2>
          </div>
          
          <div className="max-w-2xl mx-auto relative">
            <div className="h-64 relative">
              {testimonials.map((testimonial, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-all duration-500 ${
                    idx === activeIndex
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-10'
                  }`}
                >
                  <div className="bg-white p-6 rounded-xl border-2 border-black shadow-lg" style={{ boxShadow: '5px 5px 0 rgba(0,0,0,1)' }}>
                    <p className="text-lg mb-6 font-medium">"{testimonial.quote}"</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-800">{testimonial.company}</span>
                      <img
                        src={testimonial.logo}
                        alt={testimonial.company}
                        className="h-8"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === activeIndex
                      ? 'bg-indigo-600 scale-125'
                      : 'bg-gray-300'
                  }`}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`View testimonial ${idx + 1}`}
                />
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <button
                className="text-indigo-600 font-bold flex items-center mx-auto px-6 py-2 "
                onClick={() => setActiveIndex((activeIndex + 1) % testimonials.length)}
              >
                <span className="mr-Z"> NEXT </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

             
            </div>
          </div>
        </div>
      </div>
      
      {/* White bar at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-400"></div>
      
      {/* W badge */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black text-white py-16 px-4 flex flex-col items-center">
        <span className="text-3xl font-bold">W.</span>
        <div className="mt-8 transform -rotate-90 whitespace-nowrap text-xs">
          Site of the Day
        </div>
      </div>
    </div>
  );
};

export default Hero;