import React, { useEffect, useState } from 'react'
import styles from '@styles/Home.module.css'
import Button from './button';

interface Answer {
    value: string,
    index: number
}

interface Question {
    type: "errorfind" | "multichoice" | "drag", // Denotes Render Method
    correct_ans: string | number | number[], // Fill uses string, multichoice is number and select is numerical array.
    question: string,
    hint?: string, // for Fill only
    possible_ans?: Answer[] // for multichoice and select only 
}

interface Test {
    questions: Question[],
    dificulty: 0 | 1 | 2,
    title: string
}

export const MultiChoice: React.FC<{ question: Question, onChange: Function, selection: Answer }> = ({ question, onChange, selection }) => {
    const [ currentSelection, setCurrentSelection ] = useState(null);
    const [ currentQuestion, setCurrentQuestion ] = useState(0);

    useEffect(() => {
        setCurrentSelection(selection);
    }, [selection])

    return (
        <div className={styles.multiChoiceRoom}>
            {
                question.possible_ans.map((e: Answer, _index) => {
                    return (
                        <div key={_index} className={`${styles.radialInput} ${(currentSelection?.index == e.index) ? styles.radialSelected : styles.radialDefault}`} onClick={(_e) => {
                            onChange(e);
                            setCurrentSelection(e);
                        }}>
                            <input type="radio" className={styles.createInputRadial}/>
            
                            <label>{e.index + 1})  {e.value}</label>
                        </div>
                    )
                })
            }
        </div>
        
    );
}