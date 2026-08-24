'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User } from '@/payload-types'
import { useAuth } from '@/providers/Auth'
import { useRouter } from 'next/navigation'
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

type FormData = {
  email: string
  name: User['name']
  password: string
  passwordConfirm: string
}

export const AccountForm: React.FC = () => {
  const { setUser, user } = useAuth()
  const t = useTranslations('Cuenta')
  const ta = useTranslations('Auth')
  const [changePassword, setChangePassword] = useState(false)

  const {
    formState: { errors, isLoading, isSubmitting, isDirty },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<FormData>()

  const password = useRef({})
  password.current = watch('password', '')

  const router = useRouter()

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (user) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`, {
          // Make sure to include cookies with fetch
          body: JSON.stringify(data),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        })

        if (response.ok) {
          const json = await response.json()
          setUser(json.doc)
          toast.success(t('cuentaActualizada'))
          setChangePassword(false)
          reset({
            name: json.doc.name,
            email: json.doc.email,
            password: '',
            passwordConfirm: '',
          })
        } else {
          toast.error(t('errorActualizar'))
        }
      }
    },
    [user, setUser, reset, t],
  )

  useEffect(() => {
    if (user === null) {
      router.push(
        `/login?error=${encodeURIComponent(
          t('debesIniciarSesion'),
        )}&redirect=${encodeURIComponent('/account')}`,
      )
    }

    // Once user is loaded, reset form to have default values
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: '',
        passwordConfirm: '',
      })
    }
  }, [user, router, reset, changePassword, t])

  return (
    <form className="max-w-xl" onSubmit={handleSubmit(onSubmit)}>
      {!changePassword ? (
        <Fragment>
          <p className="text-ui-sm text-ink-body mb-8">
            {`${t('ajustesTexto')} `}
            <button
              className="text-blue-brand border-gold cursor-pointer border-b-2 font-semibold"
              onClick={() => setChangePassword(!changePassword)}
              type="button"
            >
              {t('clicAqui')}
            </button>
            {` ${t('paraCambiarContrasena')}`}
          </p>

          <div className="flex flex-col gap-8 mb-8">
            <FormItem>
              <Label htmlFor="email">{ta('correo')}</Label>
              <Input
                id="email"
                {...register('email', { required: ta('correoRequerido') })}
                type="email"
              />
              {errors.email && <FormError message={errors.email.message} />}
            </FormItem>

            <FormItem>
              <Label htmlFor="name">{ta('nombre')}</Label>
              <Input
                id="name"
                {...register('name', { required: t('nombreRequerido') })}
                type="text"
              />
              {errors.name && <FormError message={errors.name.message} />}
            </FormItem>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p className="text-ui-sm text-ink-body mb-8">
            {`${t('cambiaContrasenaTexto')} `}
            <button
              className="text-blue-brand border-gold cursor-pointer border-b-2 font-semibold"
              onClick={() => setChangePassword(!changePassword)}
              type="button"
            >
              {t('cancelar').toLowerCase()}
            </button>
            {'.'}
          </p>

          <div className="flex flex-col gap-8 mb-8">
            <FormItem>
              <Label htmlFor="password">{t('nuevaContrasena')}</Label>
              <Input
                id="password"
                {...register('password', { required: ta('contrasenaRequerida') })}
                type="password"
              />
              {errors.password && <FormError message={errors.password.message} />}
            </FormItem>

            <FormItem>
              <Label htmlFor="passwordConfirm">{ta('confirmarContrasena')}</Label>
              <Input
                id="passwordConfirm"
                {...register('passwordConfirm', {
                  required: ta('confirmaContrasena'),
                  validate: (value) => value === password.current || ta('contrasenasNoCoinciden'),
                })}
                type="password"
              />
              {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
            </FormItem>
          </div>
        </Fragment>
      )}
      <Button disabled={isLoading || isSubmitting || !isDirty} type="submit" variant="default">
        {isLoading || isSubmitting
          ? ta('procesando')
          : changePassword
            ? t('cambiarContrasena')
            : t('actualizarCuenta')}
      </Button>
    </form>
  )
}
