import { NextResponse } from 'next/server'

export async function GET() {
  const recipes = [
    {
      id: 1,
      title: 'Паста Карбонара',
      description: 'Классическая итальянская паста с беконом и сыром',
      ingredients: [
        { name: 'Спагетти', quantity: 200, unit: 'г' },
        { name: 'Бекон', quantity: 150, unit: 'г' },
        { name: 'Яйца', quantity: 2, unit: 'шт' },
        { name: 'Сыр Пармезан', quantity: 50, unit: 'г' },
        { name: 'Чеснок', quantity: 2, unit: 'зубчика' }
      ],
      instructions: '1. Отварите спагетти согласно инструкции...\n2. Обжарьте бекон с чесноком...\n3. Взбейте яйца с сыром...\n4. Смешайте все ингредиенты...'
    },
    {
      id: 2,
      title: 'Салат Цезарь',
      description: 'Свежий салат с курицей и соусом цезарь',
      ingredients: [
        { name: 'Куриное филе', quantity: 300, unit: 'г' },
        { name: 'Салат Айсберг', quantity: 1, unit: 'кочан' },
        { name: 'Помидоры черри', quantity: 200, unit: 'г' },
        { name: 'Сухарики', quantity: 100, unit: 'г' },
        { name: 'Сыр Пармезан', quantity: 50, unit: 'г' },
        { name: 'Соус Цезарь', quantity: 3, unit: 'ст.л.' }
      ],
      instructions: '1. Обжарьте куриное филе...\n2. Порвите салат руками...\n3. Нарежьте помидоры пополам...\n4. Смешайте все ингредиенты и заправьте соусом...'
    }
  ]

  return NextResponse.json(recipes)
}