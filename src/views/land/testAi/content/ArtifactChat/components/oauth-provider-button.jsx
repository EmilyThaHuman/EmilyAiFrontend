import { Image } from 'mui-image';
import { twMerge } from 'tailwind-merge';

import { Button } from '@/components/ui/button';

export const OAuthProviderButton = ({
  onClick,
  className = '',
  children,
  provider,
}) => {
  return (
    <Button
      onClick={onClick}
      className={twMerge(
        'w-full bg-white text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 flex items-center justify-center',
        className
      )}
    >
      <Image
        src={`/${provider}.svg`}
        alt={provider}
        width={20}
        height={20}
        className="mr-2"
      />

      {children}
    </Button>
  );
};
