import React, { useState } from 'react'

import Rest from '../utils/rest'

const baseURL = 'https://mymoney-16dd4.firebaseio.com/'
const { useGet, usePost, useDelete, usePatch } = Rest(baseURL)

const Movimentacoes = ({ match }) => {
  const data = useGet(`movimentacoes/${match.params.data}`)
  const dataMeses = useGet(`meses/${match.params.data}`)
  const [dataPatch, patch] = usePatch()
  const [postData, salvar] = usePost(`movimentacoes/${match.params.data}`)
  const [removeData, remover] = useDelete()
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')

  const onChangeDescricao = evt => {
    setDescricao(evt.target.value)
  }
  const onChangeValor = evt => {
    setValor(evt.target.value)
  }
  const salvarMovimentacao = async() => {
    if(!isNaN(valor) && valor.search(/^[-]?\d+(\.)?\d+?$/) >=0){
      await salvar({
        descricao,
        valor: parseFloat(valor)
      })
      setDescricao('')
      setValor(0)
      data.refetch()
      await sleep(5000)
      dataMeses.refetch()
    }
  }
  const sleep = time => new Promise(resolve => setTimeout(resolve, time))
  const removerMovimentacao = async(id) => {
    await remover(`movimentacoes/${match.params.data}/${id}`)
    data.refetch()
  }

  const alterarPrevisaoEntrada = (evt) => {
    patch(`meses/${match.params.data}`, { previsao_entrada: evt.target.value })
  }
  const alterarPrevisaoSaida = (evt) => {
    patch(`meses/${match.params.data}`, { previsao_saida: evt.target.value })
  }

  return (
    <div className='container'>
      <h1>Movimentações</h1>
      {
        !dataMeses.loading && 
        <div >
          <p className='form-inline'>Previsão entrada: {dataMeses.data.previsao_entrada} <input type='text' onBlur={alterarPrevisaoEntrada} className='form-control col-md-1 mx-2' /> / Previsão saida: {dataMeses.data.previsao_saida} <input type='text' onBlur={alterarPrevisaoSaida} className='form-control col-md-1 mx-2' /> </p>
          <p>Entradas: {dataMeses.data.entradas} / Saidas: {dataMeses.data.saidas}</p>
        </div>
      }
      <table className='table'>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          { data.data &&
            Object
              .keys(data.data)
              .map(movimentacao => {
                return (
                  <tr key={movimentacao}>
                    <td>{data.data[movimentacao].descricao}</td>
                    <td>
                      {data.data[movimentacao].valor}{' '}
                      <button type='button' onClick={() => removerMovimentacao(movimentacao)} className='btn btn-danger btn-sm mx-2'>-</button>
                    </td>
                  </tr>
                )
              })
          }
          <tr>
            <td>
              <input type='text' value={descricao} onChange={onChangeDescricao} className='form-control col-md-8 mb-3' />
            </td>
            <td className='form-row align-items-center'>
              <input type='text' value={valor} onChange={onChangeValor} className='form-control col-md-4 mb-3' />
              <button type='button' onClick={salvarMovimentacao} className='btn btn-success mb-3'>+</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
export default Movimentacoes
