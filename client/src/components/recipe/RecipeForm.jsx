import Button from '../common/Button';
import Input from '../common/Input';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Breakfast', 'Lunch', 'Dinner',
  'Dessert', 'Snack', 'Beverage', 'Other',
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const RecipeForm = ({
  register,
  handleSubmit,
  errors,
  isSubmitting,
  onSubmit,
  ingredients,
  addIngredient,
  removeIngredient,
  updateIngredient,
  instructions,
  addInstruction,
  removeInstruction,
  updateInstruction,
  imageFile,
  imagePreview,
  handleImageChange,
  uploading,
}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

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
              className="input-field bg-white"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
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
              {...register('difficulty', {
                required: 'Difficulty is required',
              })}
              className="input-field bg-white"
            >
              <option value="">Select difficulty</option>
              {DIFFICULTIES.map((diff) => (
                <option key={diff} value={diff}>
                  {diff}
                </option>
              ))}
            </select>
            {errors.difficulty && (
              <span className="text-xs text-red-500">
                {errors.difficulty.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Prep Time (mins)"
            name="prepTime"
            type="number"
            min={1}
            register={register('prepTime', {
              required: 'Prep time is required',
              min: { value: 1, message: 'Must be at least 1' },
            })}
            error={errors.prepTime?.message}
          />

          <Input
            label="Cook Time (mins)"
            name="cookTime"
            type="number"
            min={1}
            register={register('cookTime', {
              required: 'Cook time is required',
              min: { value: 1, message: 'Must be at least 1' },
            })}
            error={errors.cookTime?.message}
          />

          <Input
            label="Servings"
            name="servings"
            type="number"
            min={1}
            register={register('servings', {
              required: 'Servings is required',
              min: { value: 1, message: 'Must be at least 1' },
            })}
            error={errors.servings?.message}
          />
        </div>
      </div>

      {/* image upload */}
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Recipe Image
        </h2>

        {imagePreview ? (
          <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setImagePreview('');
              }}
              className="absolute top-2 right-2 bg-red-500 text-white
                         px-3 py-1 rounded text-sm hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="relative h-48 border-2 border-dashed border-gray-300
                          rounded-lg flex items-center justify-center bg-gray-50
                          cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="text-center pointer-events-none">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-2"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-500">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG up to 5MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ingredients */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Ingredients
          </h2>
          <button
            type="button"
            onClick={addIngredient}
            className="text-sm text-primary-500 hover:text-primary-600
                       font-medium"
          >
            + Add Ingredient
          </button>
        </div>

        <div className="space-y-3">
          {ingredients.map((ing, idx) => (
            <div key={idx} className="flex gap-3 items-end">
              <input
                type="text"
                placeholder="Ingredient name"
                value={ing.name}
                onChange={(e) =>
                  updateIngredient(idx, 'name', e.target.value)
                }
                className="input-field flex-1"
              />
              <input
                type="text"
                placeholder="Amount"
                value={ing.amount}
                onChange={(e) =>
                  updateIngredient(idx, 'amount', e.target.value)
                }
                className="input-field w-32"
              />
              <button
                type="button"
                onClick={() => removeIngredient(idx)}
                className="w-10 h-10 flex items-center justify-center
                           text-red-500 hover:bg-red-50 rounded
                           transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* instructions */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Instructions
          </h2>
          <button
            type="button"
            onClick={addInstruction}
            className="text-sm text-primary-500 hover:text-primary-600
                       font-medium"
          >
            + Add Step
          </button>
        </div>

        <div className="space-y-3">
          {instructions.map((inst, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <div className="w-8 h-8 flex items-center justify-center
                              bg-primary-100 text-primary-600 rounded-full
                              font-semibold text-sm flex-shrink-0">
                {inst.step}
              </div>
              <textarea
                placeholder="Write your instruction..."
                value={inst.text}
                onChange={(e) =>
                  updateInstruction(idx, e.target.value)
                }
                rows={2}
                className="input-field resize-none flex-1"
              />
              <button
                type="button"
                onClick={() => removeInstruction(idx)}
                className="w-10 h-10 flex items-center justify-center
                           text-red-500 hover:bg-red-50 rounded
                           transition-colors flex-shrink-0"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* submit */}
      <Button
        type="submit"
        disabled={isSubmitting || uploading}
        className="w-full"
      >
        {uploading ? 'Uploading...' : isSubmitting ? 'Saving...' : 'Save Recipe'}
      </Button>
    </form>
  );
};

export default RecipeForm;
