import { useState } from 'react'

//-- React Icons
import { FiUser } from 'react-icons/fi'

//-- Components
import Header from '../../components/Header'
import Title from '../../components/Title'

//-- firebase
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'

//--Toast
import { toast } from 'react-toastify'

export default function Customers(){
    const [ nome, setNome ] = useState('') 
    const [ cc, setcc] = useState('') 
    const [ morada, setmorada] = useState('') 

    async function handleRegister(e){
        e.preventDefault()

        if(nome !== '' && cc !== '' && morada !== ''){
            await addDoc(collection(db, "customers"), {
                nomeFantasia: nome,
                cc: cc,
                morada: morada
            })
            .then(() => {
                setNome('')
                setcc('')
                setmorada('')
                toast.success('Empresa registada com sucesso!')
            })
            .catch((error) => {
                console.log(error)
                toast.error('Erro ao fazer o registo!')
            })
        } else {
            toast.error('Preencha todos os campos!')
        }
    }

    return(
        <div>
            <Header />

            <div className='content'>
                <Title name = "Clientes">
                    <FiUser size={25} />
                </Title>

            <div className="container">
                <form className="form-profile" onSubmit={handleRegister} >
                    <label>Nome Fantasia</label>
                    <input 
                        type='text'
                        placeholder="Nome da empresa"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />

                    <label>cc</label>
                    <input 
                        type='text'
                        placeholder='Digite o cc'
                        value={cc}
                        onChange={(e) => setcc(e.target.value)}
                    />

                    <label>morada</label>
                    <input 
                        type='text'
                        placeholder='Digite o morada'
                        value={morada}
                        onChange={(e) => setmorada(e.target.value)}
                    />

                    <button type='submit'>Salvar</button>
                </form>
            </div>
            </div>
        </div>
    )
}