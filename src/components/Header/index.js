import { useContext } from 'react'
import { AuthContext } from '../../contexts/auth'
import { Link } from 'react-router-dom'
import {FiHome, FiUser, FiSettings} from 'react-icons/fi'

import avatarImg from '../../assets/avatar.png'
import './header.css'

export default function Header(){

    const { user } = useContext(AuthContext)

    return(
        <nav className="menu-bar">
            <ul>
                <li>
                    <Link to="/dashboard">
                        <FiHome color="#FFF" size={24} />
                        Pedidos
                    </Link>
                </li>
                <li>
                    <Link to="/customers">
                        <FiUser color="#FFF" size={24} />
                        Clientes
                    </Link>
                </li>
                <li>
                    <Link to="/Companies">
                        <FiUser color="#FFF" size={24} />
                        Empresas
                    </Link>
                </li>

                <li>    
                    <Link to="/profile">
                        <FiSettings color="#FFF" size={24} />
                        Perfil
                    </Link>
                </li>
            </ul>

            <div>
                <img 
                    src={
                        user.avatarUrl === null 
                        ? avatarImg 
                        : user.avatarUrl
                    } 
                    alt="foto do usuário" 
                />
            </div>

            
        </nav>
    )
}