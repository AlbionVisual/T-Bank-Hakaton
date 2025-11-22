import { NextResponse } from 'next/server'

export async function GET() {
  const recipes = [
    { id: 1, title: 'Паста Карбонара', description: 'Классическая итальянская паста' },
    { id: 2, title: 'Салат Цезарь', description: 'Свежий салат с курицей' },
    { id: 3, title: 'Шакшука', description: 'Яйца в томатном соусе' },
    { id: 4, title: 'Греческий салат', description: 'Овощи с сыром фета' },
    { id: 5, title: 'Том Ям', description: 'Острый тайский суп' },
    { id: 6, title: 'Омлет', description: 'Пушистый омлет с овощами' }
  ]

  return NextResponse.json(recipes)
}