import Link from "next/link";

const SiteLink = ({txt, href, className=""}) => {
  return (
    <Link href={href} passHref><a target="_blank" className={`underline text-white hover:text-blue transition-all ${className}`}>{txt}</a></Link>
  );
}

export default SiteLink