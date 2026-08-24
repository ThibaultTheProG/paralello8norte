'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { SectionHeading } from '@/components/p8'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslations } from 'next-intl'
import React, { Fragment, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
}

export const ForgotPasswordForm: React.FC = () => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const t = useTranslations('Auth')

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`,
        {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        },
      )

      if (response.ok) {
        setSuccess(true)
        setError('')
      } else {
        setError(t('errorGenerico'))
      }
    },
    [t],
  )

  if (success) {
    return (
      <Fragment>
        <SectionHeading
          size="sm"
          subtitle={t('solicitudEnviadaTexto')}
          title={t('solicitudEnviada')}
        />
      </Fragment>
    )
  }

  return (
    <Fragment>
      <SectionHeading
        className="mb-8"
        size="sm"
        subtitle={t('recuperarTexto')}
        title={t('recuperarContrasena')}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        {error && <Message className="mb-8" error={error} />}

        <FormItem className="mb-8">
          <Label htmlFor="email">{t('correo')}</Label>
          <Input
            id="email"
            autoComplete="email"
            {...register('email', { required: t('correoRequerido') })}
            type="email"
          />
          {errors.email && <FormError message={errors.email.message} />}
        </FormItem>

        <Button type="submit" variant="default">
          {t('enviar')}
        </Button>
      </form>
    </Fragment>
  )
}
