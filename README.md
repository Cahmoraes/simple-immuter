<h3 align="center">
  <a href="https://github.com/Cahmoraes/simple-immuter-development/" target="_blank">Simple Immuter</a>
</h3>

## :rocket: Sobre

  <img src="https://github.com/Cahmoraes/simple-immuter-development/blob/main/src/assets/images/immuter-cycle.png" alt="Simple Observable">
  <p align="center">by: Immer</p>

## Descrição

## Desenvolvimento da biblioteca Simple Immuter.</p>

Esse projeto surgiu por meio de uma motivação da biblioteca <a href="https://immerjs.github.io/immer/">Immer</a>.
Ao longo das últimas semanas estive estudando a fundo o desenvolvimento de uma função de cloneDeep, capaz de realizar clonagem profunda de objetos e arrays. Tendo como inspiração a função cloneDeep da biblioteca <a href="https://lodash.com/docs/4.17.15">lodash</a>.
Para isso precisei me aprofundar no desenvolvimento de funções recursivas, para me auxiliar em descer os níveis de profundidade dos objetos e mantendo uma fácil interpretação e manutenibilidade das mesmas.

Inspirado na função produce da biblioteca Immer, o Simple Immuter opera de modo semelhante.
A ideia básica é que você aplicará todas as suas alterações a um draftState temporário, que é uma cópia profunda do currentState. Assim que todas as suas mutações forem concluídas, o Simple Immuter produzirá o nextState com base nas mutações do draftState em cima do currentState. Isso significa que você pode interagir com os seus dados simplesmente modificando-os e mantendo todos os benefícios dos dados imutáveis, isto é, o nextState será um cópia profunda e imutável do currentState.

O baseState não será alterado, mas o nextState será uma nova árvore imutável que reflete todas as alterações feitas no draftState (e compartilhando estruturalmente as coisas que não foram alteradas).

## Notas da nova versão:

Nesta versão, foi extraído as funções internas: <strong>deepFreeze</strong> e <strong>deepClone</strong>.
Foi removido a compatibilidade da função produce, de receber Promises. Não houve mais sentido para isso e com sua remoção, diminuiu a quantidade de responsabilidades de produce, o que facilitou a melhoria do intelisense com TypeScript.

<h3>produce</h3>

```js
produce(baseState: Object | Array | Map | Set | [, producer: (draftState) => (void | draftState) , producerConfig]): nextState
```

<strong>producer</strong>: (opcional) Se for passado uma função, o parâmetro draftState será um clone de baseState, que pode ser alterado dentro da função producer. O nextState será o resultado de draftState em cima do currentState.
A função producer pode retornar um valor, este valor é o próprio draftState. Geralmente este valor será retornado em casos de resetar completamente o draftState para um estado inicial.

<strong>producerConfig<strong>: (opcional) Objeto de configuração da função producer. Possui propriedade **freeze** que recebe um booleano. Se for true, fará um deepFreeze no resultado final. Se for false, não realizará o deepFreeze. Por padrão é **true**.

## Gerando um clone profundo e imutável com produce

```js
import { si } from '@cahmoraes93/simple-immuter'

const user = {
  name: 'caique',
  age: 28,
  books: ['Sapiens', 'Rápido e Devagar'],
}

const clone = si.produce(user)

console.log(clone)
//=> {  name: 'caique',  age: 28,  books: ['Sapiens', 'Rápido e Devagar'] }

console.log(Object.isFrozen(clone))
//=> true
```

## Gerando clone profundo e imutável com produce, e usando a função producer para atualizar informações do clone resultante

```js
import { si } from '@cahmoraes93/simple-immuter'

const user = {
  name: 'caique',
  age: 28,
  books: ['Sapiens', 'Rápido e Devagar'],
}

const clone = si.produce(user, (draftState) => {
  draftState.name = 'thomas'
  draftState.age = 20
  draftState.books.push('Arquitetura Limpa')
})

console.log(clone)
//=> {  name: 'thomas',  age: 20,  books: ['Sapiens', 'Rápido e Devagar', Arquitetura Limpa] }

console.log(Object.isFrozen(clone))
//=> true
```

## Resetando os valores de draftState

```js
import { si } from '@cahmoraes93/simple-immuter'

const initialState = {
  name: 'caique',
  age: 28,
}

const user = {
  ...user,
  name: 'thomas',
}

const clone = si.produce(user, (draftState) => {
  draftState = initialState
  return draftState
})

console.log(clone)
//=> {  name: 'caique',  age: 28 }

console.log(Object.isFrozen(clone))
//=> true
```

## Gerando clone profundo e mutável com deepClone.

deepClone recebe uma estrutura de dados e gera um clone profundo.

```js
deepClone(baseState: Object | Array | Map | Set): nextState
```

```js
import { si } from '@cahmoraes93/simple-immuter'

const user = {
  name: 'caique',
  age: 28,
  books: ['Sapiens', 'Rápido e Devagar'],
}

const clone = si.deepClone(user)
clone.name = 'thomas'
clone.books.push('Arquitetura Limpa')

console.log(clone)
//=> {  name: 'thomas',  age: 28,  books: ['Sapiens', 'Rápido e Devagar', 'Arquitetura Limpa'] }

console.log(Object.isFrozen(clone))
//=> false
```

## Gerando clone profundo e imutável com deepFreeze.

deepFreeze recebe uma estrutura de dados e gera um clone profundo e imutável.

```js
deepFreeze(baseState: Object | Array | Map | Set): nextState
```

```js
import { si } from '@cahmoraes93/simple-immuter'

const user = {
  name: 'caique',
  age: 28,
  books: ['Sapiens', 'Rápido e Devagar'],
}

const clone = si.deepFreeze(user)
clone.name = 'thomas'
clone.books.push('Arquitetura Limpa')

console.log(clone)
//=> {  name: 'caique',  age: 28,  books: ['Sapiens', 'Rápido e Devagar'] }

console.log(Object.isFrozen(clone))
//=> true
```
