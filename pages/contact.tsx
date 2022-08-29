
import type { NextPage } from 'next';
import Link from 'next/link';
import Layout from '../components/layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Contact: NextPage = () => {
    return (
        <Layout title="Contact">
            To contact us, please:
            <div className='flex flex-col md:flex-row mt-4 mb-16 justify-evenly gap-4'>
                <div className='border-1 shadow-md p-6 text-center'>
                    <div className='flex items-center justify-center gap-2 m-4'><FontAwesomeIcon size="2x" icon={faEnvelope} /> EMAIL US</div>
                    <Link href="mailto:info@shabbatonchoir.com"><a target="_blank" rel="noreferrer">info@shabbatonchoir.com</a></Link>
                </div>
                <div className='border-1 shadow-md p-6 text-center'>
                    <div className='flex items-center justify-center gap-2 m-4'><FontAwesomeIcon size="2x" icon={faComment} /> MESSAGE US</div>
                    via <Link href="https://m.me/shabbatonchoir"><a target="_blank" rel="noreferrer">Facebook messenger</a></Link>
                </div>
            </div>
        </Layout>
    );
}

export default Contact;