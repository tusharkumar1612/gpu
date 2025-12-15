'use client';

import Link from 'next/link';
import { Cpu, Twitter, Github, MessageCircle } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Roadmap', href: '#roadmap' },
    { label: 'Changelog', href: '#changelog' },
  ],
  Resources: [
    { label: 'Documentation', href: '#docs' },
    { label: 'API Reference', href: '#api' },
    { label: 'Tutorials', href: '#tutorials' },
    { label: 'Blog', href: '#blog' },
  ],
  Company: [
    { label: 'About', href: '#about' },
    { label: 'Careers', href: '#careers' },
    { label: 'Contact', href: '#contact' },
    { label: 'Partners', href: '#partners' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Cookie Policy', href: '#cookies' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: MessageCircle, href: 'https://discord.com', label: 'Discord' },
];

export function Footer() {
  return (
    <footer className="bg-background-secondary border-t border-glass-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">NeuralCloud</span>
            </Link>
            <p className="text-sm text-foreground-muted mb-6">
              Decentralized compute infrastructure for the open internet.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg glass hover:bg-glass-hover transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-foreground-muted" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-foreground mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-glass-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-foreground-muted">
            © {new Date().getFullYear()} NeuralCloud. All rights reserved.
          </p>
          <p className="text-sm text-foreground-muted">
            Built with ❤️ for the decentralized web
          </p>
        </div>
      </div>
    </footer>
  );
}

