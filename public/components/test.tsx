import React, { useEffect, useState } from 'react'
import styles from '@styles/Home.module.css'
import Button from './button';

import { MultiChoice } from '@components/multi_choice'
import { securityRules } from 'firebase-admin';
import { callbackify } from 'util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCheckCircle, faCross, faTimes } from '@fortawesome/free-solid-svg-icons';

interface Answer {
    value: string,
    index: number
}

interface Question {
    type: "fill" | "multichoice" | "select", // Denotes Render Method
    correct_ans: string | number | number[], // Fill uses string, multichoice is number and select is numerical array.
    question: string,
    hint?: string, // for Fill only
    possible_ans?: Answer[] // for all *but* fill 
    answer?: string // for Fill only
}

interface Test {
    questions: Question[],
    dificulty: 0 | 1 | 2,
    title: string
}

export const Test: React.FC<{ value: Test, submitForm: Function }> = ({ value, submitForm }) => {
    const [ currentSelections, setCurrentSelections ] = useState(value.questions.map(() => { return {value: "", index: -1} }));
    const [ currentQuestion, setCurrentQuestion ] = useState(0);
    const [ takingTest, setTakingTest ] = useState(true);

    const callSubmitForm = () => {
        submitForm(currentSelections);

        setTakingTest(false);
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

                <div>
                    {
                        (takingTest) ?
                        (() => {
                            switch (value.questions[currentQuestion].type) {
                                case "fill":
                                    return (
                                        <></>
                                    )
                                case "multichoice":
                                    return (
                                        <MultiChoice question={value.questions[currentQuestion]} selection={currentSelections[currentQuestion]}
                                        onChange={(e) => {
                                            let clone = currentSelections; 
                                            clone[currentQuestion] = e;
                                            
                                            setCurrentSelections(clone)
                                        }}/>
                                    )                                
                                case "select":
                                    return (
                                        <MultiChoice question={value.questions[currentQuestion]} selection={currentSelections[currentQuestion]}
                                        onChange={(e) => {
                                            console.log(e);
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
                                                    console.log(e.correct_ans);

                                                    switch (e.type) {
                                                        case "fill":
                                                            return (
                                                                <>{e.answer}</>
                                                            )
                                                        case "multichoice":
                                                            return (
                                                                <div className={`${styles.questionAnswer} ${(e.correct_ans[0] == currentSelections[index].index) ? styles.correctAnswer : styles.wrongAnswer}`}>
                                                                    {
                                                                        currentSelections[index].value
                                                                    }

                                                                    <FontAwesomeIcon icon={(e.correct_ans[0] == currentSelections[index].index) ? faCheckCircle : faTimes} />
                                                                </div>
                                                            )                                
                                                        case "select":
                                                            return (
                                                                //@ts-ignore
                                                                <>{e.correct_ans.map(e => { return ( <div>{e}</div> ) })}</>
                                                            )
                                                    }
                                                })()
                                            }

                                            {
                                            (e.correct_ans[0] !== currentSelections[index].index) ? 
                                                <div>
                                                    <h3 style={{ fontSize: '0.875rem', fontFamily: 'consolas' }}><strong>CORRECT ANSWER:</strong> <i>{e.possible_ans[e.correct_ans[0]].value}</i></h3>
                                                </div>
                                                :
                                                <p></p>
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
                    <Button title={"Finish"} onClick={(e, callback) => { callSubmitForm(); callback(); }} />
                </div>
            </div>
        </div>
    );
}