'use client'

import { InputHTMLAttributes, ReactNode, useId } from 'react'
import clsx from 'clsx'
import styles from './InputGroup.module.scss'

import { getInputProps, InputVariant } from './getInputProps'

interface InputGroupProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode
  helpText?: ReactNode
  error?: ReactNode
  variant?: InputVariant
  className?: string
}

export const InputGroup = ({
  label,
  helpText,
  error,
  variant = 'text',
  className = '',
  id,
  name,
  maxLength,
  ...rest
}: InputGroupProps) => {
  const generatedId = useId()
  const inputId = id ?? `${name ?? 'input'}-${generatedId}`
  const hasError = Boolean(error)

  // ⬇️ All the logic moved to the helper
  const {
    type,
    props: variantProps,
    maxLength: resolvedMaxLength,
  } = getInputProps(variant, maxLength)

  const describedByIds: string[] = []
  if (helpText && !hasError) describedByIds.push(`${inputId}-help`)
  if (hasError) describedByIds.push(`${inputId}-error`)

  return (
    <div
      className={clsx(
        styles.inputGroup,
        hasError && styles.inputGroupError,
        styles[`inputGroup-${variant}`],
        className
      )}
    >
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}

      <div className={styles.fieldWrapper}>
        <input
          {...rest}
          {...variantProps}
          id={inputId}
          name={name}
          type={type}
          maxLength={resolvedMaxLength}
          aria-invalid={hasError || undefined}
          aria-describedby={
            describedByIds.length ? describedByIds.join(' ') : undefined
          }
          className={styles.input}
        />
      </div>

      {helpText && !hasError && (
        <p id={`${inputId}-help`} className={styles.helpText}>
          {helpText}
        </p>
      )}

      {hasError && (
        <p id={`${inputId}-error`} className={styles.errorText}>
          {error}
        </p>
      )}
    </div>
  )
}
