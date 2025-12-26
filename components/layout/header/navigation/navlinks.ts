export interface NavLink {
  label: string
  href: string
}

export const navlinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Settings', href: '/settings' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
]
