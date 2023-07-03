import { FC } from "react";
import { Footer } from "./footer";
import Head from 'next/head';
import Header from "./header";
import Background from "./Background";

export const Layout: FC<any> = ({ dim = false, children }) => {
    return (
        <>
            <Head>
                <title>Joven Motors</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0" />
                <meta name="description" content="Joven Motors" />
                <meta name="keywords" content="Joven Motors" />
                <meta name="robots" content="index, follow" />
                <meta name="web_author" content="Alvan Caleb Arulandu" />

                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#355dab" />
                <meta name="msapplication-TileColor" content="#2b5797" />
                <meta name="theme-color" content="#ffffff" />

            </Head>
            {children}
        </>
    );
}