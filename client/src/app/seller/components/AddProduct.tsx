import { RootState } from "@/app/redux/store";
import apiClient from "@/utils/axiosInstance";
import { useState } from "react";
import { useSelector } from "react-redux";

interface AddProductPopupProps {
  onClose: () => void;
  onProductAdded: () => void;
}

export default function AddProduct({ onClose, onProductAdded }: AddProductPopupProps) {
  const sellerName = useSelector((data: RootState) => data.sellerState.sellerName);
  const token = useSelector((data: RootState) => data.sellerState.token);

  const [productDetails, setProductDetails] = useState({
    id: "",
    name: "",
    company: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    sellerName,
  });

  const [images, setImages] = useState<File[]>([]); // State to store multiple images
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductDetails((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? parseInt(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!productDetails.id.trim()) newErrors.id = "ID is required";
    if (!productDetails.name.trim()) newErrors.name = "Name is required";
    if (!productDetails.company.trim()) newErrors.company = "Company is required";
    if (!productDetails.description.trim()) newErrors.description = "Description is required";
    if (productDetails.price <= 0) newErrors.price = "Price must be greater than 0";
    if (!productDetails.category.trim()) newErrors.category = "Category is required";
    if (productDetails.stock <= 0) newErrors.stock = "Stock must be greater than 0";
    if (images.length === 0) newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImagesToCloudinary = async (): Promise<string[]> => {
    console.log('images', images);
    const urls: string[] = [];
    for (const image of images) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
      formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        urls.push(data.secure_url);
      } catch (err) {
        console.error("Image upload failed:", err);
        alert("Failed to upload an image. Please try again.");
      }
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill all fields correctly.");
      return;
    }

    const imageUrls = await uploadImagesToCloudinary();
    if (imageUrls.length === 0) return;

    const productData = {
      ...productDetails,
      images: imageUrls, // Pass all Cloudinary URLs to the backend
    };


    console.log("Product Added:", productData);

    try {
      const response = await apiClient.post("/products/addProduct", productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response", response.data.data);
      onProductAdded(); // Trigger product list refresh
      alert("Product added successfully!");
    } catch (err: any) {
      console.log("Failed to add products", err);
      alert("Adding product failed!");
    }
    onClose(); // Close the popup after submission
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Add Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: ID and Name */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-1">ID</label>
              <input
                type="text"
                name="id"
                value={productDetails.id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.id && <p className="text-red-500 text-sm">{errors.id}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={productDetails.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
          </div>
          {/* Row 2: Company and Price */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-1">Company</label>
              <input
                type="text"
                name="company"
                value={productDetails.company}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.company && <p className="text-red-500 text-sm">{errors.company}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={productDetails.price || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
            </div>
          </div>
          {/* Row 3: Category and Stock */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={productDetails.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                value={productDetails.stock || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
            </div>
          </div>
          {/* Row 4: Description (full-width) */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={productDetails.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>
          {/* Image Upload Section */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
            <div className="mt-3 flex flex-wrap gap-3">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-gray-100 p-2 rounded-md"
                >
                  <p className="truncate max-w-[150px] text-black" title={image.name}>
                    {image.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

          </div>
          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
