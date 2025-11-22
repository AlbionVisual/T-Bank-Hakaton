'use client'
import { useState, useEffect } from 'react'
import RecipeDetails from '../menu/RecipeDetails'

interface Ingredient {
  name: string
  quantity: number
  unit: string
}

interface Recipe {
  id: number
  title: string
  description: string
  ingredients: Ingredient[]
  instructions: string
}

export default function MenuPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/api/recipes')
        const data = await response.json()
        setRecipes(data)
      } catch (error) {
        console.error('Ошибка загрузки рецептов:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchRecipes()
  }, [])

  if (loading) return <div className="p-8 text-center">Загрузка рецептов...</div>

  return (
    <div className={`p-4 transition-all duration-300 ${selectedRecipe ? 'mr-80' : 'container mx-auto'}`}>
      
      {/* Грид который становится меньше */}
      <div className={`grid gap-4 transition-all duration-300 ${
        selectedRecipe 
          ? 'grid-cols-1 md:grid-cols-2'
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}>
        {recipes.map(recipe => (
          <div
            key={recipe.id}
            className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => setSelectedRecipe(recipe)}
          >
            <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
            <p className="text-gray-600 text-sm">{recipe.description}</p>
          </div>
        ))}
      </div>

      {/* Правая панель как компонента RecipeDetails.tsx */}
      {selectedRecipe && (
        <RecipeDetails 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
        />
      )}
    </div>
  )
}