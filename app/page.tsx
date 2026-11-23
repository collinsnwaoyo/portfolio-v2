import Hero from '../components/Hero/Hero';
import MyWork from '../components/MyWork/MyWork';
import Everything from '../components/Everything/Everything';
import WhatIDo from '../components/WhatIDo/WhatIDo';
import ThinkPieces from '../components/ThinkPieces/ThinkPieces';
import Contact from '../components/Contact/Contact';

export default function Home() {
  return (
    <main>
      <Hero />
      <MyWork />
      <Everything />
      <WhatIDo />
      <ThinkPieces />
      <Contact />
    </main>
  );
}
