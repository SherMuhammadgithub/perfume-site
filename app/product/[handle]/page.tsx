import axios from "axios";
import Footer from "components/layout/footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductClient from "./product";
import { ProductImageGallery } from "./product-image-gallery";

// Dynamically import the client component
// const DynamicProductImageGallery = dynamic(() =>
//   import('./product-image-gallery').then(mod => mod.ProductImageGallery),
//   { ssr: false, loading: () => <ProductImageSkeleton /> }
// );

// Updated Perfume interface to match MongoDB schema
interface PerfumeImage {
  url: string;
  alt: string;
}

interface Perfume {
  _id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  discountPrice?: number;
  volume: string;
  stock: number;
  gender: "Male" | "Female" | "Unisex";
  images: PerfumeImage[];
  isNew: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  averageRating: number;
  totalReviews: number;
  collections?: string[];
}

// Function to fetch a product by handle on the server side
async function getProduct(handle: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await axios.get(`${baseUrl}/api/perfumes/${handle}`);
    console.log("Fetched product:", response.data);
    return response.data.perfume;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

export default async function ProductPage({
  params,
  searchParams, // Add this parameter
}: {
  params: Promise<{ handle: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>; // Add this type
}) {
  // Fetch the product using the handle parameter
  const { handle } = await params;
  const product = await getProduct(handle);

  // Return 404 if product not found
  if (!product) return notFound();

  // Get primary image or first image
  const primaryImage = product.images[0];

  // Structured data for SEO
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: primaryImage?.url,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      priceCurrency: "USD",
      price: product.discountPrice || product.price,
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      )
        .toISOString()
        .split("T")[0],
    },
    aggregateRating:
      product.totalReviews > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.averageRating,
            reviewCount: product.totalReviews,
          }
        : undefined,
  };

  return (
    <>
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-4 md:py-10">
        {/* Breadcrumbs */}
        <div className="mb-4 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col rounded-lg border border-neutral-200 p-4 sm:p-8 md:p-12 lg:flex-row lg:gap-8 bg-white shadow-sm">
          {/* Product Images */}
          <div className="h-full w-full basis-full lg:basis-3/5 mb-4">
            <ProductImageGallery images={product.images} name={product.name} />
          </div>

          {/* Product Details */}
          <div className="basis-full lg:basis-2/5">
            <ProductClient product={product} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
