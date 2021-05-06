import React, { useEffect, useState } from 'react'
import styles from '@styles/Home.module.css'
import Button from './button';
import { forceLoad } from '@sentry/browser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight, faRedo } from '@fortawesome/free-solid-svg-icons';

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

export const DragAndDrop: React.FC<{ question: Question, onChange: Function, selection: Answer[]}> = ({ question, onChange, selection }) => {
    const [ currentSelection, setCurrentSelection ] = useState(null);
    const [ currentQuestion, setCurrentQuestion ] = useState(0);

    const [ draggedOrder, setDraggedOrder ] = useState(selection);
    const [ beingDragged, setBeingDragged ] = useState(-1);

    useEffect(() => {
        setCurrentSelection(selection);
        setDraggedOrder(selection);
    }, [selection])

    useEffect(() => {
        setCurrentSelection(draggedOrder);
        onChange();
    }, [draggedOrder])

    return (
        <div className={styles.multiChoiceRoom}>
            <div className={`${styles.dragInput}`} onClick={(e) => {
                e.preventDefault();

                setDraggedOrder([]);
                setBeingDragged(-1);
            }}>
                <Button title={"Reset"} onClick={(e,c) => c() }/>
                <FontAwesomeIcon icon={faRedo}/>
            </div>
                
            <div className={styles.dragRecipient} onDragOver={(e) => e.preventDefault()} onDrop={(e) => {
                const clone = draggedOrder;
                clone.push(question.possible_ans[beingDragged]);

                setDraggedOrder(clone);
                setBeingDragged(-1);
            }}>
                <div className={styles.invisibleDelimiter}></div>

                {
                    question.possible_ans.map((element: Answer, _index) => {
                        if(draggedOrder.includes(element)) {
                            return (
                                <div className={`${styles.dragInput}`} key={_index}>
                                    <label>{element.value}</label>
                                </div>
                            )
                        }else {
                            return (
                                <></>
                            )
                        }
                    })
                }
            </div>

            <div className={styles.dragAnswers}>
            {
                question.possible_ans.map((element: Answer) => {
                    if(!draggedOrder.includes(element)) {
                        return (
                            <div className={`${styles.dragInput}`} draggable={true} onDrag={(e) => {
                                setBeingDragged(element.index);
                            }}>
                                <label>{element.value}</label>
                            </div>
                        )
                    }else {
                        return (
                            <></>
                        )
                    }
                })
            }
            </div>
            
        </div>
        
    );
}