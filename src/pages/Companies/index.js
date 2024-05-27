import Header from "../../components/Header";
import Title from "../../components/Title";

//-- React Icons
import { FiUser } from 'react-icons/fi'

export default function Companies(){
    

    return(
        <div>
            <Header />

            <div className='content'>
                <Title name = "Empresas">
                   <FiUser size={25} />
                </Title>
            </div>
            

        </div>
    )
}