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
    const [emailError, setEmailError] = useState('')

    const { signUp, loadingAuth } = useContext(AuthContext)

    const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    async function handleSubmit(e) {
        e.preventDefault()
        
        if(name !== '' && password !== '' &&  email !== '' && confirmPassword !== '') {
            if(password === confirmPassword) {
                if(pattern.test(email)) {
                    await signUp(email, password, name)
                } else {
                    setErrorMessage('As senhas não são iguais');
                    console.log('Error message set:', errorMessage);
                }
            }
        else {
            setErrorMessage('Preencha todos os campos');
            console.log('Error message set:', errorMessage);
            }
        }

    return(
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
                    {emailError && <div style={{ color:'red'}}>{emailError}</div>}

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

                    {errorMessage && <div style={{ color:'ed'}}>{errorMessage}</div>}

                    <button type='submit'> 
                        { loadingAuth ? 'A carregar' : 'Registar'} 
                    </button>
                
                </form>

                <Link to="/"> Ja tem uma conta? Faça login! </Link>
            </div>
        </div>
    )
}
}