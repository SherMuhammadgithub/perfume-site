export interface PerfumeImage {
    url: string;
    alt?: string;
    isPrimary?: boolean;
}

export interface Perfume {
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
    // Optionally add category if you use it elsewhere
    category?: string;
}


// navbar menu
export interface NavbarMenuItem {
    title: string;
    path: string;
}