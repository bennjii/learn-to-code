import React, { useEffect, useState } from 'react'
import styles from '@styles/Home.module.css'
import Button from './button';

import { MultiChoice } from '@components/multi_choice'
import { securityRules } from 'firebase-admin';
import { callbackify } from 'util';

interface Answer {
    value: string,
    index: number
}

interface Questions {
    type: "fill" | "multichoice" | "select", // Denotes Render Method
    correct_ans: string | number | number[], // Fill uses string, multichoice is number and select is numerical array.
    question: string,
    hint?: string, // for Fill only
    possible_ans?: Answer[] // for multichoice and select only 
}

interface Test {
    questions: Questions[],
    dificulty: 0 | 1 | 2,
    title: string
}

export const Test: React.FC<{ value: Test, submitForm: Function }> = ({ value, submitForm }) => {
    const [ currentSelections, setCurrentSelections ] = useState(value.questions.map(() => { return {value: "", index: -1} }));
    const [ currentQuestion, setCurrentQuestion ] = useState(0);

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
                
                <h1>{value.title}</h1>
                <p>{value.questions[currentQuestion].question}</p>

                <div>
                    {
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
                    }
                </div>
                

                <div>
                    <Button title={"Prev"} onClick={(e, callback) => { setCurrentQuestion(currentQuestion-1); callback(); }} disabled={currentQuestion == 0}/>
                    
                    {
                        (value.questions.length == currentQuestion+1) ?
                        <Button title={"Finish"} onClick={(e, callback) => { submitForm(currentSelections); callback(); }} />
                        :
                        <Button title={"Next"} onClick={(e, callback) => { setCurrentQuestion(currentQuestion+1); callback(); }} />
                    }
                </div>
            </div>
        </div>
    );
}