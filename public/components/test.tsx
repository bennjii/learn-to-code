import React, { useEffect, useState } from 'react'
import styles from '@styles/Home.module.css'
import Button from './button';

import { MultiChoice } from '@components/multi_choice'
import { DragAndDrop } from '@components/drag'
import { FindTheError } from '@components/error'

import { securityRules } from 'firebase-admin';
import { callbackify } from 'util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCheckCircle, faCross, faTimes } from '@fortawesome/free-solid-svg-icons';

import { Dispatch, SetStateAction } from 'react'

interface Answer {
    value: string,
    index: number
}

interface Question {
    type: "errorfind" | "multichoice" | "drag", // Denotes Render Method
    correct_ans: string | number | number[], // Fill uses string, multichoice is number and select is numerical array.
    question: string,
    hint?: string, // for Fill only
    possible_ans?: Answer[] // for all *but* fill 
}

interface Test {
    questions: Question[],
    dificulty: 0 | 1 | 2,
    title: string
}

export const Test: React.FC<{ value: Test, submitForm: Function, closeForm: Function }> = ({ value, submitForm, closeForm }) => {
    const [ currentSelections, setCurrentSelections ]: [(Answer[] | Answer)[], Dispatch<SetStateAction<(Answer[] | Answer)[]>>]  = useState(value.questions.map((e) => {
        switch (e.type) {
            case "errorfind":
                return {value: "", index: -1} 
            case "multichoice":
                return {value: "", index: -1}                                 
            case "drag":
                return []
        }
    }));
    const [ currentQuestion, setCurrentQuestion ] = useState(0);
    const [ takingTest, setTakingTest ] = useState(true);

    const callSubmitForm = () => {
        setTakingTest(false);

        let pass = true;
        let score = { questions: value.questions.length, score: 0};

        currentSelections.forEach((element, index) => {
            if(typeof element == 'object') {             
                if(element.length) {
                    console.log("L")
                    console.log(element) 

                    const res = value.questions[index].correct_ans.map((e, i) => e.index == element[i].index);
                    if(res) {
                        score.score += 1;
                    }else{
                        pass = false;
                    } 
                }else {
                    console.log("R")
                    console.log(element)
                    
                    if(value.questions[index].correct_ans[0] == element.index) {
                        score.score += 1;
                    }else{
                        pass = false;
                    } 
                }
            }else {
                //@ts-ignore
                if(value.questions[index].correct_ans[0] == element.index){
                    score.score += 1;
                }else{
                    pass = false;
                }
            }
        });

        const userResult = {selections: currentSelections, score};
        submitForm(pass, ((score.score / score.questions) * 100));
    }

    const callCloseForm = () => {
        closeForm();
    }

    return (
        <div className={styles.multiChoiceRoom}>
            <div className={styles.testQuestions}>
                <div className={styles.questionTracker}>
                {
                    value.questions.map((e, index) => {
                        return (
                            <div className={(index <= currentQuestion) ? ((index == currentQuestion) ? styles.questionCompleting : styles.questionComplete) : styles.questionIdle}></div>
                        )
                    })  
                }
                </div>
                
                <h1>{(takingTest) ? value.title : "Results"}</h1>
                <p>{(takingTest) ? value.questions[currentQuestion].question : ""}</p>

                <div style={{ overflow: 'auto', height: 'calc(100vh - 50vh)', padding: '1rem' }}>
                    {
                        (takingTest) ?
                        (() => {
                            switch (value.questions[currentQuestion].type) {
                                case "errorfind":
                                    return (
                                        //@ts-ignore
                                        <FindTheError question={value.questions[currentQuestion]} selection={currentSelections[currentQuestion]}
                                        onChange={(e) => {
                                            let clone = currentSelections; 
                                            clone[currentQuestion] = e;
                                            
                                            setCurrentSelections(clone)
                                        }}/>
                                    )
                                case "multichoice":
                                    return (
                                        //@ts-ignore
                                        <MultiChoice question={value.questions[currentQuestion]} selection={currentSelections[currentQuestion]}
                                        onChange={(e) => {
                                            let clone = currentSelections; 
                                            clone[currentQuestion] = e;
                                            
                                            setCurrentSelections(clone)
                                        }}/>
                                    )                                
                                case "drag":
                                    return (
                                        //@ts-ignore
                                        <DragAndDrop question={value.questions[currentQuestion]} selection={currentSelections[currentQuestion]}
                                        onChange={(e) => {
                                        }}/>
                                    )
                            }
                        })()
                        :
                        <div className={styles.answers}>
                            {
                                value.questions.map((e: Question, index) => {
                                    return (
                                        <div>
                                            <h2 style={{ fontFamily: 'consolas', color: '#4b5962', textTransform: 'none' }}>Question {index+1}</h2>
                                            <h4 style={{ fontFamily: 'consolas', color: '#4b5962', textTransform: 'none' }}>{e.question}</h4>
                                            {
                                                (() => {

                                                    switch (e.type) {
                                                        case "errorfind":
                                                            return (
                                                                //@ts-ignore
                                                                <div className={`${styles.questionAnswer} ${(e.correct_ans[0] == currentSelections[index].index) ? styles.correctAnswer : styles.wrongAnswer}`}>
                                                                    {
                                                                        //@ts-ignore
                                                                        currentSelections[index].value
                                                                    }
                                                                    {/* @ts-ignore */}
                                                                    <FontAwesomeIcon icon={(e.correct_ans[0] == currentSelections[index].index) ? faCheckCircle : faTimes} />
                                                                </div>
                                                            )
                                                        case "multichoice":
                                                            return (
                                                                //@ts-ignore
                                                                <div className={`${styles.questionAnswer} ${(e.correct_ans[0] == currentSelections[index].index) ? styles.correctAnswer : styles.wrongAnswer}`}>
                                                                    {
                                                                        //@ts-ignore
                                                                        currentSelections[index].value
                                                                    }
                                                                    {/* @ts-ignore */}
                                                                    <FontAwesomeIcon icon={(e.correct_ans[0] == currentSelections[index].index) ? faCheckCircle : faTimes} />
                                                                </div>
                                                            )                                
                                                        case "drag":
                                                            return (
                                                                <>
                                                                {
                                                                    //@ts-ignore
                                                                    e.correct_ans.map((e, __index) => { 
                                                                        return ( 
                                                                            //@ts-ignore
                                                                            <div className={`${styles.questionAnswer} ${(e == currentSelections[index][__index].index) ? styles.correctAnswer : styles.wrongAnswer}`}>
                                                                                {
                                                                                    //@ts-ignore
                                                                                    currentSelections[index][__index].value
                                                                                }
                                                                                {/*@ts-ignore*/}
                                                                                <FontAwesomeIcon icon={(e == currentSelections[index][__index].index) ? faCheckCircle : faTimes} />
                                                                            </div>
                                                                        ) 
                                                                    })
                                                                }
                                                                </>
                                                            )
                                                    }
                                                })()
                                            }

                                            {
                                                //@ts-ignore
                                                (e.correct_ans[0] !== currentSelections[index].index && e.type !== 'drag') ? 
                                                    <div>
                                                        <h3 style={{ fontSize: '0.875rem', fontFamily: 'consolas' }}><strong>CORRECT ANSWER:</strong> <i>{e.possible_ans[e.correct_ans[0]].value}</i></h3>
                                                    </div>
                                                    :
                                                    <p></p>
                                            }
                                            {
                                                // (e.type == 'drag') ? 
                                                //     e.correct_ans.map((e, __index) => { 
                                                //         return ( 
                                                //             (e.index == currentSelections[__index].index) ?
                                                //                 <div>
                                                //                     <h3 style={{ fontSize: '0.875rem', fontFamily: 'consolas' }}><strong>CORRECT ANSWER:</strong></h3>
                                                //                 </div>
                                                //                 :
                                                //                 <p></p>
                                                //         ) 
                                                //     })
                                                //     :
                                                //     <></>      
                                            }
                                        </div>
                                    )
                                })  
                            }
                        </div>
                    }
                </div>
                

                <div className={(!takingTest) ? styles.hidden : `${styles.visible} ${styles.testQuestionsToolbar}` }>
                    <Button title={"Prev"} onClick={(e, callback) => { if(!takingTest) {setTakingTest(true);} setCurrentQuestion(currentQuestion-1); callback(); }} disabled={currentQuestion == 0}/>
                    
                    {
                        (value.questions.length == currentQuestion+1) ?
                        <Button title={"Finish"} onClick={(e, callback) => { setCurrentQuestion(currentQuestion+1); callSubmitForm(); callback(); }} />
                        :
                        <Button title={"Next"} onClick={(e, callback) => { setCurrentQuestion(currentQuestion+1); callback(); }} />
                    }
                </div>

                <div className={(takingTest) ? styles.hidden : `${styles.visible} ${styles.testQuestionsToolbar}` }>
                    <div></div>
                    <Button title={"Finish"} onClick={(e, callback) => { callCloseForm(); callback(); }} />
                </div>
            </div>
        </div>
    );
}