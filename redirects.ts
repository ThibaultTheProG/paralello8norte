import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  // L'ancienne boutique du template. Le catalogue vit maintenant sous son nom
  // espagnol, comme le reste des URLs publiques.
  const shopRedirect = {
    destination: '/catalogo',
    permanent: true,
    source: '/shop',
  }

  const shopCategoryRedirect = {
    destination: '/catalogo?categoria=:slug',
    permanent: true,
    source: '/shop/:slug',
  }

  // Idem pour la fiche produit : `/products/:slug` devient `/productos/:slug`.
  const productRedirect = {
    destination: '/productos/:slug',
    permanent: true,
    source: '/products/:slug',
  }

  return [internetExplorerRedirect, shopRedirect, shopCategoryRedirect, productRedirect]
}
