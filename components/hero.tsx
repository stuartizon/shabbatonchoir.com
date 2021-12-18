import { FC } from 'react';
import cn from 'classnames';
import styles from './hero.module.css';

const Hero: FC<HeroProps> = ({ mode, children }) => (
    <div className={cn(styles.hero, "bg-auto w-screen", { "md:hidden h-40": mode === 'mobile', "hidden h-screen md:block": mode === 'desktop' })}>
        {children}
    </div>
);

export default Hero;

interface HeroProps {
    mode: 'mobile' | 'desktop'
}