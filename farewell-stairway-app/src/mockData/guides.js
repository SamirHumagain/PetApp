export const guidanceSections = [
  {
    id: 'guide-prep',
    title: 'Preparing Your Pet for Their Final Journey',
    titleSubtitle: 'Gentle, sensitive care steps in the first few hours',
    icon: '🌸',
    steps: [
      {
        title: 'Initial Gentle Positioning (First 1-2 Hours)',
        desc: 'Place your pet gently on their side in a natural sleeping curl before stiffening (rigor mortis) sets in.'
      },
      {
        title: 'Resting Surface & Bedding',
        desc: 'Lay a soft, absorbent towel or puppy training pad underneath, followed by their favorite cozy blanket.'
      },
      {
        title: 'Cool Environment & Temperature Control',
        desc: 'Keep the room temperature cool (18°C-20°C). Place ice packs wrapped in clean towels along their abdomen and spine.'
      },
      {
        title: 'Closing Eyes & Peaceful Farewell',
        desc: 'Gently stroke their eyelids closed with warm fingertips. Spend quiet moments of prayer and gratitude.'
      },
      {
        title: 'Arranging Temple Pickup',
        desc: 'Request climate-controlled transfer via our temple drivers, who handle each pet with sanctified care.'
      }
    ]
  },
  {
    id: 'guide-cremation',
    title: 'What Can Be Cremated With Your Pet?',
    titleSubtitle: 'Clear rules to ensure an eco-friendly and sacred cremation',
    icon: '🕯',
    disclaimer: 'Cremation policies vary by temple. Please confirm with your selected temple before the funeral.',
    categories: [
      {
        status: 'ACCEPTED',
        badge: '✓ Usually Accepted',
        badgeColor: '#10B981',
        items: [
          'Fresh flowers, lotus blossoms, jasmine garlands, and rose petals',
          'Favorite dry biscuits and treats wrapped in plain unbleached paper',
          'Handwritten letters from family members and photographs',
          '100% natural cotton cloth or small natural fiber blankets'
        ]
      },
      {
        status: 'ASK_TEMPLE',
        badge: '? Ask the Temple First',
        badgeColor: '#F59E0B',
        items: [
          'Small wooden keepsakes or engraved miniature tokens',
          'Special ritual clay lamps or incense sticks',
          'Favorite soft fabric plush toys (without battery/plastic pellets)'
        ]
      },
      {
        status: 'PROHIBITED',
        badge: '✕ Usually Not Allowed',
        badgeColor: '#EF4444',
        items: [
          'Metal collars, ID tags, buckles, and chains (kept for the owner)',
          'Synthetic foam pet beds or plastic bedding',
          'Batteries, electronic sound toys, or rubber items (damages eco chamber)',
          'Glass bottles or metal food bowls'
        ]
      }
    ]
  }
];
