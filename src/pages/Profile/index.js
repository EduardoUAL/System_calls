import { useContext, useState } from "react";
import  Header  from "../../components/Header";
import Title from "../../components/Title";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../services/firebaseConnection";
import { toast } from "react-toastify";

import { AuthContext } from "../../contexts/auth";

import { FiSettings, FiUpload } from "react-icons/fi";

import avatar from "../../assets/avatar.png"

import './profile.css'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


export default function Profile(){
    const { user,storageUser, setUser, logout } = useContext(AuthContext)
    
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
    const [nome, setNome] = useState(user && user.nome)
    const [email, setEmail] = useState(user && user.email)
    const [imageAvatar, setImageAvatar] = useState(null)

    console.log(setEmail)
    
    function handleFile(e){
        if(e.target.files[0]){
            const image = e.target.files[0]

            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                setImageAvatar(image)
                setAvatarUrl(URL.createObjectURL(image))
            } else {
                alert('Envie uma imagem do tipo JPEG ou PNG')
                setImageAvatar(null)
                return
            }
        }
    }

    async function handleUpload(){
        const currentUid = user.uid 
        
        const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`)

        await uploadBytes(uploadRef, imageAvatar)
        .then((snapShot) => {
            
            getDownloadURL(snapShot.ref).then( async (downloadURL) => {
                let urlFoto = downloadURL

                const docRef = doc(db, "users", user.uid)
                await updateDoc(docRef, {
                    avatarUrl: urlFoto,
                    nome: nome
                })
                .then(() => {
                    let data = {
                        ...user,
                        nome: nome,
                        avatarUrl: urlFoto
                    }

                    setUser(data)
                    storageUser(data)
                    toast.success('Atualizado com sucesso!')

                })
            })
        })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        
        if(imageAvatar === null && nome !== ''){
            //update only user's name
            const docRef = doc(db, "users", user.uid)
            await updateDoc(docRef, {
                nome: nome,
            })
            .then(() => {
                let data = {
                    ...user, 
                    nome:nome
                }

                setUser(data)
                storageUser(data)
                toast.success('Atualizado com sucesso!')
            })
        } else if(nome !== '' && imageAvatar !== ''){
            handleUpload()
        }
    }

    return(
        <div>
            <Header />
            <div className="content">
                <Title name="Minha conta">
                    <FiSettings size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleSubmit}>
                        <label className="label-avatar">
                            <span>
                                <FiUpload color="#FFF" size={25} />
                            </span>
                            
                            <input type="file" accept="image/*" onChange={handleFile}/> <br/>
                            {avatarUrl === null ? (
                                <img src={avatar} alt="foto de perfil" width={250} height={250} />
                            ): (
                                <img src={avatarUrl} alt="foto de perfil" width={250} height={250} />
                            )}
                        </label>

                        <label>Name</label>
                        <input 
                            type="text" 
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />

                        <label>Email</label>
                        <input 
                            type="text" 
                            value={email} 
                            disabled={true}
                        />

                        <button type="submit">Salvar</button>
                    </form>
                </div>

                <div className="container">
                    <button className="logout-btn" onClick={() => logout()}>Sair</button>
                </div>
            </div>
            
        </div>
    )
}