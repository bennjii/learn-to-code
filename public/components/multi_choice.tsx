import React, { useEffect, useState } from 'react'
import styles from '@styles/Home.module.css'
import Button from './button';

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

export const MultiChoice: React.FC<{ value: Test, onChange: Function, submitForm: Function }> = ({ value, onChange, submitForm }) => {
    const [ currentSelection, setCurrentSelection ] = useState(null);
    const [ currentQuestion, setCurrentQuestion ] = useState(0);

    return (
        <div className={styles.multiChoiceRoom}>
            <div className={styles.multiChoiceQuestion}>
                <h1>{value.title}</h1>

                <p>{value.questions[currentQuestion].question}</p>

                {
                    value.questions[currentQuestion].possible_ans.map((e: Answer) => {
                        return (
                            <div className={`${styles.radialInput} ${(currentSelection == e.index) ? styles.radialSelected : styles.radialDefault}`} onClick={(_e) => {
                                onChange(e);
                                setCurrentSelection(e.index);
                            }}>
                                <input type="radio" className={styles.createInputRadial}/>
                
                                <label>{e.value}</label>
                            </div>
                        )
                    })
                }
                
                <div>
                    <Button title={"Prev"} onClick={() => setCurrentQuestion(currentQuestion-1)}/>
                    <Button title={"Next"} onClick={() => setCurrentQuestion(currentQuestion+1)}/>
                </div>
            </div>
        </div>
        
    );
}