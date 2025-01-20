"use client";

import { Product } from "@/types/product";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StarRateIcon from "@mui/icons-material/StarRate";
import "@/styles/globals.css";
import Image from "next/image";


interface ProductCardProps {
    product: Product;
    onViewSales: (productId: string) => void;
    onViewReviews: (productId: string) => void;
    onEdit: (product: Product) => void;
    onDelete: (productId: string) => void;
}

export default function ProductCard({
    product,
    onViewSales,
    onViewReviews,
    onEdit,
    onDelete,
}: ProductCardProps) {
    return (
        <div className="bg-custom-light-teal shadow-md rounded-lg overflow-hidden flex flex-col">
            {/* Image Slider */}
            <div className="relative">
                {product.images.length > 0 ? (
                    <Carousel
                        showArrows={true}
                        showThumbs={false}
                        infiniteLoop
                        autoPlay
                        className="h-80"
                    >
                        {product.images.map((image, index) => (
                            <div className="h-80 mx-auto">
                            <Image
                                key={index}
                                src={image}
                                alt={`${product.name} - ${index + 1}`}
                                className="object-cover"
                                width={320} // Match height of `h-80` (80 * 4 = 320px for Tailwind)
                                height={320} // Adjust width proportionally or as needed
                            />
                        </div>
                        ))}
                    </Carousel>
                ) : (
                    <div className="h-80 bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500 italic">No images available</p>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-bold text-gray-800 truncate">{product.name}</h2>
                <div className="text-sm text-gray-600 flex justify-between">
                    <p>Company: {product.company}</p>
                    <p>Category: {product.category}</p>
                </div>
                <div className="text-gray-800 flex justify-between text-lg font-semibold mt-2">
                    <p>Price: ${product.price}</p>
                    <p>Stock: {product.stock}</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-around items-center p-2 bg-gray-100 border-t">
                <Tooltip title="View Sales">
                    <IconButton
                        aria-label="View Sales"
                        onClick={() => onViewSales(product.id)}
                        color="success"
                    >
                        <VisibilityIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="View Reviews">
                    <IconButton
                        aria-label="View Reviews"
                        onClick={() => onViewReviews(product.id)}
                        color="primary"
                    >
                        <StarRateIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Edit Product">
                    <IconButton
                        aria-label="Edit Product"
                        onClick={() => onEdit(product)}
                        color="warning"
                    >
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete Product">
                    <IconButton
                        aria-label="Delete Product"
                        onClick={() => onDelete(product.id)}
                        color="error"
                    >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    );
}
