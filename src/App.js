import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Componente para exibir um item da lista
const ListItem = ({ item }) => {
  return (
    <tr>
      <td>{item.name}</td>
      <td>{item.document}</td>
      <td>{item.email}</td>
      <td>{item.amount}</td>
      <td>{item.due_date}</td>
      <td>{item.uuid}</td>
    </tr>
  );
};

// Componente principal para a listagem e formulário
const App = () => {
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/billings?page=${currentPage}`);
        setItems(response.data.items);
      } catch (error) {
        console.error('Erro ao buscar itens:', error);
      }
    };

    fetchItems();
  }, [currentPage]);

  // Função para lidar com o envio do arquivo
  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    axios.post('http://localhost:3000/billings/import', formData)
      .then(response => {
        console.log('Arquivo enviado com sucesso:', response);
        // Você pode querer atualizar a lista de itens após a importação bem-sucedida
      })
      .catch(error => {
        console.error('Erro ao enviar arquivo:', error);
      });
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='container mt-5'>
      <h2>Importar Arquivo</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileUpload} className="form-control " />
        <br/>
        <button type="submit" className="btn btn-primary btn-lg float-end">Enviar</button>
      </form>
      <br/>
      <h2>Lista de Itens</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Documento</th>
            <th>Email</th>
            <th>Valor</th>
            <th>Data de Vencimento</th>
            <th>UUID</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <ListItem key={item.id} item={item} />
          ))}
        </tbody>
      </table>
      <Pagination paginate={paginate} currentPage={currentPage}  />
    </div>
  );
};

const Pagination = ({ paginate, currentPage }) => {
  return (
    <nav>
      <ul className="pagination">
          <li className="page-item">
            <a onClick={() => paginate(currentPage == 1 ? 1 : currentPage-1)} href="!#" className="page-link">
              Previous
            </a>
          </li>
          <a onClick={() => paginate(currentPage+1)} href="!#" className="page-link">
            Proxima
          </a>
      </ul>
    </nav>
  );
};

export default App;