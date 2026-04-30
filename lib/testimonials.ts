export interface Testimonial {
  name: string
  role: string
  location: string
  quote: string
  result: string
}

export const testimonials: Testimonial[] = [
  {
    name: 'Miriam N.',
    role: 'Homeowner',
    location: 'Kilimani, Nairobi',
    quote:
      'KK Real Estate filtered out time-wasters early, presented the house properly, and kept every update clear.',
    result: 'Got a serious buyer within one week.',
  },
  {
    name: 'Peter K.',
    role: 'Property Owner',
    location: 'Syokimau, Machakos',
    quote:
      'The process felt organized from day one. Photos, pricing direction, and buyer handling were all done professionally.',
    result: 'Sold faster than my previous agent attempt.',
  },
  {
    name: 'Joyce W.',
    role: 'Seller',
    location: 'Nyali, Mombasa',
    quote:
      'I liked that they focused on serious buyers and coordinated viewings without unnecessary back-and-forth.',
    result: 'Smooth and professional process from listing to close.',
  },
  {
    name: 'David M.',
    role: 'Landlord',
    location: 'Karen, Nairobi',
    quote:
      'They understood how to position the property, not just post it online. That made the difference in buyer quality.',
    result: 'Received stronger buyer interest in days.',
  },
  {
    name: 'Esther A.',
    role: 'Homeowner',
    location: 'Ruiru, Kiambu',
    quote:
      'Communication was direct and practical. I always knew the next step and who had been screened before a viewing.',
    result: 'Closed with less stress and fewer delays.',
  },
]
