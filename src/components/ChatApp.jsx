import { useState, useEffect } from 'react';
import '../ChatApp.css';

function ChatApp() {

  const [cliente_field, setCliente_field] = useState('');
  const [valor_pagado_field, setValor_pagado_field] = useState('');



  useEffect(() => {


  }, []);

  const saveTasks = async (cliente_field, valor_pagado_field) => {

    try {

      const response = await fetch("http://localhost:8000/api/registroPago", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id_cobrador: 1, cliente: cliente_field, valor: valor_pagado_field })

      });

      const result = await response.json();
      console.log(result);

      if (!response.ok) {

        const errorText = await response.text();
        throw new Error(`ERROR (${response.status}): ${errorText}`);
      }

    } catch (error) {
      console.error("Error to save data:", error);
      throw Error
    }

  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    await saveTasks(cliente_field, valor_pagado_field);

    setCliente_field('');
    setValor_pagado_field('');

  };

  return (
    <>

      <form id="form" onSubmit={handleSubmit}>

        <input id="cliente_field" type="text" autoComplete="off" value={cliente_field} onChange={(e) => setCliente_field(e.target.value)} placeholder="Cliente" />
        <input id="valor_pagado_field" type="text" autoComplete="off" value={valor_pagado_field} onChange={(e) => setValor_pagado_field(e.target.value)} placeholder="Valor Pagado" />


        <button type="submit">Registar pago</button>
      </form>
    </>
  );
}

export default ChatApp;