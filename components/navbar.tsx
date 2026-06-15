interface navItem {
  name: string
  href: string
}

const navItems: navItem[] = [
  {
    name: 'About',
    href: '#about'
  },
  {
    name: 'Features',
    href: '#features'
  },
  {
    name: 'Get started',
    href: '/dashboard'
  }
]

export default function Navbar() {
  return (
    <nav>
      <div className="flex justify-between">
        <a href="#">
          <p>Quiz</p>
        </a>
        <ul className="flex gap-4">
          {navItems.map((nav) => (
            <li
              className="dark:hover:text-blue-200 dark:opacity-100 opacity-60 hover:opacity-100"
              key={nav.name}
            >
              <a href={nav.href}>{nav.name}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
