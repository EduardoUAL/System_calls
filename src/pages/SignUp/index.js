import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'

import { AuthContext } from '../../contexts/auth'

import logo from '../../assets/logo.png'

export default function SignUp(){
    const [name, setName] = useState('')
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const {signUp, loadingAuth} = useContext(AuthContext)

    const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    async function handleSubmit(e) {
        e.preventDefault()

        if(name !== '' && password !== '' &&  email !== ''){
            await signUp(email, password, confirmPassword, name)
        }
        
        if(name !== '' && password !== '' &&  email !== '' && confirmPassword !== '') {
            if(pattern.test(email)) {
                if(password === confirmPassword) {
                    try {
                        await signUp(email, password, name)
                    } catch (error) {
                        setErrorMessage('Erro ao criar conta.')
                    }
                } else {
                        setErrorMessage('As senhas não são iguais.');
                }
            } else {
                setErrorMessage('Email inválido.');
                }
        } else {
            setErrorMessage('Preencha todos os campos');
            console.log('Error message set:', errorMessage);
            }
        }

        
    }
    return (
        <div className='container-center'>
          <div className='login'>
            <div className='login-area'>    
              <img src={logo} alt="logo do sistemas de Pedidos"/>
            </div>
      
            <form onSubmit={handleSubmit}>
              <h1>Criar conta</h1>
      
              <input 
                type='text'
                placeholder='Introduzir nome'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
      
              <input 
                type='text'
                placeholder='Introduzir email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
      
              <input 
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
      
              <input 
                type='password'
                placeholder='Confirmar password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
      
              <button type='submit'> 
                {loadingAuth ? 'A carregar' : 'Registar'} 
              </button>
            
            </form>
      
            <Link to="/"> Ja tem uma conta? Faça login! </Link>
          </div>
        </div>
      )

