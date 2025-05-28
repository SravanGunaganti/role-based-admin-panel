import React, { useState } from "react";
import type { IProduct } from "../../types";
import { FaPlus } from "react-icons/fa";
import { useProducts } from "../../context/ProductContext";
import ConfirmBox from "../../components/ConfirmBox";
import { useForm } from "react-hook-form";
import SuccessBox from "../../components/SuccessBox";

interface ProductForm {
  name: string;
  description: string;
  price: number;
  image: string;
}

const ManageProducts: React.FC = () => {
  const { products, updateProduct, addProduct, deleteProduct } = useProducts();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductForm>();

  const resetForm = () => {
    reset({
      name: "",
      description: "",
      price: 0,
      image: "",
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: IProduct) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      description: product.description || "",
      price: product.price,
      image: product.image || "",
    });
    const container = document.getElementById("main");
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
    } catch (error: any) {
      setError(error?.message || "Failed To delete products");
    }
  };

  const onSubmit = async (formData: ProductForm) => {
    setError(null);

    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id!, formData);
      } else {
        await addProduct(formData);
      }
      setShowSuccess(true);
      reset({
        name: "",
        description: "",
        price: 0,
        image: "",
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: any) => {
    setDeleteProductId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteProductId) {
      handleDeleteProduct(deleteProductId);
    }
    setShowConfirm(false);
    setShowSuccess(true);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  const hideSuccess = () => {
    setShowSuccess(false);
    setDeleteProductId(null);
    setEditingProduct(null);
  };

  if (!products) return <p>No Products Found</p>;

  return (
    <>
      <div>
        <h1 className=" text-blue-600 text-2xl md:text-3xl text-center font-bold mb-4">
          Products Management
        </h1>
        <div className="flex justify-center">
          {isAddingProduct || editingProduct ? (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mb-8 w-full max-w-md bg-white p-6 rounded-lg shadow-md">
              {error && <p className="text-red-600 mb-3">{error}</p>}
              <div className="mb-4">
                <label className="block mb-1 font-medium" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  {...register("name", {
                    required: "Product name is required",
                  })}
                  placeholder="Enter Product Name"
                  required
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 outline-0"
                  type="text"
                />
              </div>

              {errors.name && (
                <p className="text-red-600 text-sm mb-4">
                  {errors.name.message}
                </p>
              )}
              <div className="mb-4">
                <label className="block mb-1 font-medium" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Enter Product Description"
                  {...register("description", {
                    required: "Product description is required",
                  })}
                  className="w-full font-outfit bg-white border border-gray-300 rounded-lg p-2 outline-0"
                  rows={3}
                  minLength={50}
                  maxLength={250}
                />
              </div>
              {errors.description && (
                <p className="text-red-600 text-sm mb-4">
                  {errors.description.message}
                </p>
              )}
              <div className="mb-4">
                <label className="block mb-1 font-medium" htmlFor="price">
                  Price
                </label>
                <input
                  id="price"
                  placeholder="Enter Price"
                  {...register("price", { required: "Price is required" })}
                  required
                  min={0}
                  step={1}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 outline-0"
                  type="number"
                />
              </div>
              {errors.price && (
                <p className="text-red-600 text-sm mb-4">
                  {errors.price.message}
                </p>
              )}
              <div className="mb-4">
                <label className="block mb-1 font-medium" htmlFor="image">
                  Image URL
                </label>
                <input
                  id="image"
                  placeholder="Enter image url"
                  {...register("image", { required: "Image url is required" })}
                  className="w-full bg-white font-outfit  border border-gray-300 rounded-lg p-2 outline-0"
                  type="text"
                />
              </div>
              {errors.image && (
                <p className="text-red-600 text-sm mb-4">
                  {errors.image.message}
                </p>
              )}
              <div className="flex justify-center w-full gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 w-full text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  {isSubmitting
                    ? "Saving..."
                    : editingProduct
                      ? "Update Product"
                      : "Add Product"}
                </button>

                {editingProduct && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-100 text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                    Cancel
                  </button>
                )}
              </div>
              {error && (
                <p className="text-red-600 mb-3 text-center">{error}</p>
              )}
            </form>
          ) : (
            <button
              className=" w-fit flex justify-center items-center bg-blue-500 px-4 py-2 text-white rounded-lg border border-gray-200 hover:bg-blue-600 transition gap-2 mb-4"
              onClick={() => setIsAddingProduct(true)}>
              Add Product{" "}
              <strong className="text-xl flex justify-center items-center">
                <FaPlus />
              </strong>
            </button>
          )}
        </div>

        <h3 className="text-2xl font-semibold mb-4">Product List</h3>

        {loading && products?.length ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <li className="bg-white border border-gray-200 p-6 max-w-[300px] md:max-w-full mx-auto rounded-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="aspect-square w-full rounded-lg xl:aspect-7/8"
                />
                <h3 className="mt-4 text-md font-medium text-black">
                  {product.name}
                </h3>

                <p className="mt-3 text-sm font-outfit line-clamp-1 text-gray-500">
                  {product.description!}
                </p>
                <p className="mt-2 mb-2 text-xl font-extrabold text-blue-600">
                  &#x20B9; {product.price}/-
                </p>
                <div className="gap-3 grid grid-cols-2">
                  <button
                    onClick={() => handleEdit(product!)}
                    className="text-blue-700 bg-brand border border-blue-200 px-3 py-1 rounded-md hover:bg-blue-100 transition">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id!)}
                    className="bg-red-100 text-red-600 px-3 py-1 border border-red-200 rounded hover:bg-red-200 transition">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {showConfirm && (
        <ConfirmBox
          message="Are you sure you want to delete?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
      {showSuccess && (
        <SuccessBox
          message={
            deleteProductId
              ? "Product Deleted Successfully"
              : editingProduct
                ? "Product Updated Successfully"
                : "Product Added Successfully"
          }
          onClose={hideSuccess}
        />
      )}
    </>
  );
};

export default ManageProducts;
