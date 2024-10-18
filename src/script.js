const modal = document.querySelector('.modal-container')
const formModal = document.forms.namedItem('formModal')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-nome')
const sFuncao = document.querySelector('#m-funcao')
const sSalario = document.querySelector('#m-salario')
const btnSalvar = document.querySelector('#btnSalvar')

const API_URL = `http://localhost:3000/funcionarios`


let itens = []
let id
let funcionarioNovo
let edit


function Funcionario(formModal){
  this.nome = formModal.nome.value
  this.funcao = formModal.funcao.value
  this.salario = formModal.salario.value
}

function openModal() {
  
    modal.classList.add('active')
    modal.onclick = e => {
      if (e.target.className.indexOf('modal-container') !== -1) {
        modal.classList.remove('active')
        clearForm()
      }
    }
    
  }

 // Pega os funcionarios do banco de dados e coloca na tabela
  buscaDados().then(objetos => {
    objetos.forEach(funcionario => {
      tbody.innerHTML += insertItens(funcionario)
    });

  })

 //ao clicar no editar executa a async function deixando edit true para identificar put e nao post
  window.editItem = async (funcionarioID) => {
    edit = true
    const funcionario = await buscaDadoPorID(funcionarioID)
    if (funcionario) { //preenche os campos do formModal
      sNome.value = funcionario.nome;
      sFuncao.value = funcionario.funcao;
      sSalario.value = funcionario.salario;
      id = funcionario.id
    }
    openModal()
  }
  
  //deleta funcionario
  window.deleteItem = (id) => {
    deletaDado(id)
  }


  btnSalvar.onclick = async () => {

    //impede de salvar com campos vazios
    if (sNome.value == '' || sFuncao.value == '' || sSalario.value == '') {
      return
    }

    // caso não seja edição
    if(!edit){

      funcionarioNovo = new Funcionario(formModal)
      postaDados(funcionarioNovo)

    } else{ // se for edição

      const funcNovo = new Funcionario(formModal)
      await editaDado(id, funcNovo)

    }
    
    edit = false
    modal.classList.remove('active')
    
  }

// template dos funcionarios
function insertItens(formulario) {

    return  `
    <tr>
        <td>${formulario.nome}</td>
        <td>${formulario.funcao}</td>
        <td>R$ ${formulario.salario}</td>
        <td class="acao">
        <button onclick="editItem('${formulario.id}')"><i class='bx bx-edit' ></i></button>
        </td>
        <td class="acao">
        <button onclick="deleteItem('${formulario.id}')"><i class='bx bx-trash'></i></button>
        </td>
    </tr>
  `
}

//limpa formulario
function clearForm() {
  sNome.value = '';
  sFuncao.value = '';
  sSalario.value = '';
  id = undefined; // Reseta o ID ao limpar o formulário
}



// CRUD

async function postaDados(funcionarioNovo){
  try {

    return await fetch(API_URL, { 

	     method: 'POST',
	     body: JSON.stringify(funcionarioNovo),
	     headers: {
	     	'Content-type': 'application/json; charset=UTF-8'
	     }
  })
    
  } catch (error) {
    console.log(error)
  }
}


async function buscaDados(){

  try {
    const busca = await fetch(API_URL)
    return await busca.json()

  } catch (error) {
    console.log(error)
  }
}

async function deletaDado(id){
  try {
    return await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })
    
  } catch (error) {
    console.log(error)
  }
}

async function editaDado(id, funcionario){
  try {
    return await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(funcionario),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
    })
  } catch (error) {
    console.log(error)
  }
}


async function buscaDadoPorID(id) {
  try{

      const carro = await fetch(`${API_URL}/${id}`)
      return await carro.json()

  }catch(error) {
      alert(mensagemErro(error))
  }
}
