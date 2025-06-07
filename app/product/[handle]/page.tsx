import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductClient from "./product";
import { ProductImageGallery } from "./product-image-gallery";

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

// Server component fetch with proper URL handling
async function getProduct(handle: string) {
  try {
    // Get host from headers for reliable URL resolution in production
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

    // Build the full URL but still use relative format for the actual fetch
    console.log(
      `Fetching product from: ${protocol}://${host}/api/perfumes/${handle}`
    );

    const response = await fetch(
      `${protocol}://${host}/api/perfumes/${handle}`,
      {
        cache: "no-store",
        // This is the key change - Next.js needs to know this is a "self" request
        next: {
          tags: ["product", handle],
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`);
    }

    const data = await response.json();
    return data.perfume;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

interface PageProps {
  params: Promise<{ handle: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductPage({ params, searchParams }: PageProps) {
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
    </>
  );
}
