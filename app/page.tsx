import FeaturedPerfumes from 'components/carousel';
import { ThreeItemGrid } from 'components/grid/three-items';
import PerfumeBanner from 'components/hero-banner';

import Footer from 'components/layout/footer';

export const metadata = {
  description:
    'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default function HomePage() {
  return (
    <>
      <PerfumeBanner />
      <ThreeItemGrid />
      <FeaturedPerfumes />
      <Footer />
    </>
  );
}
