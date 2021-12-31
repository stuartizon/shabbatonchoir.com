import { faAmazon, faItunesNote, faSpotify } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';

const Album: FC<AlbumProps> = ({ name, description, year, image, amazonLink, appleLink, spotifyLink }) => {
    return (
        <div className="bg-white rounded-lg overflow-hidden w-80 mb-8">
            <div className=" h-full w-full bg-gray-50 rounded-b-lg">
                <img src={image} alt={name} className="w-full max-h-72" />
                <div className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="font-semibold text-xs">{year}</div>
                        <div className="flex gap-x-2">
                            <a href={spotifyLink} target="_blank" rel="noreferrer">
                                <FontAwesomeIcon className="text-gray-600" icon={faSpotify} />
                            </a>
                            <a href={appleLink} target="_blank" rel="noreferrer">
                                <FontAwesomeIcon className="text-gray-600" icon={faItunesNote} />
                            </a>
                            <a href={amazonLink} target="_blank" rel="noreferrer">
                                <FontAwesomeIcon className="text-gray-600" icon={faAmazon} />
                            </a>
                        </div>
                    </div>
                    <h2 className="font-bold my-4">{name}</h2>
                    <p className="text-sm my-2">{description}</p>
                </div>
            </div>
        </div>
    );
}

interface AlbumProps {
    name: string,
    description?: string,
    year: string,
    image: string,
    amazonLink: string,
    appleLink: string,
    spotifyLink: string
}

export default Album;