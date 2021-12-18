
import type { NextPage } from 'next'
import Layout from '../components/layout'

const Contact: NextPage = () => {
    return (
        <Layout title="Contact">
            <div className="flex flex-grow justify-around">
                <div className="flex-1 rounded-md bg-gray-100 p-4 mb-6">
                    <h3>Send us a message</h3>
                    <form className="flex flex-col">
                        <input className="rounded-md my-2 border-gray-300 shadow-sm focus:indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="Email address" type="email" />
                        <input className="rounded-md my-2 border-gray-300 shadow-sm focus:indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="Subject" type="text" />
                        <textarea className="rounded-md my-2 border-gray-300 shadow-sm focus:indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" placeholder="Message" />
                        <button disabled className="rounded-full mx-auto my-2 bg-gray-400 text-gray-50 px-4 py-2 text-sm">Send message</button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default Contact;