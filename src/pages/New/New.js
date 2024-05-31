import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiPlus } from "react-icons/fi";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { toast } from "react-toastify";


export default function New() {

    const [customers, setCustomers] = useState([]);
    const [loadCustomer, setLoadCustomer] = useState(true);
    const [customerSelected, setCustomerSelected] = useState(0);
    const [idCustomer, setIdCustomer] = useState(false);

    const [companyName, setcompanyName] = useState([]);
    const [loadcompany, setLoadcompany] = useState(true);
    const [companySelected, setcompanySelected] = useState(0);
    const [idcompany, setIdcompany] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    const [complemento, setCoplemento] = useState('');
    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');

    const listRef = collection(db, "customers");

    const listRef = collection(db, "companyName");


    useEffect(() => {
        async function loadCustomers() {
            const querySnapshot = await getDocs(listRef)
                .then((snapshot) => {
                    let lista = [];

                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            NickName: doc.data().NickName
                        });
                    });

                    if (snapshot.docs.size === 0) {
                        console.log('NENHUMA EMPRESA FOI ENCONTRADA');
                        setLoadCustomer(false);
                        setCustomers([{ id: '1', NickName: 'Freela' }]);
                        return;
                    }

                    setCustomers(lista);
                    setLoadCustomer(false);

                    if (id) {
                        loadId(lista);
                    }
                })
                .catch((error) => {
                    console.log('ERRO AO PROCURAR CLIENTES', error);
                    setLoadCustomer(false);
                    setCustomers([{ id: '1', NickName: 'Freela' }]);
                });
        }

        loadcompany();
        async function loadcompany() {
            const querySnapshot = await getDocs(listRef)
                .then((snapshot) => {
                    let lista = [];

                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            NickName: doc.data().NickName
                        });
                    });

                    if (snapshot.docs.size === 0) {
                        console.log('NENHUMA EMPRESA FOI ENCONTRADA');
                        setLoadcompany(false);
                        setcompanyName([{ id: '1', NickName: 'Freela' }]);
                        return;
                    }

                    setcompanyname(lista);
                    setLoadcompany(false);

                    if (id) {
                        loadId(lista);
                    }
                })
                .catch((error) => {
                    console.log('ERRO AO PROCURAR CLIENTES', error);
                    setLoadcompany(false);
                    setcompanyName([{ id: '1', NickName: 'Freela' }]);
                });
        }

        loadcompany();

    }, [id]);

    async function loadId(lista) {
        const docRef = doc(db, "LogTickets", id);
        await getDoc(docRef)
            .then((snapshot) => {
                setAssunto(snapshot.data().assunto);
                setStatus(snapshot.data().status);
                setCoplemento(snapshot.data().complemento);

                let index = lista.findIndex(item => item.id === snapshot.data().clienteId);
                setCustomerSelected(index);
                setIdCustomer(true);
            })
            .catch((error) => {
                console.log(error);
                setIdCustomer(false);
            });
    }

    async function loadId(lista) {
        const docRef = doc(db, "LogTickets", id);
        await getDoc(docRef)
            .then((snapshot) => {
                setAssunto(snapshot.data().assunto);
                setStatus(snapshot.data().status);
                setCoplemento(snapshot.data().complemento);

                let index = lista.findIndex(item => item.id === snapshot.data().clienteId);
                setCustomerSelected(index);
                setIdCustomer(true);
            })
            .catch((error) => {
                console.log(error);
                setIdCustomer(false);
            });
    }

    function handleOptionChange(e) {
        setStatus(e.target.value);
    }

    function handeChangeSelect(e) {
        setAssunto(e.target.value);

    }

    function handleChangeCustomer(e) {
        setCustomerSelected(e.target.value);
    }

    async function handleRegister(e, companyId, companyName, customers) {
        e.preventDefault();

        if (idCustomer) {
            const docRef = doc(db, "LogTickets", id);
            await updateDoc(docRef, {
                cliente: customers[customerSelected].NickName,
                clienteId: customers[customerSelected].id,
                companyName: companyName[companySelected].companyname,
                companyId: companyName[companySelected].id,
                assunto: assunto,
                complemento: complemento,
                status: status,
                userId: user.uid
            })
                .then(() => {
                    toast.info("Pedido atualizado com sucesso!");
                    setCustomerSelected(0);
                    setcompanynameSelected(0);
                    setCoplemento('');
                    navigate('/dashboard');
                })
                .catch((error) => {
                    toast.error('Ops, ocorreu um erro ao atualizar o seu Pedido!');
                    console.log(error);
                });

            return;
        }

        //submit a ticket
        await addDoc(collection(db, "LogTickets"), {
            created: new Date(),
            cliente: customers[customerSelected].NickName,
            clienteId: customers[customerSelected].id,
            companyName: companyName[companySelected].companyname,
            companyId: companyName[companySelected].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userId: user.uid
        })
            .then(() => {
                toast.success('Pedido registado!');
                setCoplemento('');
                setCustomerSelected(0);
                setcompanySelected(0);
            })
            .catch((error) => {
                toast.error('Ops, ocorreu um erro ao registar, tente mais tarde!');
                console.log(error);
            });
    }

    return (
        <div>
            <Header />

            <div className="content">
                <Title name={id ? "A Editar o Seu pedido" : "Novo pedido"}>
                    <FiPlus size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleRegister}>
                        <label>Clientes</label>
                        {loadCustomer ? (
                            <input type="text" disabled={true} value="...A carregar" />
                        ) : (
                            <select value={customerSelected} onChange={handleChangeCustomer}>
                                {customers.map((item, index) => {
                                    return (
                                        <option key={index} value={index}>
                                            {item.NickName}
                                        </option>
                                    );
                                })}
                            </select>
                        )}
                        <label>Empresas</label>
                        {loadcompany ? (
                            <input type="text" disabled={true} value="...A carregar" />
                        ) : (
                            <select value={cSelected} onChange={handleChangecompany}>
                                {customers.map((item, index) => {
                                    return (
                                        <option key={index} value={index}>
                                            {item.cpmpanyname}
                                        </option>
                                    );
                                })}
                            </select>
                        )}
                        <label>Assunto</label>
                        <select value={assunto} onChange={handeChangeSelect}>
                            <option value="Suporte">Suporte</option>
                            <option value="Visita Tecnica">Visita Tecnica</option>
                            <option value="Financeiro">Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className="status">
                            <input
                                type="radio"
                                name="radio"
                                value="Aberto"
                                onChange={handleOptionChange}
                                checked={status === 'Aberto'} />
                            <span>Em Aberto</span>

                            <input
                                type="radio"
                                name="radio"
                                value="Progresso"
                                onChange={handleOptionChange}
                                checked={status === 'Progresso'} />
                            <span>Progresso</span>

                            <input
                                type="radio"
                                name="radio"
                                value="Atendido"
                                onChange={handleOptionChange}
                                checked={status === 'Atendido'} />
                            <span>Atendido</span>
                        </div>

                        <label>Complemento</label>
                        <textarea
                            type="text"
                            placeholder="Descreva seu problema (Opcional)"
                            value={complemento}
                            onChange={(e) => setCoplemento(e.target.value)} />

                        <button type="submit">Registar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
