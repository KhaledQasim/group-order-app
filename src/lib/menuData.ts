import { MenuItem } from '@/types';

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, tomato sauce, and basil',
    price: 12.99,
    image: 'https://img.freepik.com/premium-photo/margarita-pizza_1020318-24.jpg',
    category: 'Pizza',
    sizes: {
      small: 10.99,
      medium: 12.99,
      large: 15.99
    },
    availableSizes: ['small', 'medium', 'large']
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    description: 'Spicy pepperoni with melted cheese',
    price: 14.99,
    image: 'https://t3.ftcdn.net/jpg/01/57/55/28/360_F_157552805_CVVFd9vMpfW7o6BjGgrkRUh7PGiTtyuv.jpg',
    category: 'Pizza',
    sizes: {
      small: 12.99,
      medium: 14.99,
      large: 17.99
    },
    availableSizes: ['small', 'medium', 'large']
  },
  {
    id: '3',
    name: 'Quattro Formaggi',
    description: 'Four cheese blend with mozzarella, gorgonzola, parmesan, and ricotta',
    price: 16.99,
    image: 'https://img.freepik.com/fotos-premium/quattro-formaggio-pizza-italiana-com-quatro-tipos-de-queijo_711700-433.jpg',
    category: 'Pizza',
    sizes: {
      small: 14.99,
      medium: 16.99,
      large: 19.99
    },
    availableSizes: ['small', 'medium', 'large']
  },
  {
    id: '4',
    name: 'Spaghetti Carbonara',
    description: 'Eggs, cheese, pancetta, and black pepper',
    price: 13.99,
    image: 'https://img.freepik.com/free-photo/spaghetti-carbonara_1203-8909.jpg',
    category: 'Pasta'
  },
  {
    id: '5',
    name: 'Fettuccine Alfredo',
    description: 'Creamy parmesan sauce with butter',
    price: 12.99,
    image: 'https://img.freepik.com/premium-photo/fettuccine-alfredo-pasta-with-white-cream-sauce-plate-italian-food_128711-8980.jpg',
    category: 'Pasta'
  },
  {
    id: '6',
    name: 'Caesar Salad',
    description: 'Romaine lettuce, parmesan, croutons, and caesar dressing',
    price: 8.99,
    image: 'https://tse4.mm.bing.net/th/id/OIF.BdoX6p6vIbhOSsxB6Vjhog?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    category: 'Salad'
  },
  {
    id: '7',
    name: 'Garlic Bread',
    description: 'Toasted bread with garlic butter and herbs',
    price: 4.99,
    image: 'https://tse2.mm.bing.net/th/id/OIF.QaSGrTpsIkITqrrw5G7MTw?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    category: 'Appetizer'
  },
  {
    id: '8',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee and mascarpone',
    price: 6.99,
    image: 'https://easyworldrecipes.com/wp-content/uploads/2024/07/Tiramisu-683x1024.jpg',
    category: 'Dessert'
  }
];

export const categories = ['Pizza', 'Pasta', 'Salad', 'Appetizer', 'Dessert']; 