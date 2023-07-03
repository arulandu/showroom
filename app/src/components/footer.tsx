import Image from 'next/image'
import Link from 'next/link'
import SiteLink from './SiteLink';


export const Footer = () => {
    return (
        <footer className="relative mt-12 p-4 md:p-8 lg:px-24 text-white w-full pb-4 bg-navy bg-opacity-75">
            <p className='mt-4 text-center text-base'>Made with 💖 by <SiteLink href={"https://arulandu.com"} txt="Alvan Caleb Arulandu" /> </p>
            <div className='mt-2 flex justify-center flex-wrap'>
                <a className='inline-block align-middle' href="https://github.com/Claeb101/showroom">
                    <img className='h-full' src="https://img.shields.io/github/last-commit/Claeb101/showroom" />
                </a>
            </div>
        </footer>
    );
}