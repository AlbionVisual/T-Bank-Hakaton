import { NextResponse } from 'next/server'

export async function GET() {
  const recipes = [
    { id: 1, name: 'Паста Карбонара', quantity: 2, unit: 'pcs' },
    { id: 2, name: 'Салат Цезарь', quantity: 1, unit: 'l' },
    { id: 3, name: 'Шакшука', quantity: 3, unit: 'g' },
    { id: 4, name: 'Греческий салат', quantity: 1, unit: 'l' },
    { id: 5, name: 'Том Ям', quantity: 7, unit: 'ml' },
    { id: 6, name: 'Омлет', quantity: 2, unit: 'g' }
  ]

  return NextResponse.json(recipes)
}