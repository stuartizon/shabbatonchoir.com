import Image from 'next/image';
import { FC } from 'react';

const Album: FC<AlbumProps> = ({ name, description, year, image }) => {
    return (
        <div className="bg-white shadow-d rounded-lg overflow-hidden w-64 mx-2 mb-4">
            <div className="relative pb-48 overflow-hidden">
                <div className="absolute inset-0 h-full w-full object-cover bg-gray-50">
                    <Image src={image} alt={name} layout="fill" />
                </div>
            </div>
            <div className="p-2">
                <span className="inline-block px-2 py-1 leading-none rounded-full font-semibold text-xs">{year}</span>
                <h2 className="font-bold">{name}</h2>
                <p className="text-sm">{description}</p>
                {/* <span className="fab fa-spotify text-gray-700 mr-2"></span>
                <span className="fab fa-apple text-gray-700 mr-2"></span>
                <span className="fab fa-amazon text-gray-700 mr-2"></span> */}
            </div>
        </div>
    );
}

interface AlbumProps {
    name: string,
    description?: string,
    year: string,
    image: string
}

export default Album;