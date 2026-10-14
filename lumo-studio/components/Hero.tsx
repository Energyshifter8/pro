import Title from "./hero/Title";
import Stickers from "./hero/Stickers";
import Sub from "./hero/Sub";
import Wave from "./Wave";

export default function Hero() {
  return (
    <>
      <section className="relative block h-[700rem] overflow-hidden bg-ink md:h-[100vh] lg:flex lg:h-[101vh] lg:min-h-[1240rem] lg:flex-col lg:items-center lg:justify-center lg:overflow-visible lg:bg-transparent lg:pb-[170rem] lg:pt-[220rem]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full md:top-[calc(50%-442.5rem)] md:h-[885rem] lg:pointer-events-auto lg:relative lg:top-auto lg:h-[840rem] lg:w-full lg:max-w-[1920rem] lg:px-[80rem]">
          <Title />
          <Sub />
          <Stickers />
        </div>
      </section>
      <Wave fill="#d3c5f6" />
    </>
  );
}
