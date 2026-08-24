'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
  password: string
}

export const LoginForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const redirect = useRef(searchParams.get('redirect'))
  const { login } = useAuth()
  const router = useRouter()
  const t = useTranslations('Auth')
  const [error, setError] = React.useState<null | string>(null)

  const {
    formState: { errors, isLoading },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        await login(data)
        if (redirect?.current) router.push(redirect.current)
        else router.push('/account')
      } catch (_) {
        setError(t('errorCredenciales'))
      }
    },
    [login, router, t],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <Message className="mb-8" error={error} />}

      <div className="mb-8 flex flex-col gap-6">
        <FormItem>
          <Label htmlFor="email">{t('correo')}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email', { required: t('correoRequerido') })}
          />
          {errors.email && <FormError message={errors.email.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="password">{t('contrasena')}</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register('password', { required: t('contrasenaRequerida') })}
          />
          {errors.password && <FormError message={errors.password.message} />}
        </FormItem>

        <Link
          className="text-ui-sm text-blue-brand border-gold self-start border-b-2 font-semibold"
          href={`/forgot-password${allParams}`}
        >
          {t('olvidasteContrasena')}
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button className="grow" disabled={isLoading} type="submit" variant="default">
          {isLoading ? t('procesando') : t('entrar')}
        </Button>
        <Button asChild className="grow" variant="outline">
          <Link href={`/create-account${allParams}`}>{t('crearCuenta')}</Link>
        </Button>
      </div>
    </form>
  )
}
