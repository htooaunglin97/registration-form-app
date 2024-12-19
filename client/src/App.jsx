import { useState } from 'react'
import RegisterForm from './pages/RegisterForm'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

function App() {

  return (
    <GoogleReCaptchaProvider reCaptchaKey="6LdZomgqAAAAAPI4RzD9WwTNlIqI4TcD0_jEXKDz">
      <RegisterForm />
    </GoogleReCaptchaProvider>
  )
}

export default App
