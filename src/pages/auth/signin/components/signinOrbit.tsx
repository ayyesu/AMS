import OrbitingCircles from "./ui/orbiting-circles";
import { AttendanceSvg } from '@/assets/svg/attendanceSvg';
import { UgSvg } from '@/assets/svg/ugSvg';
import { GlobeSvg } from '@/assets/svg/globeSvg';
import { CoordinateSvg } from '@/assets/svg/coordinateSvg';

export function SignInOrbit() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-transparent dark:border-gray-800 md:shadow-xl dark:md:shadow-none">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-500 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-gray-400">
        AMS
      </span>

      {/* Inner Circles */}
      <OrbitingCircles
        className="size-[30px] border-none bg-transparent"
        duration={20}
        delay={20}
        radius={80}
      >
        <CoordinateSvg />
      </OrbitingCircles>
      <OrbitingCircles
        className="size-[30px] border-none bg-transparent"
        duration={20}
        delay={10}
        radius={80}
      >
        <GlobeSvg />
      </OrbitingCircles>

      {/* Outer Circles (reverse) */}
      <OrbitingCircles
        className="size-[50px] border-none bg-transparent"
        radius={190}
        duration={20}
        reverse
      >
        <UgSvg />
      </OrbitingCircles>
      <OrbitingCircles
        className="size-[50px] border-none bg-transparent"
        radius={190}
        duration={20}
        delay={20}
        reverse
      >
        <AttendanceSvg />
      </OrbitingCircles>
    </div>
  );
}
