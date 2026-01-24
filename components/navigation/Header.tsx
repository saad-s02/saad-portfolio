"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' },
  { href: '/projects', label: 'Projects' },
  { href: '/stack', label: 'Stack' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b border-gray-800 bg-gray-950 sticky top-0 z-50 backdrop-blur">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Link
              href="/"
              className="text-xl font-bold text-white hover:text-gray-300 transition-colors"
            >
              Portfolio
            </Link>
          </motion.div>

          <ul className="flex flex-wrap gap-4 md:gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`transition-colors hover:text-gray-300 ${
                      isActive
                        ? 'text-white font-semibold border-b-2 border-white'
                        : 'text-gray-400'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}
