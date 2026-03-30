// const AddRecipePage = () => <div>Add Recipe</div>;
// export default AddRecipePage;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../../components/common/Layout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { createRecipeApi, uploadImageApi } from '../../api/recipe.api';
import { useForm } from 'react-hook-form';

const CATEGORIES = [
  'Breakfast', 'Lunch', 'Dinner',
  'Dessert', 'Snack', 'Beverage', 'Other',
];

const AddRecipePage = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([
    { name: '', amount: '' },
  ]);
  const [instructions, setInstructions] = useState([
    { step: 1, text: '' },
  ]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // --- ingredient handlers ---
  const addIngredient = () =>
    setIngredients((prev) => [...prev, { name: '', amount: '' }]);

  const removeIngredient = (index) =>
    setIngredients((prev) => prev.filter((_, i) => i !== index));

  const updateIngredient = (index, field, value) =>
    setIngredients((prev) =>
      prev.map((ing, i) =>
        i === index ? { ...ing, [field]: value } : ing
      )
    );

  // --- instruction handlers ---
  const addInstruction = () =>
    setInstructions((prev) => [
      ...prev,
      { step: prev.length + 1, text: '' },
    ]);

  const removeInstruction = (index) =>
    setInstructions((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((inst, i) => ({ ...inst, step: i + 1 }))
    );

  const updateInstruction = (index, value) =>
    setInstructions((prev) =>
      prev.map((inst, i) =>
        i === index ? { ...inst, text: value } : inst
      )
    );

  // --- image handlers ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // --- submit ---
  const onSubmit = async (data) => {
    // validate dynamic fields
    const validIngredients = ingredients.filter(
      (i) => i.name.trim() && i.amount.trim()
    );
    if (validIngredients.length === 0) {
      toast.error('Add at least one ingredient');
      return;
    }
    const validInstructions = instructions.filter(
      (i) => i.text.trim()
    );
    if (validInstructions.length === 0) {
      toast.error('Add at least one instruction');
      return;
    }

    try {
      let imageUrl = '';

      // upload image first if one was selected
      if (imageFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await uploadImageApi(formData);
        imageUrl = uploadRes.data.data.imageUrl;
        setUploading(false);
      }

      await createRecipeApi({
        ...data,
        ingredients: validIngredients,
        instructions: validInstructions,
        image: imageUrl,
        prepTime: Number(data.prepTime),
        cookTime: Number(data.cookTime),
        servings: Number(data.servings),
      });

      toast.success('Recipe created!');
      navigate('/my-recipes');
    } catch (err) {
      setUploading(false);
      toast.error(
        err.response?.data?.message || 'Failed to create recipe'
      );
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Add New Recipe
          </h1>
          <p className="text-gray-500 mt-1">
            Share your recipe with the community
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}
          className="space-y-8">

          {/* basic info */}
          <div className="card p-6 space-y-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h2>

            <Input
              label="Recipe Title"
              name="title"
              placeholder="e.g. Nepali Dal Bhat"
              register={register('title', {
                required: 'Title is required',
                maxLength: {
                  value: 100,
                  message: 'Max 100 characters',
                },
              })}
              error={errors.title?.message}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register('description', {
                  required: 'Description is required',
                  maxLength: {
                    value: 500,
                    message: 'Max 500 characters',
                  },
                })}
                placeholder="Brief description of your recipe..."
                rows={3}
                className="input-field resize-none"
              />
              {errors.description && (
                <span className="text-xs text-red-500">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  {...register('category', {
                    required: 'Category is required',
                  })}
                  className="input-field"
                >
                  <option value="">Select category...</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.category && (
                  <span className="text-xs text-red-500">
                    {errors.category.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Difficulty
                </label>
                <select
                  {...register('difficulty')}
                  className="input-field"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Prep Time (min)"
                name="prepTime"
                type="number"
                placeholder="30"
                register={register('prepTime', {
                  required: 'Required',
                  min: { value: 0, message: 'Min 0' },
                })}
                error={errors.prepTime?.message}
              />
              <Input
                label="Cook Time (min)"
                name="cookTime"
                type="number"
                placeholder="20"
                register={register('cookTime', {
                  required: 'Required',
                  min: { value: 0, message: 'Min 0' },
                })}
                error={errors.cookTime?.message}
              />
              <Input
                label="Servings"
                name="servings"
                type="number"
                placeholder="4"
                register={register('servings', {
                  required: 'Required',
                  min: { value: 1, message: 'Min 1' },
                })}
                error={errors.servings?.message}
              />
            </div>
          </div>

          {/* image upload */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recipe Image
            </h2>

            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white
                             w-7 h-7 rounded-full flex items-center
                             justify-center text-sm hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-200
                                rounded-xl p-8 flex flex-col items-center
                                justify-center cursor-pointer
                                hover:border-primary-300 transition-colors">
                <svg className="w-10 h-10 text-gray-300 mb-3"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-500 font-medium">
                  Click to upload image
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG, WEBP up to 5MB
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* ingredients */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Ingredients
            </h2>
            <div className="space-y-3">
              {ingredients.map((ing, index) => (
                <div key={index}
                  className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Ingredient name"
                    value={ing.name}
                    onChange={(e) =>
                      updateIngredient(index, 'name', e.target.value)
                    }
                    className="input-field flex-1"
                  />
                  <input
                    type="text"
                    placeholder="Amount"
                    value={ing.amount}
                    onChange={(e) =>
                      updateIngredient(index, 'amount', e.target.value)
                    }
                    className="input-field w-28"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="text-red-400 hover:text-red-600
                                 transition-colors flex-shrink-0"
                    >
                      <svg className="w-5 h-5" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addIngredient}
              className="mt-3 text-primary-500 text-sm font-medium
                         hover:text-primary-600 flex items-center gap-1"
            >
              + Add Ingredient
            </button>
          </div>

          {/* instructions */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Instructions
            </h2>
            <div className="space-y-4">
              {instructions.map((inst, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-500
                                  text-white flex items-center
                                  justify-center text-sm font-bold
                                  flex-shrink-0 mt-1">
                    {inst.step}
                  </div>
                  <div className="flex-1 flex gap-2">
                    <textarea
                      placeholder={`Step ${inst.step}...`}
                      value={inst.text}
                      onChange={(e) =>
                        updateInstruction(index, e.target.value)
                      }
                      rows={2}
                      className="input-field resize-none flex-1"
                    />
                    {instructions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInstruction(index)}
                        className="text-red-400 hover:text-red-600
                                   transition-colors self-start mt-1"
                      >
                        <svg className="w-5 h-5" fill="none"
                          viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round"
                            strokeLinejoin="round" strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addInstruction}
              className="mt-3 text-primary-500 text-sm font-medium
                         hover:text-primary-600 flex items-center gap-1"
            >
              + Add Step
            </button>
          </div>

          {/* submit */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting || uploading}
            >
              {uploading ? 'Uploading image...' : 'Create Recipe'}
            </Button>
          </div>

        </form>
      </div>
    </Layout>
  );
};

export default AddRecipePage;