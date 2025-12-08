import { Trophy } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  tagline: string;
  showGradient?: boolean;
  showDecorations?: boolean;
  compact?: boolean;
  hideHeroBackground?: boolean;
  isSubpage?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  tagline,
  showGradient = true,
  showDecorations = true,
  compact = false,
  //hideHeroBackground = false,
  isSubpage = false
}) => {
  const paddingClasses = compact
    ? "relative pt-20 pb-8 lg:pt-24 overflow-hidden px-4 sm:px-6 lg:px-8 mb-10"
    : "relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden px-4 sm:px-6 lg:px-8";

  return (
    <section className={paddingClasses}>
      {/* Decorative elements from Hero section */}
      {showDecorations && (
        <>
          {/* Trophy Icon - Top Left */}
          <div className="absolute top-[25%] left-[10%] z-50 pointer-events-none">
            <Trophy className="w-10 h-10 text-primary/30" />
          </div>

          {/* Background Glow - Top Right */}
          <div className="absolute top-20 right-[-10%] w-[728px] h-[771px] blur-[50px] z-50 pointer-events-none">
            <svg width="728" height="771" viewBox="0 0 299 617" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="291" cy="308.5" rx="291" ry="308.5" fill="url(#paint0_radial_2043_1685)" fillOpacity="1" />
              <defs>
                {/* <radialGradient id="paint0_radial_2043_1685" cx="0" cy="0" r="1" gradientTransform="matrix(10.0537 288.96 -443.72 17.351 414.996 343.436)" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00FF73" />
                  <stop offset="1" stopColor="#1A1A1D" stopOpacity="0" />
                </radialGradient> */}
              </defs>
            </svg>
          </div>
        </>
      )}

      {/* Center Decorative gradient SVG */}
      {showGradient && (
        <div className="absolute top-[45%] left-[-20%] -translate-y-1/2 w-[450px] h-[500px] blur-[50px] z-50 pointer-events-none">
          <svg width="450" height="500" viewBox="0 0 299 617" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <ellipse cx="291" cy="308.5" rx="291" ry="308.5" fill="url(#paint1_radial_2043_1685)" fillOpacity="1"></ellipse>
            <defs>
              {/* <radialGradient id="paint1_radial_2043_1685" cx="0" cy="0" r="1" gradientTransform="matrix(10.0537 288.96 -443.72 17.351 414.996 343.436)" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00FF73"></stop>
                <stop offset="1" stopColor="#1A1A1D" stopOpacity="0"></stop>
              </radialGradient> */}
            </defs>
          </svg>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto relative z-10 text-center">
        {/* Heading and Tagline */}
        <h1 className={`text-6xl lg:text-7xl font-bold mx-auto mb-6 ${isSubpage ? 'pt-8' : ''}`}>
          <span className="bg-gradient-to-r from-primary to-team-blue bg-clip-text text-transparent">
            {title}
          </span>
        </h1>
        <p className="text-xl text-gray-text mb-10 mx-auto max-w-2xl leading-relaxed">
          {tagline}
        </p>
      </div>
    </section>
  );
};
