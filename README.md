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
<pre>produce(baseState: Object | Array | Map | Set | Promise | [, producer: (draftState) => void][, ...states: object[] | array[]): nextState</pre>
<ul>
  <li>
    <strong>baseState</strong>: Object | Array | Map | Set | Promise
  </li>
  <li>
    <strong>producer</strong>
    <ul>
      <li>
        <strong>Object</strong>: (opcional) Se baseState for um objeto, draftState deverá ser um objeto. O nextState será o resultado do merge entre draftState e baseState. 
      </li>
      <li>
        <strong>Array</strong>: (opcional) Se baseState for passado array, draftState deverá ser um array. O nextState será o resultado do merge entre draftState e baseState. 
      </li>
      <li>
        <strong>Map</strong>: (opcional) Se baseState for um Map, draftState deverá ser um Map. O nextState será o resultado do merge entre draftState e baseState. 
      </li>
      <li>
        <strong>Set</strong>: (opcional) Se baseState for um Set, draftState deverá ser um Set. O nextState será o resultado do merge entre draftState e baseState. 
      </li>
       <li>
        <strong>Promise</strong>: (opcional) Se baseState for uma Promise, draftState deverá ser do mesmo tipo da Promise. O nextState será uma Promise do resultado do merge entre draftState e baseState. 
      </li>
    </ul>
  </li>
  <li>
    <strong>producer</strong>: (opcional) Se for passado uma função, currentState pode ser um objeto ou um array. O draftState é um clone do currentState onde será alterado dentro da função producer. O nextState será o resultado do draftState em cima do currentState.
  </li>
  <li>
    <strong>states</strong>: (opcional) o parâmetro states será tratado internamente como um Array. Podendo ser um Array de Objetos ou um Array de Arrays. Se states for um Array de Arrays, todos os parâmetros de produce serão mergeados e tratados como Array para gerar o Array nextState. Se states for um Array de Objetos, todo os parâmetros de produce serão mergeados e tratados como Objetos para gerar o Objeto nextState.
  </li>
  <li>
    Se o segundo parâmetro de produce for omitido, o nextState será um deepClone de currentState.
  </li>
</ul>

<h3>Exemplo 2</h3>
<p>
  Utilizando objetos criados a partir de classes e funções construtoras, os prototipos são herdados para os objetos criados a partir do produce.
</p>
<img width="500" src="https://github.com/Cahmoraes/simple-immuter-development/blob/main/src/assets/images/example-2.png">

<h3>Clonagem profunda de Array</h3>
<img width="400" src="https://github.com/Cahmoraes/simple-immuter-development/blob/main/src/assets/images/example-clone-array.png">

<h3>Clonagem profunda de Objeto</h3>
<p>baseState (objeto a ser clonado)</p>
<img width="400" src="https://github.com/Cahmoraes/simple-immuter-development/blob/main/src/assets/images/example-clone-object.png">
<p>nextState: (objeto clonado)</p>
<img src="https://github.com/Cahmoraes/simple-immuter-development/blob/main/src/assets/images/example-result-clone-object.png">
<p>
<strong>Observação:</strong> Estruturas de dados como Map e Set, possuem métodos para inserção, limpeza e remoção de elementos. Para garantir a imutabilidade do clone resultante, esses métodos são sobrescritos no processo de imutabilidade, que ocorre logo após o merge entre o baseState com o draftState.<br>
  Para refletir a remoção, adição ou limpeza dessas estruturas no nextState, é necessário realizá-la dentro da função producer.
</p>

<h3>Alterando estrutura Map dentro da função producer</h3>
<p>O exemplo a seguir demonstra a inserção e remoceção de elementos de dentro da estrutura Map do exemplo anterior</p>
<img width="400" src="https://github.com/Cahmoraes/simple-immuter-development/blob/main/src/assets/images/example-draft-map-clone-object.png">
<p>
  <strong>Resultado:</strong>
  Observe que na imagem acima, a instrução de remoção: <pre>nextPeople.hobbies.set('sport', 'footbal')</pre> diretamente no nextPeople foi executada.
  Entretando, na imagem abaixo, a seta vermelha indica o resultado no terminal, informando que este objeto foi congelado e não deve ser mutado. Ou seja, as mutações devem ocorrer dentro da função producer.
</p>
<p>
  <img src="https://github.com/Cahmoraes/simple-immuter-development/blob/main/src/assets/images/example-result-draft-map-clone-object.png">
</p>
<h3>Merge de Arrays</h3>
<p>Se os dois parâmetros de produce forem arrays, o nextState será um array imutável resultante do merge de ambos os arrays</p>
<img src="https://github.com/Cahmoraes/simple-immuter-development/blob/main/src/assets/images/merge-arrays.png">
<p>Se o parâmetro states for passado e todos os states forem do tipo Array, o nextState será o resultado do merge de todos os Arrays</p>
<img src="https://github.com/Cahmoraes/simple-immuter-development/blob/main/src/assets/images/merge-array-states.png">

<h3>Merge de Objetos</h3>
<p>Se os dois parâmetros de produce forem objetos, o nextState será um objeto imutável resultante do merge de ambos os objetos</p>
<img src="https://github.com/Cahmoraes/simple-immuter-development/blob/main/src/assets/images/merge-objects.png">
<p>Se o parâmetro states for passado e todos os states forem do tipo Object, o nextState será o resultado do merge de todos os Objetos</p>
<img width="500" src="https://github.com/Cahmoraes/simple-immuter-development/blob/main/src/assets/images/merge-objects-states.png">

<h3>Compatibilidade com Promises</h3>
<img width="500" src="https://github.com/Cahmoraes/simple-immuter-development/blob/main/src/assets/images/promise-example.png">

<h3>Compatibilidade com tipo Symbol</h3>
<p>A função produce é capaz de copiar as propriedades Symbol do objeto baseState para o nextState.</p>
<img width="400" src="https://github.com/Cahmoraes/simple-immuter-development/blob/main/src/assets/images/symbol-example.png">

## :computer: Tecnologias utilizadas

- [javascript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
