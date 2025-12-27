'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAndSyncWithEmail } from './lib'
import {
  BodyText,
  Heading,
  InputGroup,
  PrimaryBtn,
  TextLink,
} from '@/components/ui'
import { ColumnSectionContainer, PageContainer } from '@/components/layout'
import styles from './LoginPageComponent.module.scss'

export const LoginPageComponent = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try { 
      const formData = new FormData(e.currentTarget)
      const email = String(formData.get('email') ?? '').trim()
      const password = String(formData.get('password') ?? '')

      if (!email || !password) throw new Error('Email and password are required.')

        const user = await loginAndSyncWithEmail(email, password)
        console.log('Synced User', user)

        router.push('/dashboard')
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Login failed')

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageContainer className={styles.loginPage}>
      <ColumnSectionContainer id='info-section'>
        <div className={styles.heading}>
          <Heading as='h1' size='page'>
            No Zer0s
          </Heading>
          <BodyText variant='lg'>every ask counts</BodyText>
          <BodyText>
            No Zer0s is a simple activity tracker for recording when yhou ask.
            It focuses on effort, not outcome. Log each time you ask, record
            what happened, and see your own progress over time.{' '}
          </BodyText>
        </div>
      </ColumnSectionContainer>
      <ColumnSectionContainer id='login'>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <Heading as='h2' size='section'>
            Login
          </Heading>

          <div className={styles.inputs}>
            <InputGroup label='Email' name='email' required />
            <InputGroup label='Password' name='password' required />
          </div>

        {error ? <BodyText variant='sm'>{error}</BodyText> : null}  
          <PrimaryBtn className={styles.submitBtn} type='submit'> {isLoading ? 'Signing In...' : 'Sign In'  }</PrimaryBtn>
        </form>
        {/* <div className={styles.divider}>
          <span>
            <BodyText>Or</BodyText>
          </span>
        </div>
        <PrimaryBtn variant='secondary' type='button' disabled={isLoading}>
          Sign in with Google
        </PrimaryBtn> */}
      </ColumnSectionContainer>
      <ColumnSectionContainer id='forgot-password'>
        <TextLink href='/forgot-password'>Forgot Password?</TextLink>

        <BodyText variant='sm'>
          No Zer0s is an invite-only app. Please contact your management for
          registration.
        </BodyText>
      </ColumnSectionContainer>
    </PageContainer>
  )
}
