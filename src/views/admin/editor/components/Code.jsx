// import { Lang } from 'shiki';
import { highlight } from '@/lib/shiki';

export const Code = async ({ code, lang }) => {
  const component = await highlight(code, 'github-dark', lang);

  return <div dangerouslySetInnerHTML={{ __html: component }} />;
};

export default Code;
