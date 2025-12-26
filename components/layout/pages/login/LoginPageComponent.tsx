import {
  BodyText,
  Heading,
  InputGroup,
  PrimaryBtn,
  TextLink,
} from '@/components/ui'
import styles from './LoginPageComponent.module.scss'

export const LoginPageComponent = () => {
  return (
    <main className={styles.loginPage}>
      <section id='main' className={styles.content}>
        <Heading as='h1' size='page'>
          No Zer0s
        </Heading>
        <BodyText variant='lg'>Every Ask Counts</BodyText>
        <BodyText>
          No Zer0s is a simple activity tracker for recording when yhou ask. It
          focuses on effort, not outcome. Log each time you ask, record what
          happened, and see your own progress over time.{' '}
        </BodyText>
      </section>
      <section id='login-form' className={styles.loginForm}>
        <form>
          <Heading as='h2' size='section'>
            Login
          </Heading>

          <div className={styles.inputs}>
            <InputGroup label='Email' name='email' required />
            <InputGroup label='Password' name='password' required />
          </div>

          <PrimaryBtn type='submit'> Sign In</PrimaryBtn>
        </form>
        <div className={styles.divider}>
          <span>
            <BodyText>Or</BodyText>
          </span>
        </div>
        <PrimaryBtn variant='secondary' type='button'>
          Sign in with Google
        </PrimaryBtn>
      </section>
      <section id='forgot-password' className={styles.loginFooter}>
        <TextLink href='/forgot-password'>Forgot Password?</TextLink>

        <BodyText variant='sm'>
          No Zer0s is an invite-only app. Please contact your management for
          registration.
        </BodyText>
      </section>
    </main>
  )
}
