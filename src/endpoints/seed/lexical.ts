/**
 * Fabrique de contenu Lexical.
 *
 * Les blocs Lexical du template sont recopiés à la main sur des dizaines de
 * lignes de JSON par paragraphe. Comme le seed en écrit une trentaine, on les
 * construit ici.
 */
type LexicalNode = { [k: string]: unknown; type: string; version: number }

type LexicalRoot = {
  root: {
    children: LexicalNode[]
    direction: 'ltr'
    format: ''
    indent: 0
    type: 'root'
    version: 1
  }
}

const paragraph = (text: string): LexicalNode => ({
  children: [{ detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 }],
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  textStyle: '',
  type: 'paragraph',
  version: 1,
})

/** Un document Lexical fait d'un ou plusieurs paragraphes simples. */
export const richText = (...texts: string[]): LexicalRoot => ({
  root: {
    children: texts.map(paragraph),
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
})
