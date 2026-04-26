import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../../components/common/Layout';
import { createRecipeApi, uploadImageApi } from '../../api/recipe.api';
import { useForm } from 'react-hook-form';

const CATEGORIES = ['Breakfast','Lunch','Dinner','Dessert','Snack','Beverage','Other'];
const inputClass = "w-full bg-white border border-linen rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-sand transition-colors";

const AddRecipePage = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([{ name: '', amount: '' }]);
  const [instructions, setInstructions] = useState([{ step: 1, text: '' }]);
  const [toolsUsed, setToolsUsed] = useState([]);
  const [toolInput, setToolInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const addIngredient = () => setIngredients(p => [...p, { name: '', amount: '' }]);
  const removeIngredient = (i) => setIngredients(p => p.filter((_, idx) => idx !== i));
  const updateIngredient = (i, f, v) => setIngredients(p => p.map((ing, idx) => idx === i ? { ...ing, [f]: v } : ing));
  const addInstruction = () => setInstructions(p => [...p, { step: p.length + 1, text: '' }]);
  const removeInstruction = (i) => setInstructions(p => p.filter((_, idx) => idx !== i).map((inst, idx) => ({ ...inst, step: idx + 1 })));
  const updateInstruction = (i, v) => setInstructions(p => p.map((inst, idx) => idx === i ? { ...inst, text: v } : inst));
  const addTool = () => { const t = toolInput.trim(); if (!t) return; if (toolsUsed.includes(t)) { toast.error('Tool already added'); return; } setToolsUsed(p => [...p, t]); setToolInput(''); };
  const removeTool = (i) => setToolsUsed(p => p.filter((_, idx) => idx !== i));
  const handleImageChange = (e) => { const f = e.target.files[0]; if (!f) return; if (f.size > 5*1024*1024) { toast.error('Image must be under 5MB'); return; } setImageFile(f); setImagePreview(URL.createObjectURL(f)); };

  const onSubmit = async (data) => {
    const vi = ingredients.filter(i => i.name.trim() && i.amount.trim());
    if (!vi.length) { toast.error('Add at least one ingredient'); return; }
    const vn = instructions.filter(i => i.text.trim());
    if (!vn.length) { toast.error('Add at least one instruction'); return; }
    try {
      let imageUrl = '';
      if (imageFile) { setUploading(true); const fd = new FormData(); fd.append('image', imageFile); const ur = await uploadImageApi(fd); imageUrl = ur.data.data.imageUrl; setUploading(false); }
      await createRecipeApi({ ...data, ingredients: vi, instructions: vn, toolsUsed, image: imageUrl, prepTime: Number(data.prepTime), cookTime: Number(data.cookTime), servings: Number(data.servings) });
      toast.success('Recipe created!'); navigate('/dashboard');
    } catch (err) { setUploading(false); toast.error(err.response?.data?.message || 'Failed to create recipe'); }
  };

  return (
    <Layout>
      <div className="page-enter">
        <div className="bg-parchment border-b border-linen py-8">
          <div className="max-w-2xl mx-auto px-6">
            <div className="editorial-label mb-2">Chef dashboard</div>
            <h1 className="font-heading text-4xl">Add a recipe</h1>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-6 py-12">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-10">
              <div className="editorial-label mb-4 pb-2 border-b border-linen">Basic info</div>
              <div className="space-y-4">
                <div>
                  <label className="editorial-label block mb-1.5">Recipe Title</label>
                  <input placeholder="e.g. Nepali Dal Bhat" {...register('title', { required: 'Title is required' })} className={inputClass} />
                  {errors.title && <span className="text-xs text-red-500 mt-1 block">{errors.title.message}</span>}
                </div>
                <div>
                  <label className="editorial-label block mb-1.5">Description</label>
                  <textarea {...register('description', { required: 'Description is required' })} placeholder="Brief description..." rows={3} className={`${inputClass} resize-none`} />
                  {errors.description && <span className="text-xs text-red-500 mt-1 block">{errors.description.message}</span>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="editorial-label block mb-1.5">Category</label>
                    <select {...register('category', { required: 'Required' })} className={inputClass}>
                      <option value="">Select...</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="editorial-label block mb-1.5">Difficulty</label>
                    <select {...register('difficulty')} className={inputClass}>
                      <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className="editorial-label block mb-1.5">Prep (min)</label><input type="number" min="0" max="1440" placeholder="30" {...register('prepTime', { required: 'Required', min: { value: 0, message: 'Min 0' }, max: { value: 1440, message: 'Max 1440' } })} className={inputClass} /></div>
                  <div><label className="editorial-label block mb-1.5">Cook (min)</label><input type="number" min="0" max="1440" placeholder="20" {...register('cookTime', { required: 'Required', min: { value: 0, message: 'Min 0' }, max: { value: 1440, message: 'Max 1440' } })} className={inputClass} /></div>
                  <div><label className="editorial-label block mb-1.5">Servings</label><input type="number" min="1" max="100" placeholder="4" {...register('servings', { required: 'Required', min: { value: 1, message: 'Min 1' }, max: { value: 100, message: 'Max 100' } })} className={inputClass} /></div>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <div className="editorial-label mb-4 pb-2 border-b border-linen">Recipe Image</div>
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl border border-linen" />
                  <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); }} className="absolute top-2 right-2 bg-white w-8 h-8 rounded-full border border-linen flex items-center justify-center text-sm hover:bg-parchment">✕</button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-linen rounded-xl p-8 flex flex-col items-center cursor-pointer hover:border-sand text-gray-400 transition-colors bg-stone-50">
                  <p className="text-sm font-medium">Click to upload image</p><p className="text-xs mt-1">JPG, PNG, WEBP up to 5MB</p>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>

            <div className="mb-10">
              <div className="editorial-label mb-4 pb-2 border-b border-linen">Ingredients</div>
              <div className="grid grid-cols-[120px_1fr_auto] gap-2 mb-2 px-1">
                <span className="editorial-label">Amount</span>
                <span className="editorial-label">Ingredient</span>
                <span className="sr-only">Remove</span>
              </div>
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2 items-start mb-2">
                  <input type="text" placeholder="e.g. 2 cups" value={ing.amount} onChange={e => updateIngredient(i,'amount',e.target.value)} className={`${inputClass} w-[120px] shrink-0`} />
                  <input type="text" placeholder="e.g. Rice" value={ing.name} onChange={e => updateIngredient(i,'name',e.target.value)} className={`${inputClass} flex-1 min-w-0`} />
                  {ingredients.length > 1 && <button type="button" onClick={() => removeIngredient(i)} className="border border-linen text-gray-400 rounded-lg px-3 py-3 text-xs hover:border-sand hover:text-gray-600 transition-colors">×</button>}
                </div>
              ))}
              <button type="button" onClick={addIngredient} className="editorial-label text-paprika hover:text-red-800 cursor-pointer mt-1 flex items-center gap-1">+ Add ingredient</button>
            </div>

            <div className="mb-10">
              <div className="editorial-label mb-4 pb-2 border-b border-linen">Instructions</div>
              {instructions.map((inst, i) => (
                <div key={i} className="flex gap-2 items-start mb-2">
                  <div className="w-10 h-[46px] rounded-lg border border-linen bg-stone-50 text-gray-700 flex items-center justify-center text-sm font-medium shrink-0">{inst.step}</div>
                  <textarea placeholder={`Step ${inst.step}...`} value={inst.text} onChange={e => updateInstruction(i,e.target.value)} rows={2} className={`${inputClass} resize-none flex-1`} />
                  {instructions.length > 1 && <button type="button" onClick={() => removeInstruction(i)} className="border border-linen text-gray-400 rounded-lg px-3 py-3 text-xs hover:border-sand hover:text-gray-600 transition-colors">×</button>}
                </div>
              ))}
              <button type="button" onClick={addInstruction} className="editorial-label text-paprika hover:text-red-800 cursor-pointer mt-1 flex items-center gap-1">+ Add step</button>
            </div>

            <div className="mb-10">
              <div className="editorial-label mb-4 pb-2 border-b border-linen">Tools used</div>
              <div className="flex gap-2 items-start mb-3">
                <input type="text" placeholder="e.g. whisk, oven" value={toolInput} onChange={e => setToolInput(e.target.value)} onKeyDown={e => { if (e.key==='Enter') { e.preventDefault(); addTool(); }}} className={`${inputClass} flex-1`} />
                <button type="button" onClick={addTool} className="border border-linen text-gray-700 rounded-lg px-4 py-3 hover:border-sand text-sm transition-colors font-medium bg-stone-50">Add</button>
              </div>
              {toolsUsed.length > 0 && <div className="flex flex-wrap gap-1.5">{toolsUsed.map((t,i) => <span key={i} className="inline-flex items-center gap-1.5 text-xs text-gray-500 border border-linen px-2.5 py-1 rounded">{t}<button type="button" onClick={() => removeTool(i)} className="text-gray-400 hover:text-gray-600">×</button></span>)}</div>}
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => navigate(-1)} className="border border-linen text-gray-700 text-sm px-8 py-3 rounded-lg hover:bg-parchment transition-colors">Cancel</button>
              <button type="submit" disabled={isSubmitting||uploading} className="bg-paprika text-white text-sm font-medium px-8 py-3 rounded-lg hover:bg-red-800 transition-colors flex items-center gap-2">
                {(isSubmitting||uploading) && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {uploading ? 'Uploading...' : isSubmitting ? 'Saving...' : 'Save recipe'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddRecipePage;