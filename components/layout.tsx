import Head from 'next/head';
import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import Hero from './hero';
import HeaderMobile from './header-mobile';
import Footer from './footer';
import Navigation from './navigation';
import HeaderDesktop from './header-desktop';

const Layout: FC<LayoutProps> = ({ title, children }) => {
  const { route } = useRouter();
  const [isMenuVisible, setMenuVisible] = useState<boolean>(false);
  const onToggleMenu = () => setMenuVisible(!isMenuVisible);

  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <title>Shabbaton Choir</title>
        <link rel="icon" type="image/x-icon" href="/favicon.png"/>
      </Head>
      {route === "/" ? (<Hero mode='desktop'><HeaderDesktop /></Hero>) : <><HeaderDesktop /></>}
      <HeaderMobile onToggleMenu={onToggleMenu} />
      <div className="overflow-hidden">
        <Navigation visible={isMenuVisible} />
        {route === "/" ? <Hero mode='mobile' /> : <></>}
        <main>
          <div className="mx-auto px-4 max-w-prose text-gray-600 text-lg">
            <h1>{title}</h1>
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;

interface LayoutProps {
  title?: string;
}