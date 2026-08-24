'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { SectionHeading } from '@/components/p8'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import { useTranslations } from 'next-intl'
import React, { Fragment, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { sendOrderAccessEmail } from './sendOrderAccessEmail'

type FormData = {
  email: string
  orderID: string
}

type Props = {
  initialEmail?: string
}

export const FindOrderForm: React.FC<Props> = ({ initialEmail }) => {
  const { user } = useAuth()
  const t = useTranslations('Auth')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormData>({
    defaultValues: {
      email: initialEmail || user?.email,
    },
  })

  const onSubmit = useCallback(
    async (data: FormData) => {
      setIsSubmitting(true)
      setSubmitError(null)

      try {
        const result = await sendOrderAccessEmail({
          email: data.email,
          orderID: data.orderID,
        })

        if (result.success) {
          setSuccess(true)
        } else {
          setSubmitError(result.error || t('errorGenerico'))
        }
      } catch {
        setSubmitError(t('errorGenerico'))
      } finally {
        setIsSubmitting(false)
      }
    },
    [t],
  )

  if (success) {
    return (
      <Fragment>
        <SectionHeading size="sm" subtitle={t('revisaCorreoTexto')} title={t('revisaCorreo')} />
      </Fragment>
    )
  }

  return (
    <Fragment>
      <SectionHeading
        className="mb-8"
        size="sm"
        subtitle={t('buscarPedidoTexto')}
        title={t('buscarPedido')}
      />

      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
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
          <Label htmlFor="orderID">{t('idPedido')}</Label>
          <Input
            id="orderID"
            {...register('orderID', {
              required: t('idPedidoRequerido'),
            })}
            type="text"
          />
          {errors.orderID && <FormError message={errors.orderID.message} />}
        </FormItem>

        {submitError && <FormError message={submitError} />}

        <Button type="submit" className="self-start" variant="default" disabled={isSubmitting}>
          {isSubmitting ? t('enviando') : t('buscarPedido')}
        </Button>
      </form>
    </Fragment>
  )
}
