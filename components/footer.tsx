import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faYoutube, faSpotify } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
    return (
        <footer className="pt-16 md:pt-0">
            <div className="fixed md:static bottom-0 w-screen flex bg-gray-100 justify-center gap-4 p-6">
                <a href="https://www.facebook.com/shabbatonchoir" target="_blank" rel="noreferrer">
                    <FontAwesomeIcon size="2x" className="text-gray-600" icon={faFacebook} />
                </a>
                <a href="https://twitter.com/shabbatonchoir" target="_blank" rel="noreferrer">
                    <FontAwesomeIcon size="2x" className="text-gray-600" icon={faTwitter} />
                </a>
                <a href="https://open.spotify.com/artist/3UZxQiOiQL8bgl4Zc4R9vk" target="_blank" rel="noreferrer">
                    <FontAwesomeIcon size="2x" className="text-gray-600" icon={faSpotify} />
                </a>
                <a href="https://www.youtube.com/user/ShabbatonChoir" target="_blank" rel="noreferrer">
                    <FontAwesomeIcon size="2x" className="text-gray-600" icon={faYoutube} />
                </a>
            </div>
        </footer>
    );
}

export default Footer;