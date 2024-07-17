import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiPlus } from "react-icons/fi";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/auth";
import { toast } from "react-toastify";
import './new.css';

export default function New() {
    const [customers, setCustomers] = useState([]);
    const [loadCustomer, setLoadCustomer] = useState(true);
    const [customerSelected, setCustomerSelected] = useState(0);
    const [idCustomer, setIdCustomer] = useState(false);

    const [companies, setCompanies] = useState([]);
    const [loadCompanies, setLoadCompanies] = useState(true);
    const [companiesSelected, setCompaniesSelected] = useState(0);
    const [idCompanies, setIdCompanies] = useState(false);

    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [complemento, setCoplemento] = useState('');
    const [assunto, setAssunto] = useState('');
    const [status, setStatus] = useState('Aberto');

    useEffect(() => {
        async function loadCustomers() {
            const querySnapshot = await getDocs(collection(db, "customers"));
            let lista = [];
            querySnapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    NickName: doc.data().NickName
                });
            });
            setCustomers(lista);
            setLoadCustomer(false);
        }

        async function loadCompanies() {
            const querySnapshot = await getDocs(collection(db, "companies"));
            let lista = [];
            querySnapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    companyname: doc.data().companyname
                });
            });
            setCompanies(lista);
            setLoadCompanies(false);
        }

        async function loadTicketById(ticketId) {
            const docRef = doc(db, "LogTickets", ticketId);
            const snapshot = await getDoc(docRef);
            if (snapshot.exists()) {
                setAssunto(snapshot.data().assunto);
                setStatus(snapshot.data().status);
                setCoplemento(snapshot.data().complemento);
                
                let customerIndex = customers.findIndex(item => item.id === snapshot.data().clienteId);
                setCustomerSelected(customerIndex);
                setIdCustomer(true);
                
                let companyIndex = companies.findIndex(item => item.id === snapshot.data().companiesID);
                setCompaniesSelected(companyIndex);
                setIdCompanies(true);
            } else {
                console.log("No such document!");
            }
        }

        loadCustomers();
        loadCompanies();

        if (id) {
            loadTicketById(id);
        }
    }, [id]);

    function handleOptionChange(e) {
        setStatus(e.target.value);
    }

    function handleChangeCustomer(e) {
        setCustomerSelected(e.target.value);
    }

    function handleChangeCompanies(e) {
        setCompaniesSelected(e.target.value);
    }

    async function handleRegister(e) {
        e.preventDefault();

        if (idCustomer && idCompanies) {
            const docRef = doc(db, "LogTickets", id);
            await updateDoc(docRef, {
                cliente: customers[customerSelected].NickName,
                clienteId: customers[customerSelected].id,
                companies: companies[companiesSelected].companyname,
                companiesID: companies[companiesSelected].id,
                assunto: assunto,
                complemento: complemento,
                status: status,
                userId: user.uid
            })
            .then(() => {
                toast.info("Pedido atualizado com sucesso!");
                setCustomerSelected(0);
                setCompaniesSelected(0);
                setAssunto('');
                setCoplemento('');
                navigate('/dashboard');
            })
            .catch((error) => {
                toast.error('Ops, erro ao atualizar o seu Pedido!');
                console.log(error);
            });
            return;
        }

        await addDoc(collection(db, "LogTickets"), {
            created: new Date(),
            cliente: customers[customerSelected].NickName,
            clienteId: customers[customerSelected].id,
            companies: companies[companiesSelected].companyname,
            companiesID: companies[companiesSelected].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userId: user.uid
        })
        .then(() => {
            toast.success('Pedido registado!');
            setCoplemento('');
            setAssunto('');
            setCustomerSelected(0);
            setCompaniesSelected(0);
        })
        .catch((error) => {
            toast.error('Ops erro ao registar, tente mais tarde!');
            console.log(error);
        });
    }

    return (
        <div>
            <Header />
            <div className="content">
                <Title name={id ? "Editar Pedido" : "Novo Pedido"}>
                    <FiPlus size={25}/>
                </Title>
                <div className="container">
                    <form className="form-profile" onSubmit={handleRegister}>
                        <label>Clientes</label>
                        {loadCustomer ? (
                            <input type="text" disabled={true} value="...A Carregar"/>
                        ) : (
                            <select value={customerSelected} onChange={handleChangeCustomer}>
                                {customers.map((item, index) => (
                                    <option key={index} value={index}>
                                        {item.NickName}
                                    </option>
                                ))}
                            </select>
                        )}

                        <label>Empresa</label>
                        {loadCompanies ? (
                            <input type="text" disabled={true} value="...A Carregar"/>
                        ) : (
                            <select value={companiesSelected} onChange={handleChangeCompanies}>
                                {companies.map((item, index) => (
                                    <option key={index} value={index}>
                                        {item.companyname}
                                    </option>
                                ))}
                            </select>
                        )}

                        <label>Assunto</label>
                        <textarea 
                            type="text" 
                            placeholder="Indique o assunto"
                            value={assunto}
                            onChange={(e) => setAssunto(e.target.value)}
                        />

                        <label>Status</label>
                        <div className="status">
                            <input 
                                type="radio"
                                name="radio"
                                value="Aberto"
                                onChange={handleOptionChange}
                                checked={status === 'Aberto'}
                            />
                            <span>Aberto</span>

                            <input 
                                type="radio"
                                name="radio"
                                value="Em Progresso"
                                onChange={handleOptionChange}
                                checked={status === 'Em Progresso'}
                            />
                            <span>Em progresso</span>

                            <input 
                                type="radio"
                                name="radio"
                                value="Fechado"
                                onChange={handleOptionChange}
                                checked={status === 'Fechado'}
                            />
                            <span>Fechado</span>
                        </div>

                        <label>Complemento</label>
                        <textarea 
                            type="text" 
                            placeholder="Descreva seu problema (opcional)"
                            value={complemento}
                            onChange={(e) => setCoplemento(e.target.value)}
                        />

                        <button type="submit">Adicionar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
