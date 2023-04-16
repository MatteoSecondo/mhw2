/* TODO: inserite il codice JavaScript necessario a completare il MHW! */

function stringToInt(questionId)
{  
    if (questionId === 'one')
    {
        return 1;
    }
    if (questionId === 'two') 
    {
        return 2;
    } else 
    {
        return 3;
    }
}

function reset()
{
    //riporto i div al loro stato originario
    for (let answer of answers)
    {
        answer.classList.remove('answer-not-selected');
        answer.classList.remove('answer-selected');
    }

    //tolgo la sezione dei risultati
    const article = document.querySelector('body article');
    article.removeChild(results);

    //tolgo la spunta dai checkbox
    for (let answer of state)
    {
        let checkbox = answer.querySelector('.checkbox');
        checkbox.src = 'images/unchecked.png';
    }

    //reimposto le variabili che tengono conto dello stato del quiz
    x = 0;
    oldQuestionId = undefined;
    oldCheckbox = undefined;
    oldAnswer = undefined;
    state = [];

    //riassegno il listener a tutti i div risposta
    for (let answer of answers)
    {
        answer.addEventListener('click', selectQuestion);
    }

}

function setResults()
{
    //confronta tutti i valori delle risposte
    for (let i = 0; i < state.length - 1; i++)
    {
        let choiceId = state[i].dataset.choiceId;
        for (let j = i + 1; j < state.length; j++)
        {
            let otherChoiceId = state[j].dataset.choiceId;
            //sono tutti diversi
            if (choiceId !== otherChoiceId)
            {
                let firstQuestion = state[0].dataset.choiceId;
                titleResult = (RESULTS_MAP[firstQuestion]).title;
                personalityResult = (RESULTS_MAP[firstQuestion]).contents;
            }
            //ce ne sono almeno 2 uguali
            else
            {
                titleResult = (RESULTS_MAP[choiceId]).title;
                personalityResult = (RESULTS_MAP[choiceId]).contents;
            }
        }    
    }

}

function finish()
{
    //creo l'interfaccia risultato
    const article = document.querySelector('body article');
    const results = document.createElement('section');
    results.id = 'results';
    article.appendChild(results); 

    const title = document.createElement('h1');
    const personality = document.createElement('p');
    const button = document.createElement('button');
     
    personality.id = 'personality';
    button.id = 'button';
    button.type = 'button';
    button.textContent = 'Ricomincia il quiz';

    //assegno il listener al bottone
    button.addEventListener('click', reset);

    //inserisco i valori nella section dei risultati in base alle risposte date
    setResults();
    title.textContent = titleResult;
    personality.textContent = personalityResult;

    results.appendChild(title);
    results.appendChild(personality);
    results.appendChild(button);
}

function select(answersForQuestion, answerSelected, questionId)
{ 
    //prendo il checkbox all'interno del div risposta
    let checkboxSelected = answerSelected.querySelector('.checkbox');

    //applico il comportamento per le domande non selezionate
    for (let answer of answersForQuestion)
    {
        answer.classList.add('answer-not-selected');
    }
    answerSelected.classList.remove('answer-not-selected');

    //applico il comportamento per le risposte selezionate
    answerSelected.classList.add('answer-selected');
    checkboxSelected.src = 'images/checked.png';
    answerSelected.removeEventListener('click', selectQuestion);

    //la funzione è già stata chiamata almeno una volta
    if (oldQuestionId !== undefined)
    {
        //cambio risposta alla stessa domanda
        if (questionId === oldQuestionId)
        {
            oldCheckbox.src = 'images/unchecked.png';
            oldAnswer.classList.remove('answer-selected');
            oldAnswer.addEventListener('click', selectQuestion);
        }
    }

    //stato del quiz
    let questionIndex = stringToInt(questionId) - 1;
    state[questionIndex] = answerSelected;
    oldCheckbox = checkboxSelected;
    oldAnswer = answerSelected; 
    oldQuestionId = questionId;

    if(state[0] !== undefined && state[1] !== undefined && state[2] !== undefined) 
    {
        //rimuovo il listener a tutti i div risposta
        for (let answer of answers)
        {
            answer.removeEventListener('click', selectQuestion);
        }

        finish();
    }

}

/*in base alla risposta data, seleziona tutte le risposte relative a quella domanda 
(in modo da trattare le risposte di ogni domanda in modo indipendente da quelle delle altre domande)*/
function selectQuestion(event)
{
    let answersForQuestion;
    let answerSelected = event.currentTarget;
    let questionId = answerSelected.dataset.questionId;

    if (questionId === 'one')
    {
        answersForQuestion = document.querySelectorAll('[data-question-id = "one"]');
    }
    else if (questionId === 'two')
    {
        answersForQuestion = document.querySelectorAll('[data-question-id = "two"]');
    }
    else
    {
        answersForQuestion = document.querySelectorAll('[data-question-id = "three"]');
    }

    select(answersForQuestion, answerSelected, questionId);
}




//prendo tutti i div risposta
const answers = document.querySelectorAll('.choice-grid div');

//assegno il listener a tutti i div risposta
for (let answer of answers)
{
    answer.addEventListener('click', selectQuestion);
}

let oldCheckbox;
let oldAnswer;
let oldQuestionId;
let state = [];
let titleResult;
let personalityResult;

