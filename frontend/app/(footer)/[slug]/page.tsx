import { renderStaticPage } from '../_pageTemplate';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return renderStaticPage(slug);
}
