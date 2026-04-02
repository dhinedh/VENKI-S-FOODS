const CLOUDINARY_CLOUD = "venkis-foods";
const CLOUD_BASE = `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/q_auto,f_auto,w_400/v1/pickles/`;

export const staticProducts = [
  {
    id: 1,
    name: "Classic Mango Pickle",
    category: "Veg",
    price: 199,
    weight: "250g",
    rating: 4.8,
    tag: "Best Seller",
    image: `${CLOUD_BASE}mango.webp`,
    description: "Traditional sun-dried mangoes marinated in cold-pressed sesame oil and hand-ground spices."
  },
  {
    id: 2,
    name: "Spicy Lemon Pickle",
    category: "Veg",
    price: 179,
    weight: "250g",
    rating: 4.6,
    tag: "Tangy",
    image: `${CLOUD_BASE}lemon.webp`,
    description: "A zesty explosion of lemons with a hint of green chilies and ginger."
  },
  {
    id: 3,
    name: "Garlic Thokku",
    category: "Veg",
    price: 249,
    weight: "250g",
    rating: 4.9,
    tag: "Immunity Booster",
    image: `${CLOUD_BASE}garlic.webp`,
    description: "Concentrated garlic paste slow-cooked to perfection. A versatile side for rice or rotis."
  },
  {
    id: 4,
    name: "Authentic Chicken Pickle",
    category: "Non-Veg",
    price: 499,
    weight: "250g",
    rating: 5.0,
    tag: "Meat Special",
    image: `${CLOUD_BASE}chicken.webp`,
    description: "Boneless chicken chunks fried and blended with our signature masala. High protein and high flavor."
  },
  {
    id: 5,
    name: "Royyala Pachadi (Prawns)",
    category: "Non-Veg",
    price: 599,
    weight: "250g",
    rating: 4.9,
    tag: "Seafood Choice",
    image: `${CLOUD_BASE}prawn.webp`,
    description: "Coastal style prawn pickle made with catch-of-the-day prawns."
  },
  {
    id: 6,
    name: "Ginger (Inji) Pickle",
    category: "Veg",
    price: 189,
    weight: "250g",
    rating: 4.7,
    image: `${CLOUD_BASE}ginger.webp`,
    description: "Finely shredded ginger balanced with jaggery and tamarind."
  }
];
