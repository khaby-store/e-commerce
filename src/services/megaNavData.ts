import type { MegaNavMenu } from "@/models/megaNav";
import { links } from "@/models/megaNav";

/**
 * Stand-in nav configuration. The five menus captured from the live site
 * (Women, Men, Beauty, Shoes, New & Now) are transcribed exactly; the rest
 * are plausible placeholders until the nav API is wired up. Promo images
 * reuse vendored campaign assets.
 */
export const MOCK_MEGA_NAV_MENUS: MegaNavMenu[] = [
  {
    id: "holiday-gifts",
    label: "Holiday Gifts",
    featured: {
      heading: "All Holiday Gifts",
      links: links(
        "Gifts for Her",
        "Gifts for Him",
        "Gifts for Kids",
        "Gifts for Everyone",
        "Gift Cards",
        "Gift Sets Under $50",
        "Under $100",
        "Under $250"
      ),
    },
    columns: [
      {
        groups: [
          {
            heading: "By Recipient",
            links: links(
              "Women",
              "Men",
              "Kids",
              "Teens",
              "Friends & Hosts",
              "Teachers"
            ),
          },
        ],
      },
      {
        groups: [
          {
            heading: "By Category",
            links: links(
              "Beauty Gifts",
              "Jewelry",
              "Handbags",
              "Shoes",
              "Home",
              "Food & Wine"
            ),
          },
        ],
      },
      {
        groups: [
          {
            heading: "Featured",
            links: links(
              "Gift Cards",
              "Personalized Gifts",
              "Gift Sets",
              "Stocking Stuffers",
              "Gifts with Purchase"
            ),
          },
        ],
      },
    ],
    promo: {
      imageSrc: "/assets/03_N125_Dual-Gender_4-5_13544622.jpeg",
      caption: "Holiday Gifts",
      href: "#",
    },
  },
  {
    id: "new-now",
    label: "New & Now",
    featured: {
      heading: "All New & Now",
      links: links(
        "Celebrating 125 Years",
        "Sneaker Release Calendar",
        "Experience Fine Jewelry"
      ),
    },
    columns: [
      {
        groups: [
          { heading: "Women", links: links("Coat Shop") },
          { heading: "Men", links: links("Coat Shop", "Cold Weather Shop") },
          { heading: "Beauty", links: links("Beauty Inspiration") },
          { heading: "Shoes", links: [] },
          { heading: "Accessories", links: [] },
          { heading: "Kids", links: [] },
          { heading: "Designer", links: links("The Edit") },
          { heading: "Home", links: [] },
        ],
      },
      {
        groups: [
          {
            heading: "Style Guide",
            links: links(
              "Women's Cashmere Shop",
              "Women's Cold Weather Shop",
              "Women's Holiday Dressing",
              "Designer Style Guide"
            ),
          },
          {
            heading: "What's Hot Now",
            links: links(
              "’90s Archival",
              "Black Cherry Burgundy",
              "Gem Glam",
              "Pretty Prep",
              "Sleek Leather"
            ),
          },
        ],
      },
      {
        groups: [
          {
            heading: "New Brands & Collections",
            links: links(
              "On x Zendaya",
              "Arc’teryx",
              "GUEST IN RESIDENCE",
              "KitchenAid",
              "Reformation x Alexa Chung",
              "LMND"
            ),
          },
        ],
      },
      {
        groups: [
          {
            heading: "Women’s Occasion",
            links: links(
              "Cocktail",
              "Party & Night Out",
              "Vacation & Resort",
              "Work",
              "Wedding Guest"
            ),
          },
          {
            heading: "Men’s Occasion",
            links: links("Holiday Dressing", "Vacation & Resort", "Work"),
          },
        ],
      },
    ],
    promo: {
      imageSrc: "/assets/01_Vince-125_1-1_Hero_13429072.jpeg",
      caption: "Women’s Holiday Outfits",
      href: "#",
    },
  },
  {
    id: "women",
    label: "Women",
    featured: {
      heading: "All Women",
      links: links(
        "Gifts for Her",
        "New Arrivals",
        "Women’s Sale",
        "Cold-Weather Shop",
        "UGG for Women",
        "Under $100",
        "Fall Essentials",
        "On Trend: ’90s Archival",
        "On Trend: Black Cherry Burgundy",
        "On Trend: Gem Glam",
        "On Trend: Sleek Leather",
        "Cashmere Shop",
        "Nordstrom Made"
      ),
    },
    columns: [
      {
        groups: [
          {
            heading: "Clothing",
            links: links(
              "Activewear",
              "Dresses",
              "Coats & Jackets",
              "Jeans & Denim",
              "Jumpsuits & Rompers",
              "Lingerie, Hosiery & Shapewear",
              "Matching Sets",
              "Pants & Leggings",
              "Shorts",
              "Skirts",
              "Sleepwear & Loungewear",
              "Suits & Separates",
              "Sweaters",
              "Sweatshirts & Hoodies",
              "Swimwear & Cover-Ups",
              "Tops"
            ),
          },
        ],
      },
      {
        groups: [
          {
            heading: "Dresses",
            links: links(
              "Casual",
              "Cocktail",
              "Formal",
              "Guest of Wedding",
              "Holiday",
              "Homecoming",
              "Mother of the Bride or Groom",
              "Vacation"
            ),
          },
          { heading: "Petite-Size Clothing", links: [] },
          { heading: "Plus-Size Clothing", links: [] },
          { heading: "Maternity", links: [] },
        ],
      },
      {
        groups: [
          {
            heading: "Shoes",
            links: links(
              "Athletic & Sneakers",
              "Boots",
              "Comfort",
              "Flats",
              "Heels",
              "Loafers & Oxfords",
              "Sandals",
              "Slippers"
            ),
          },
          {
            heading: "Beauty",
            links: links("Fragrance", "Makeup", "Skin Care", "Hair Care"),
          },
        ],
      },
      {
        groups: [
          { heading: "Handbags", links: [] },
          { heading: "Accessories", links: [] },
          { heading: "Jewelry", links: [] },
          { heading: "Designer", links: [] },
          {
            heading: "Shop by Occasion",
            links: links(
              "Cocktail",
              "Vacation & Resort",
              "Work",
              "Wedding Guest"
            ),
          },
          { heading: "Contemporary", links: [] },
        ],
      },
    ],
    promo: {
      imageSrc: "/assets/02_Tailored_1-1_13484416.jpeg",
      caption: "Gifts for Her",
      href: "#",
    },
  },
  {
    id: "men",
    label: "Men",
    featured: {
      heading: "All Men",
      links: links(
        "Gifts for Him",
        "New Arrivals",
        "Men’s Sale",
        "Under $50",
        "Under $100",
        "Cold-Weather Shop",
        "Fall Wardrobe Essentials",
        "UGG for Men",
        "Nordstrom Made",
        "Work"
      ),
    },
    columns: [
      {
        groups: [
          {
            heading: "Clothing",
            links: links(
              "Activewear",
              "Blazers & Sport Coats",
              "Coats & Jackets",
              "Dress Shirts",
              "Jeans",
              "Lounge & Sleepwear",
              "Pants",
              "Polo Shirts",
              "Shirts",
              "Shorts",
              "Suits & Separates",
              "Sweaters",
              "Sweatshirts & Hoodies",
              "Swimwear",
              "T-Shirts",
              "Underwear, Undershirts & Socks"
            ),
          },
        ],
      },
      {
        groups: [
          {
            heading: "Shoes",
            links: links(
              "Athletic & Sneakers",
              "Boots",
              "Comfort",
              "Dress Shoes",
              "Loafers & Slip-Ons",
              "Oxfords",
              "Sandals & Flip-Flops",
              "Slippers"
            ),
          },
        ],
      },
      {
        groups: [
          {
            heading: "Accessories",
            links: links(
              "Bags",
              "Belts",
              "Hats",
              "Jewelry",
              "Sunglasses & Eyewear",
              "Ties & Pocket Squares",
              "Wallets & Card Cases",
              "Watches"
            ),
          },
          { heading: "Grooming & Cologne", links: [] },
        ],
      },
      {
        groups: [
          { heading: "Big & Tall", links: links("DXL Big + Tall") },
          { heading: "Designer", links: [] },
          { heading: "Contemporary", links: [] },
          {
            heading: "Shop by Occasion",
            links: links("Holiday Outfits", "Wedding Guest"),
          },
          {
            heading: "Shop by Activity",
            links: links("Golf", "Run & Train", "Tennis & Pickleball"),
          },
          { heading: "Sports Fan Shop", links: [] },
        ],
      },
    ],
    promo: {
      imageSrc: "/assets/03_N125-Away_1-1_13300122.jpeg",
      caption: "Gifts for Him",
      href: "#",
    },
  },
  {
    id: "beauty",
    label: "Beauty",
    featured: {
      heading: "All Beauty",
      links: links(
        "New Arrivals",
        "Beauty Sale",
        "Beauty Inspiration",
        "Bestsellers",
        "Nordstrom Exclusives",
        "Nordstrom Beauty Services & Events",
        "Gifts with Purchase"
      ),
    },
    columns: [
      {
        groups: [
          {
            heading: "Beauty Brands",
            links: links(
              "Bobbi Brown",
              "CHANEL",
              "Charlotte Tilbury",
              "Clinique",
              "DIOR",
              "Estée Lauder",
              "Jo Malone London",
              "La Mer",
              "Lancôme",
              "Le Labo",
              "MAC Cosmetics",
              "Maison Francis Kurkdjian",
              "Parfums de Marly",
              "Sisley Paris",
              "TOM FORD",
              "Victoria Beckham",
              "Westman Atelier",
              "Yves Saint Laurent"
            ),
          },
        ],
      },
      {
        groups: [
          {
            heading: "Fragrance",
            links: links(
              "Cologne",
              "Designer Fragrance",
              "Niche Fragrance",
              "Perfume",
              "Rollerball & Travel Size",
              "Body Mist & Hair Mist",
              "Candles & Diffusers"
            ),
          },
          {
            heading: "Makeup",
            links: links(
              "Eyes",
              "Face",
              "Lips",
              "Nails",
              "Brushes & Tools",
              "Palettes"
            ),
          },
        ],
      },
      {
        groups: [
          {
            heading: "Skin Care",
            links: links(
              "Cleansers",
              "Exfoliators & Peels",
              "Eye Creams & Treatments",
              "Facial Masks",
              "Face Moisturizers",
              "Lip Balms & Treatments",
              "Self Tanners",
              "Serums & Treatments",
              "Sunscreen",
              "Toners",
              "Tools & Devices"
            ),
          },
          {
            heading: "Gifts & Sets",
            links: links(
              "Makeup Gifts & Sets",
              "Skin Care Gifts & Sets",
              "Fragrance Gifts & Sets",
              "Hair Care Gifts & Sets",
              "Stocking Stuffers"
            ),
          },
        ],
      },
      {
        groups: [
          { heading: "Hair Care", links: [] },
          { heading: "Bath & Body", links: [] },
          { heading: "Tools, Brushes & Makeup Bags", links: [] },
          { heading: "Men’s Grooming", links: [] },
          { heading: "Travel & Mini Sizes", links: [] },
          { heading: "Natural Beauty", links: [] },
          { heading: "Wellness", links: [] },
          { heading: "Dermatologist Recommended", links: [] },
          { heading: "Korean Beauty", links: [] },
          { heading: "Designer Beauty", links: [] },
          { heading: "FSA/HSA Eligible Beauty", links: [] },
        ],
      },
    ],
    promo: {
      imageSrc: "/assets/05_Roberto-Coin-N125_1-1_13437249.jpeg",
      caption: "Beauty Gifts & Sets",
      href: "#",
    },
  },
  {
    id: "shoes",
    label: "Shoes",
    featured: {
      heading: "All Shoes",
      links: links(
        "New Arrivals",
        "Sale Shoes",
        "UGG Shoes",
        "Gifts for the Sneaker Lover",
        "Under $100",
        "Sneaker Release Calendar",
        "On Trend: Dress Boots",
        "On Trend: Double-Lace Shoes"
      ),
    },
    columns: [
      {
        groups: [
          {
            heading: "Women",
            links: links(
              "Athletic & Sneakers",
              "Booties",
              "Boots",
              "Clogs",
              "Comfort",
              "Dress Shoes",
              "Flats",
              "Heels",
              "Loafers & Oxfords",
              "Mules & Slides",
              "Platforms",
              "Pumps",
              "Sandals",
              "Slippers",
              "Extended Sizes"
            ),
          },
        ],
      },
      {
        groups: [
          {
            heading: "Men",
            links: links(
              "Athletic & Sneakers",
              "Boots",
              "Comfort",
              "Dress Shoes",
              "Loafers & Slip-Ons",
              "Oxfords",
              "Sandals & Flip-Flops",
              "Slippers",
              "Extended Sizes"
            ),
          },
        ],
      },
      {
        groups: [
          {
            heading: "Kids",
            links: links(
              "Baby & Walker Shoes",
              "Toddler (Sizes 7.5-12)",
              "Little Kid (Sizes 12.5-3)",
              "Big Kid (Sizes 3.5-7)",
              "Girls’ Shoes",
              "Boys’ Shoes",
              "Athletic & Sneakers",
              "Boots",
              "Sandals",
              "Slippers"
            ),
          },
        ],
      },
      {
        groups: [
          {
            heading: "Designer",
            links: links("Women", "Men", "Kids"),
          },
          { heading: "Women’s Contemporary Shoes", links: [] },
          { heading: "Men’s Contemporary Shoes", links: [] },
          { heading: "Adaptive", links: [] },
          { heading: "Shoe Care & Accessories", links: [] },
        ],
      },
    ],
    promo: {
      imageSrc: "/assets/01_2-1_13131375.jpeg",
      caption: "UGG",
      href: "#",
    },
  },
  {
    id: "accessories",
    label: "Accessories",
    featured: {
      heading: "All Accessories",
      links: links(
        "New Arrivals",
        "Sale Accessories",
        "Bestsellers",
        "Under $100",
        "Gift Guide"
      ),
    },
    columns: [
      {
        groups: [
          {
            heading: "Handbags",
            links: links(
              "All Handbags",
              "Totes",
              "Crossbody",
              "Shoulder Bags",
              "Clutches",
              "Backpacks",
              "Wallets"
            ),
          },
        ],
      },
      {
        groups: [
          {
            heading: "Jewelry",
            links: links(
              "All Jewelry",
              "Necklaces",
              "Earrings",
              "Bracelets",
              "Rings",
              "Watches"
            ),
          },
        ],
      },
      {
        groups: [
          {
            heading: "Accessories",
            links: links(
              "Belts",
              "Hats",
              "Scarves",
              "Gloves",
              "Sunglasses",
              "Hair Accessories"
            ),
          },
          { heading: "Cold-Weather Shop", links: [] },
        ],
      },
      {
        groups: [
          { heading: "Designer", links: [] },
          { heading: "Shop by Occasion", links: links("Holiday", "Travel") },
        ],
      },
    ],
    promo: {
      imageSrc: "/assets/09_1-1_13131375.jpeg",
      caption: "Handbags",
      href: "#",
    },
  },
  {
    id: "kids",
    label: "Kids",
    featured: {
      heading: "All Kids",
      links: links(
        "New Arrivals",
        "Kids’ Sale",
        "Under $50",
        "Bestsellers",
        "Gifts for Kids"
      ),
    },
    columns: [
      {
        groups: [
          {
            heading: "Baby",
            links: links("0-24 Months", "Walker Shoes", "Baby Gifts"),
          },
        ],
      },
      {
        groups: [
          {
            heading: "Girl",
            links: links("2T-7", "8-16", "Clothing", "Dresses", "Shoes"),
          },
        ],
      },
      {
        groups: [
          {
            heading: "Boy",
            links: links("2T-7", "8-16", "Clothing", "Shoes"),
          },
        ],
      },
      {
        groups: [
          {
            heading: "Toys & Books",
            links: links("Toys", "Books", "Games"),
          },
          { heading: "Kids’ Home", links: [] },
        ],
      },
    ],
    promo: {
      imageSrc: "/assets/13_1-1_13131375.jpeg",
      caption: "Kids’ Gifts",
      href: "#",
    },
  },
  {
    id: "designer",
    label: "Designer",
    featured: {
      heading: "All Designer",
      links: links("New Designers", "Designer Sale", "Runway"),
    },
    columns: [
      {
        groups: [
          {
            heading: "Women",
            links: links("Ready to Wear", "Shoes", "Handbags", "Jewelry"),
          },
        ],
      },
      {
        groups: [
          {
            heading: "Men",
            links: links("Clothing", "Shoes", "Accessories"),
          },
        ],
      },
      {
        groups: [
          {
            heading: "Designers",
            links: links(
              "Saint Laurent",
              "Gucci",
              "Prada",
              "Bottega Veneta",
              "Loewe",
              "The Row"
            ),
          },
        ],
      },
      {
        groups: [
          {
            heading: "Contemporary",
            links: links("Clothing", "Shoes"),
          },
          { heading: "Designer Beauty", links: [] },
        ],
      },
    ],
    promo: {
      imageSrc: "/assets/14_2-1_13131375.jpeg",
      caption: "Designer",
      href: "#",
    },
  },
  {
    id: "home",
    label: "Home",
    featured: {
      heading: "All Home",
      links: links("New Arrivals", "Sale Home", "Gift Guide"),
    },
    columns: [
      {
        groups: [
          {
            heading: "Home",
            links: links(
              "Bedding",
              "Bath",
              "Kitchen",
              "Dining",
              "Decor",
              "Furniture",
              "Rugs"
            ),
          },
        ],
      },
      {
        groups: [
          {
            heading: "Brands",
            links: links(
              "Barefoot Dreams",
              "Coyuchi",
              "Our Place",
              "Caraway"
            ),
          },
        ],
      },
      {
        groups: [
          {
            heading: "Shop by Room",
            links: links("Bedroom", "Bathroom", "Kitchen", "Living Room"),
          },
        ],
      },
      {
        groups: [
          {
            heading: "Gifts",
            links: links("Hostess Gifts", "Housewarming", "Housewares"),
          },
          { heading: "Smart Home", links: [] },
        ],
      },
    ],
    promo: {
      imageSrc: "/assets/15_2-1_13131375.jpeg",
      caption: "Home",
      href: "#",
    },
  },
  {
    id: "sale",
    label: "Sale",
    featured: {
      heading: "All Sale",
      links: links("New Markdowns", "Clearance", "Sale by Category"),
    },
    columns: [
      {
        groups: [
          {
            heading: "Women",
            links: links("Clothing", "Shoes", "Handbags", "Jewelry"),
          },
        ],
      },
      {
        groups: [
          {
            heading: "Men",
            links: links("Clothing", "Shoes", "Accessories"),
          },
        ],
      },
      {
        groups: [
          {
            heading: "Kids",
            links: links("Clothing", "Shoes", "Toys"),
          },
        ],
      },
      {
        groups: [
          {
            heading: "Beauty",
            links: links("Skin Care", "Makeup", "Fragrance"),
          },
          { heading: "Home", links: [] },
        ],
      },
    ],
    promo: {
      imageSrc: "/assets/23_New-Markdowns_Merch_8-5_12130522.png",
      caption: "New Markdowns",
      href: "#",
    },
  },
  {
    id: "services",
    label: "Services",
    featured: {
      heading: "All Services",
      links: links(
        "Personal Stylist",
        "Alterations",
        "Nordstrom Rewards",
        "Gift Cards"
      ),
    },
    columns: [
      {
        groups: [
          {
            heading: "In Store",
            links: links(
              "Stylists",
              "Alterations",
              "Curbside Pickup",
              "Find a Store"
            ),
          },
        ],
      },
      {
        groups: [
          {
            heading: "Online",
            links: links(
              "Shipping",
              "Returns",
              "Gift Cards",
              "Order Status"
            ),
          },
        ],
      },
      {
        groups: [
          {
            heading: "Programs",
            links: links("Nordy Club", "Community", "Careers"),
          },
        ],
      },
      {
        groups: [
          { heading: "Client Services", links: [] },
          { heading: "Accessibility", links: [] },
        ],
      },
    ],
    promo: {
      imageSrc: "/assets/09b_1-1_13131375.jpeg",
      caption: "Services",
      href: "#",
    },
  },
];
