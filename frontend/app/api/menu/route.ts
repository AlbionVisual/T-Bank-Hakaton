import { NextResponse } from 'next/server'

export async function GET() {
  const menu = [
    { id: 1, name: 'Паста Карбонара', description: 'Классическая итальянская паста' },
    { id: 2, name: 'Салат Цезарь', description: 'Свежий салат с курицей' },
    { id: 3, name: 'Шакшука', description: 'Яйца в томатном соусе' },
    { id: 4, name: 'Греческий салат', description: 'Овощи с сыром фета' },
    { id: 5, name: 'Том Ям', description: 'Острый тайский суп' },
    { id: 6, name: 'Омлет', description: 'Пушистый омлет с овощами' }
  ]

  return NextResponse.json(menu)
}

