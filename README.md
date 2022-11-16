<h3 align="center">
  <a href="https://github.com/Cahmoraes/simple-immuter-development/" target="_blank">Simple Immuter</a>
</h3>

## :rocket: Sobre

  <img src="https://github.com/Cahmoraes/simple-immuter-development/blob/main/src/assets/images/immuter-cycle.png" alt="Simple Observable">
  <p align="center">by: Immer</p>

## Descrição

<p>Desenvolvimento da biblioteca Simple Immuter.</p>
<p>
  Esse projeto surgiu por meio de uma motivação da biblioteca <a href="https://immerjs.github.io/immer/">Immer</a>.<br>
  Ao longo das últimas semanas estive estudando a fundo o desenvolvimento de uma função de cloneDeep, capaz de realizar clonagem profunda de objetos e arrays. Tendo como inspiração a função cloneDeep da biblioteca <a href="https://lodash.com/docs/4.17.15">lodash</a>.<br>
  Para isso precisei me aprofundar no desenvolvimento de funções recursivas, para me auxiliar em descer os níveis de profundidade dos objetos e mantendo uma fácil interpretação e manutenibilidade das mesmas.
</p>
<p>
  Inspirado na função produce da biblioteca Immer, o Simple Immuter opera de modo semelhante.<br>
  A ideia básica é que você aplicará todas as suas alterações a um draftState temporário, que é uma cópia profunda do currentState. Assim que todas as suas mutações forem concluídas, o Simple Immuter produzirá o nextState com base nas mutações do draftState em cima do currentState. Isso significa que você pode interagir com os seus dados simplesmente modificando-os e mantendo todos os benefícios dos dados imutáveis, isto é, o nextState será um cópia profunda e imutável do currentState.
</p>
<h3>Exemplo 1</h3>
<img width="500" src="https://github.com/Cahmoraes/simple-immuter-development/blob/main/src/assets/images/example-1.png">
<h3>Resultado</h3>
<img width="400" src="https://github.com/Cahmoraes/simple-immuter-development/blob/main/src/assets/images/result-1.png">

<p>
  O baseState não será alterado, mas o nextState será uma nova árvore imutável que reflete todas as alterações feitas no draftState (e compartilhando estruturalmente as coisas que não foram alteradas).
</p>

<h3>produce</h3>
<pre>produce(baseState: Object | Array | Map | Set | [, producer: (draftState) => (void | draftState) ]): nextState</pre>

<strong>producer</strong>: (opcional) Se for passado uma função, o parâmetro draftState será um clone de baseState, que pode ser alterado dentro da função producer. O nextState será o resultado de draftState em cima do currentState.

```js
import { si } from '@cahmoraes93/simple-immuter'

const user = {
  name: 'cahmoraes',
  age: 28,
  books: ['Sapiens', 'Rápido e Devagar'],
}

const clone = si.produce(user)

console.log(clone)
//=> {  name: 'cahmoraes',  age: 28,  books: ['Sapiens', 'Rápido e Devagar'] }

console.log(Object.isFrozen(clone))
//=> true
```
