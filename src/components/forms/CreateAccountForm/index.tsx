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
import React, { useCallback, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
  password: string
  passwordConfirm: string
}

export const CreateAccountForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const { login } = useAuth()
  const router = useRouter()
  const t = useTranslations('Auth')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<FormData>()

  const password = useRef({})
  password.current = watch('password', '')

  const onSubmit = useCallback(
    async (data: FormData) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (!response.ok) {
        setError(t('errorCrearCuenta'))
        return
      }

      const redirect = searchParams.get('redirect')

      const timer = setTimeout(() => {
        setLoading(true)
      }, 1000)

      try {
        await login(data)
        clearTimeout(timer)
        if (redirect) router.push(redirect)
        else router.push('/account')
      } catch (_) {
        clearTimeout(timer)
        setError(t('errorCredenciales'))
      }
    },
    [login, router, searchParams, t],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <Message className="mb-8" error={error} />}

      <div className="mb-8 flex flex-col gap-6">
        <FormItem>
          <Label htmlFor="email">{t('correo')}</Label>
          <Input
            id="email"
            autoComplete="email"
            {...register('email', { required: t('correoRequerido') })}
            type="email"
          />
          {errors.email && <FormError message={errors.email.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="password">{t('contrasena')}</Label>
          <Input
            id="password"
            autoComplete="new-password"
            {...register('password', { required: t('contrasenaRequerida') })}
            type="password"
          />
          {errors.password && <FormError message={errors.password.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="passwordConfirm">{t('confirmarContrasena')}</Label>
          <Input
            id="passwordConfirm"
            autoComplete="new-password"
            {...register('passwordConfirm', {
              required: t('confirmaContrasena'),
              validate: (value) => value === password.current || t('contrasenasNoCoinciden'),
            })}
            type="password"
          />
          {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
        </FormItem>
      </div>

      <Button disabled={loading} type="submit" variant="default">
        {loading ? t('procesando') : t('registrarse')}
      </Button>

      <p className="text-ui-sm text-ink-body mt-8">
        {`${t('yaTienesCuenta')} `}
        <Link
          className="text-blue-brand border-gold border-b-2 font-semibold"
          href={`/login${allParams}`}
        >
          {t('iniciarSesion')}
        </Link>
      </p>
    </form>
  )
}
