export interface Product {
    id: string;
    title: string;
    description: string;
    inStock: number;
    price: number;
    slug: string;
    tags: string[];
    sizes: Size[];
    gender: Category
    //todo: type: Type;
    images: string[];
}

export interface CartProduct {
    id: string;
    slug: string;
    title: string;
    price: number;
    quantity: number;
    size: Size;
    image: string;
}

export type Category = 'men'|'women'|'kid'|'unisex'
export type Size = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';
export type Type = 'shirts'|'pants'|'hoodies'|'hats';
