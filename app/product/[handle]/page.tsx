import axios from 'axios';
import Footer from 'components/layout/footer';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ProductClient from './product';

// Updated Perfume interface to match MongoDB schema
interface PerfumeImage {
  url: string;
  alt: string;
  isPrimary: boolean;
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
  gender: 'Male' | 'Female' | 'Unisex';
  images: PerfumeImage[];
  isNew: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  averageRating: number;
  totalReviews: number;
  collections?: string[];
}

// Function to fetch a product by handle on the server side
async function getProduct(handle: string): Promise<Perfume | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await axios.get(`${baseUrl}/api/perfumes/${handle}`);
    console.log('Fetched product:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  // Fetch the product using the handle parameter
  const product = await getProduct(params.handle);

  // Return 404 if product not found
  if (!product) return notFound();

  // Get primary image or first image
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];

  // Structured data for SEO
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: primaryImage?.url,
    brand: {
      '@type': 'Brand',
      name: product.brand
    },
    offers: {
      '@type': 'Offer',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      priceCurrency: 'USD',
      price: product.discountPrice || product.price,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    },
    aggregateRating: product.totalReviews > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.averageRating,
      reviewCount: product.totalReviews
    } : undefined
  };

  return (
    <>
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-4 md:py-10">
        {/* Breadcrumbs */}
        <div className="mb-4 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col rounded-lg border border-neutral-200 p-4 sm:p-8 md:p-12 lg:flex-row lg:gap-8 bg-white shadow-sm">
          {/* Product Images */}
          <div className="h-full w-full basis-full lg:basis-3/5 mb-4">
            <Suspense fallback={<ProductImageSkeleton />}>
              {/* Image Gallery Component */}
              <ProductImageGallery images={product.images} name={product.name} />
            </Suspense>
          </div>

          {/* Product Details */}
          <div className="basis-full lg:basis-2/5">
            <ProductClient product={product} />
          </div>
        </div>

        {/* Related Products */}
        {/* <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProducts currentProductId={product._id} />
        </Suspense> */}
      </div>
      <Footer />
    </>
  );
}

function ProductImageGallery({ images, name }: { images: PerfumeImage[], name: string }) {
  // Get primary image first, then sort the rest
  const primaryImage = images.find(img => img.isPrimary) || images[0];
  const otherImages = images.filter(img => img !== primaryImage);
  const allImages = [primaryImage, ...otherImages];

  return (
    <div className="space-y-4">
      {/* Main large image */}
      <div className="mx-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        <div className="aspect-square relative overflow-hidden bg-gray-50 rounded-lg border border-gray-100">
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || name}
              fill
              className="object-contain object-center transition-opacity duration-300"
              priority
              sizes="(min-width: 1024px) 35vw, (min-width: 768px) 50vw, (min-width: 640px) 60vw, 75vw"
            />
          )}
        </div>
      </div>

      {/* Thumbnail images */}
      {images.length > 1 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {allImages.map((image, index) => (
            image ? (
              <div
                key={index}
                className={`w-16 h-16 border-2 rounded-md overflow-hidden ${image === primaryImage ? 'border-amber-500' : 'border-gray-200 cursor-pointer hover:border-gray-300'
                  }`}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={image.url}
                    alt={image.alt || `${name} - View ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              </div>
            ) : null
          ))}
        </div>
      )}
    </div>
  );
}

function ProductImageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="mx-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="w-16 h-16 bg-gray-200 rounded-md animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}

// // Client component for related products with API call
// "use client";

// function RelatedProducts({ currentProductId }: { currentProductId: string }) {
//   const [relatedProducts, setRelatedProducts] = useState<Perfume[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchRelatedProducts() {
//       try {
//         // Replace with your actual API endpoint
//         const response = await axios.get(`/api/perfumes/related/${currentProductId}`);
//         setRelatedProducts(response.data || []);
//       } catch (error) {
//         console.error('Failed to fetch related products:', error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchRelatedProducts();
//   }, [currentProductId]);

//   // Don't render anything if no related products and not loading
//   if (!loading && relatedProducts.length === 0) return null;

//   return (
//     <div className="py-8">
//       <h2 className="mb-4 text-2xl font-bold">Related Products</h2>

//       {loading ? (
//         <ul className="flex w-full gap-4 overflow-x-auto pt-1">
//           {[1, 2, 3, 4].map((i) => (
//             <li key={i} className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5">
//               <div className="h-full w-full bg-gray-200 rounded animate-pulse"></div>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <ul className="flex w-full gap-4 overflow-x-auto pt-1">
//           {relatedProducts.map((product: any) => {
//             const image = product.images.find((img: any) => img.isPrimary) || product.images[0];

//             return (
//               <li
//                 key={product._id}
//                 className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
//               >
//                 <Link
//                   className="relative h-full w-full"
//                   href={`/product/${product._id}`}
//                   prefetch={true}
//                 >
//                   <div className="group relative h-full w-full overflow-hidden rounded-lg shadow-sm">
//                     <div className="relative h-full w-full">
//                       <Image
//                         src={image.url}
//                         alt={image.alt || product.name}
//                         fill
//                         className="object-cover transition-transform duration-300 group-hover:scale-105"
//                         sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
//                       />
//                     </div>

//                     {/* Discount badge */}
//                     {product.discountPrice && (
//                       <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
//                         {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
//                       </div>
//                     )}

//                     <div className="absolute bottom-0 left-0 w-full bg-white bg-opacity-90 p-3 transition-all duration-300">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <p className="font-medium text-sm line-clamp-1">{product.name}</p>
//                           <p className="text-gray-700 text-xs">{product.brand}</p>
//                         </div>
//                         <div className="text-right">
//                           {product.discountPrice ? (
//                             <>
//                               <p className="text-sm font-bold text-red-600">${product.discountPrice.toFixed(2)}</p>
//                               <p className="text-xs line-through text-gray-500">${product.price.toFixed(2)}</p>
//                             </>
//                           ) : (
//                             <p className="text-sm font-bold">${product.price.toFixed(2)}</p>
//                           )}
//                         </div>
//                       </div>

//                       {/* Tags */}
//                       <div className="flex items-center gap-1 mt-1">
//                         {product.isBestseller && (
//                           <span className="text-xs bg-amber-100 text-amber-800 px-1 py-0.5 rounded">Bestseller</span>
//                         )}
//                         {product.isNew && (
//                           <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">New</span>
//                         )}
//                         {product.stock <= 5 && product.stock > 0 && (
//                           <span className="text-xs bg-red-100 text-red-800 px-1 py-0.5 rounded">Low Stock</span>
//                         )}
//                       </div>

//                       {/* Rating */}
//                       {product.totalReviews > 0 && (
//                         <div className="flex items-center gap-1 mt-1">
//                           <div className="flex items-center">
//                             {[1, 2, 3, 4, 5].map((star) => (
//                               <span key={star} className="text-amber-400 text-xs">
//                                 ★
//                               </span>
//                             ))}
//                           </div>
//                           <span className="text-xs text-gray-600">({product.totalReviews})</span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>
//       )}
//     </div>
//   );
// }

// function RelatedProductsSkeleton() {
//   return (
//     <div className="py-8">
//       <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
//       <ul className="flex w-full gap-4 overflow-x-auto pt-1">
//         {[1, 2, 3, 4].map((i) => (
//           <li key={i} className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5">
//             <div className="h-full w-full bg-gray-200 rounded animate-pulse"></div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }