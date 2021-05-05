import 'firebase-admin'

import { NextApiRequest, NextApiResponse } from 'next'
import { firebaseAdmin } from '@root/firebaseAdmin';
import axios from 'axios';

const parse = (input) => {
	input.replace('\\n', 'what');

	return input.replace('\n','\\n').trim();
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if(!req.body.location) return res.status(404).send({ valid: false, code: req.body });

  	const data = req.body;
	const lesson = data.location.lesson;
	const id = data.location.pageData.inherit_id;

	const privateCode = JSON.parse(req.body.computed.config.data).source + "\n" + data.location.pageData.lessons[data.location.lesson].sub_lessons[data.location.subLesson].appended_code;

	const response = await axios.post( 
		"https://emkc.org/api/v1/piston/execute",
		{
			"language": data.location.pageData.language,
			"source": privateCode,
			"args": []
		},
		{ headers: {'Content-Type': 'application/json'} }
	);

	const answerData = await (
		await firebaseAdmin.firestore()
    	.doc(`courses/${id}/answers/${lesson+1}`)
    	.get()
	).data();
	
	console.log(`\x1b[36mReq. to courses/${id}/answers/${lesson+1}: ${answerData}`);
		
	let expectedResult = parse(answerData.answers[data.location.subLesson]);
	let givenResult = parse(response.data.output);

	givenResult = parse(givenResult);
	expectedResult = parse(expectedResult);

  	const valid = givenResult.includes(expectedResult);

	console.log("Expected:");
	console.log(expectedResult);
	console.log("Got:");
	console.log(givenResult);

	console.log(valid);

  	return res.status(200).send({ valid, code: data.computed, givenResult, expected_response: expectedResult });
}