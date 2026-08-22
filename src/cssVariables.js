// Miroir JS des tokens de src/styles/p8-tokens.css.
//
// Les iframes Stripe Elements ne peuvent pas lire les variables CSS de la page :
// l'Appearance API n'accepte que des valeurs littérales. C'est la seule raison
// d'être de ce fichier — le tenir synchronisé avec les tokens à chaque évolution
// de la palette.

export const cssVariables = {
  breakpoints: {
    l: 1440,
    m: 1024,
    s: 768,
  },
  colors: {
    blue500: '#00A0DD',
    blue600: '#0E7FB0',
    gold500: '#C9A227',
    ink900: '#10131A',
    ink700: '#3C424D',
    ink500: '#8A919B',
    ink300: '#B9BEC6',
    line300: '#D8DCE1',
    white: '#FFFFFF',
    error: '#B4232B',
  },
}
