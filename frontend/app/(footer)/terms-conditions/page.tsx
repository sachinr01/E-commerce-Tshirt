import { renderStaticPage } from '../_pageTemplate';

export const dynamic = 'force-dynamic';

export default async function Page() {
  return renderStaticPage('terms-conditions');
}
