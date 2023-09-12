import React from 'react';

interface LoaderProps {
    loadingText?: string;
}
const Loader: React.FC<LoaderProps> = ({ loadingText }) => {
    return (
        <section>
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-l-transparent align-middle ltr:mr-4 rtl:ml-4"></span>
            {loadingText ?? 'Loading'}
        </section>
    );
};

export default Loader;
