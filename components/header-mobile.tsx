import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FC } from "react";
import Logo from './logo';

const HeaderMobile: FC<HeaderMobileProps> = ({ onToggleMenu }) => (
    <header className="md:hidden">
        <div className="container md:px-10 pt-4 mx-auto md:flex md:justify-between md:items-center">
            <div className="flex items-center justify-between mx-4">
                <Logo />
                <div className="md:hidden text-main flex items-center">
                    <div className="mx-2">MENU</div>
                    <FontAwesomeIcon size="2x" className="texst-main" icon={faBars} onClick={onToggleMenu} />
                </div>
            </div>
            <div className="bg-gradient-to-t from-gray-100 h-3"></div>
        </div>
    </header >
);

export default HeaderMobile;

interface HeaderMobileProps {
    onToggleMenu: () => void;
}