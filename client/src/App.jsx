import { useState } from 'react'
import RegisterForm from './pages/RegisterForm'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

function App() {

  return (
    <GoogleReCaptchaProvider reCaptchaKey="">
      <RegisterForm />
    </GoogleReCaptchaProvider>
  )
}

export default App
