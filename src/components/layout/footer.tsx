import Link from 'next/link';
import Logo from '@/components/common/logo';
import { GLOBAL_CONFIG } from '@/lib/global-config';

const footer = {
  tagline:
    "Simplifiez la gestion de votre école, concentrez-vous sur l'éducation.",
  menuItems: [
    {
      title: 'Produit',
      links: [
        { text: 'Présentation', url: '#' },
        { text: 'Tarification', url: '/pricing' },
        { text: 'Fonctionnalités', url: '#' },
        // { text: "Intégrations", url: "#" },
        { text: 'Démos', url: 'https://www.linkedin.com/company/edva-sms' },
      ],
    },
  ],
  copyright: `© ${new Date().getFullYear()} ${
    GLOBAL_CONFIG.logo.fullTitle
  }. Tous droits réservés.`,
  bottomLinks: [
    { text: "Conditions d'utilisation", url: '/terms-and-conditions' },
    { text: 'Politique de confidentialité', url: '/privacy-policy' },
  ],
};

export default function MainFooter() {
  return (
    <footer className="container mx-auto">
      <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
        <div className="col-span-2 mb-8 lg:mb-0">
          <div className="flex items-center gap-2 lg:justify-start">
            <Link href="/">
              <Logo logo />
            </Link>
          </div>

          <p className="mt-4 text-sm">{footer.tagline}</p>
        </div>

        {footer.menuItems.map((section) => (
          <div key={section.title}>
            {/* make this reusable */}
            <h3 className="relative mb-4 inline-block font-mono font-semibold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:cursor-pointer hover:after:w-full">
              {section.title}
            </h3>

            <ul className="space-y-4 text-muted-foreground">
              {section.links.map((link) => (
                <li className="hover:text-primary" key={link.text}>
                  <Link href={link.url}>{link.text}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-24 flex flex-col justify-between gap-4 border-t pt-8 pb-1 font-medium text-muted-foreground text-sm md:flex-row md:items-center">
        <p>{footer.copyright}</p>

        <ul className="flex gap-4">
          {footer.bottomLinks.map((link) => (
            <li className="underline hover:text-primary" key={link.text}>
              <Link href={link.url}>{link.text}</Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
