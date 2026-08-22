import { Badge, Eyebrow, Field } from '@/components/p8'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import React from 'react'

const paymentMethods = ['VISA', 'MASTERCARD', 'PAYPAL', 'APPLE PAY']

/**
 * Pied de page unique (variante A avec le pied blanc de la variante C).
 * Ne jamais le poser sur un fond sombre.
 */
export async function Footer() {
  const t = await getTranslations('Footer')

  const linkClass = 'hover:text-blue-brand transition-colors duration-[120ms]'

  return (
    <footer className="border-footer-line border-t bg-white">
      <div className="container pt-14 pb-8">
        <div className="border-footer-line grid gap-12 border-b pb-11 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <h3 className="m-0 mb-2.5 text-[16px] font-extrabold">{t('boletinTitulo')}</h3>
            <p className="text-ui-sm mt-0 mb-4 leading-relaxed text-[#8A867D]">
              {t('boletinTexto')}
            </p>
            <Field
              aria-label={t('boletinTitulo')}
              button={t('boletinBoton')}
              name="email"
              placeholder={t('boletinPlaceholder')}
              type="email"
            />
          </div>

          <div className="text-ui-sm flex flex-col gap-2.5 text-[#4A463E]">
            <Eyebrow className="text-kicker tracking-[2px]" tone="blue">
              {t('tienda')}
            </Eyebrow>
            <Link className={linkClass} href="/catalogo?categoria=textil">
              {t('textil')}
            </Link>
            <Link className={linkClass} href="/catalogo?categoria=accesorios">
              {t('accesorios')}
            </Link>
            <Link className={linkClass} href="/catalogo?categoria=posters-deco">
              {t('postersDeco')}
            </Link>
            <Link className={linkClass} href="/catalogo?orden=novedades">
              {t('novedades')}
            </Link>
          </div>

          <div className="text-ui-sm flex flex-col gap-2.5 text-[#4A463E]">
            <Eyebrow className="text-kicker tracking-[2px]">{t('ayuda')}</Eyebrow>
            <Link className={linkClass} href="/guia-de-tallas">
              {t('guiaDeTallas')}
            </Link>
            <Link className={linkClass} href="/envios-y-devoluciones">
              {t('enviosDevoluciones')}
            </Link>
            <Link className={linkClass} href="/contacto">
              {t('contacto')}
            </Link>
            <Link className={linkClass} href="/faq">
              {t('faq')}
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <Eyebrow className="text-kicker tracking-[2px]" tone="blue">
              {t('siguenos')}
            </Eyebrow>
            <div className="text-ui-sm flex gap-3.5 text-[#4A463E]">
              <a
                className={linkClass}
                href="https://instagram.com"
                rel="noreferrer noopener"
                target="_blank"
              >
                Instagram
              </a>
              <a
                className={linkClass}
                href="https://tiktok.com"
                rel="noreferrer noopener"
                target="_blank"
              >
                TikTok
              </a>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {paymentMethods.map((method) => (
                <Badge key={method} tone="quiet">
                  {method}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="text-kicker flex flex-col gap-2 pt-[22px] text-[#A5A199] md:flex-row md:justify-between">
          <span>{t('copyright', { year: new Date().getFullYear() })}</span>
          <div className="flex gap-5">
            <Link className={linkClass} href="/aviso-legal">
              {t('avisoLegal')}
            </Link>
            <Link className={linkClass} href="/privacidad">
              {t('privacidad')}
            </Link>
            <Link className={linkClass} href="/cookies">
              {t('cookies')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
