/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

    it('Deve validar contrato de usuários', () => {
     cy.request('usuarios').then(response => {
          return contrato.validateAsnyc(response.body)
     })
          
    });

    it('Deve listar usuários cadastrados', () => {
     cy.request({
          method: 'GET',
          url: 'usuarios'

     }).then((response) => {
          expect(response.status).to.equal(200)
          expect(response.duration).to.be.lessThan(50)

     })
     
    });

    it('Deve cadastrar um usuário com sucesso', () => {
     cy.request({
          method: 'POST',
          url: 'usuarios',
          body: {
               "nome": "Fulano da Silva",
               "email": "beltrano@qa.com.br",
               "password": "teste",
               "administrador": "true"
             

          },
          headers: { authorization: token }


     }).then((response => {
          expect(response.staus).to.equal(201)
          expect(response.body.message).to.equal("Cadastro realizado com sucesso")
     }))
         
    });

    it('Deve validar um usuário com email inválido', () => {
     cy.cadastrarUsuario(token, 'Usuario', 'email', "senha", "true")
     .then((response) => {
          expect(response.status).to.equal(400)
          expect(response.body.message).to.equal("Este email já está sendo usado")
      })
     
         
    });

    it('Deve editar um usuário previamente cadastrado', () => {
     cy.request('usuarios').then(response => {
          let id = response.body.usuarios[1]._id
          cy.request({
              method: 'PUT', 
              url: `usuarios/${id}`,
              headers: {authorization: token}, 
              body: 
              {
                  "nome": "Fulano da Silva",
                  "email": "beltrano@qa.com.br",
                  "senha": "teste",
                  "administrador": "true"
                }
          }).then(response => {
              expect(response.body.message).to.equal("Registro alterado com sucesso")
          })
      })
         
    });

    it('Deve deletar um usuário previamente cadastrado', () => {
     let usuario = `usuario` + `${Math.floor(Math.random() * 100000000)}`
     let email = `${usuario}@qa.com`
        cy.cadastrarUsuario(token,"Isabela Marcal" ,"isabela.marcal@qa.com" , "teste", "true")
        .then(response => {
            let id = response.body._id
            cy.request({
                method: 'DELETE',
                url: `usuarios/${id}`,
                headers: {authorization: token}
            }).then(response =>{
                expect(response.body.message).to.equal("Registro excluído com sucesso")
                expect(response.status).to.equal(200)
            })
        })
        
    });


});
