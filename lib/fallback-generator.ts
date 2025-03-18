export function generateFallbackTitle(): string {
  const adjectives = [
    "Premium",
    "Advanced",
    "Ultra",
    "Smart",
    "Professional",
    "Flagship",
    "Next-Gen",
    "Innovative",
    "Sleek",
    "Powerful",
  ]

  const nouns = ["Smartphone", "Phone", "Mobile", "Device", "Handset"]

  const models = ["Pro", "Max", "Plus", "Elite", "X", "S", "Ultra"]

  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
  const randomModel = models[Math.floor(Math.random() * models.length)]

  return `${randomAdjective} ${randomNoun} ${randomModel}`
}

export function generateFallbackDescription(): string {
  return `Experience the future of mobile technology with this cutting-edge smartphone. 
  Featuring a stunning high-resolution display, powerful processor, and advanced camera system, 
  this device delivers exceptional performance for all your needs. 
  
  The long-lasting battery ensures you stay connected all day, while the sleek, 
  premium design fits comfortably in your hand. With the latest software and security features, 
  you can enjoy peace of mind knowing your data is protected.
  
  Perfect for work, entertainment, and staying connected with loved ones, 
  this smartphone represents the perfect balance of style, functionality, and value.`
}

