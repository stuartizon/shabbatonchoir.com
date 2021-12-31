import { FC } from 'react';

const Album: FC<AlbumProps> = ({ name, description, year, image }) => {
    return (
        <div className="bg-white rounded-lg overflow-hidden w-80 mb-8">
            <div className=" h-full w-full bg-gray-50 rounded-b-lg">
                <img src={image} alt={name} className="w-full max-h-72" />
                <div className="px-4">
                    <span className="inline-block py-1 mt-4 leading-none rounded-full font-semibold text-xs">{year}</span>
                    <h2 className="font-bold my-4">{name}</h2>
                    <p className="text-sm my-2">{description}</p>
                    {/* <span className="fab fa-spotify text-gray-700 mr-2"></span>
                <span className="fab fa-apple text-gray-700 mr-2"></span>
                <span className="fab fa-amazon text-gray-700 mr-2"></span> */}
                </div>
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