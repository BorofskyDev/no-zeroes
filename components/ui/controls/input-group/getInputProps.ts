import { InputHTMLAttributes } from 'react'

export type InputVariant = 'text' | 'email' | 'phone' | 'number'

export interface VariantResult {
  type: InputHTMLAttributes<HTMLInputElement>['type']
  props: InputHTMLAttributes<HTMLInputElement>
  maxLength?: number
}

export function getInputProps(
  variant: InputVariant,
  maxLength?: number
): VariantResult {
  let type: InputHTMLAttributes<HTMLInputElement>['type'] = 'text'
  const props: InputHTMLAttributes<HTMLInputElement> = {}

  switch (variant) {
    case 'email':
      type = 'email'
      props.autoComplete = 'email'
      return { type, props, maxLength: maxLength ?? 100 }

    case 'phone':
      type = 'tel'
      props.inputMode = 'tel'
      props.placeholder = '(555) 555-5555'
      return { type, props, maxLength }

    case 'number':
      type = 'number'
      props.inputMode = 'numeric'
      props.pattern = '[0-9]*'
      return { type, props, maxLength }

    case 'text':
    default:
      type = 'text'
      return { type, props, maxLength: maxLength ?? 100 }
  }
}
