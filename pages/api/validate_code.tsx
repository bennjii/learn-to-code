import 'firebase-admin'

import { NextApiRequest, NextApiResponse } from 'next'
import { firebaseAdmin } from '@root/firebaseAdmin';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if(!req.body.location) return res.status(404).send({ valid: false, code: req.body });

  	const data = req.body;
	const pageData = data.location.pageData;
	const lesson = data.location.lesson;
	const id = data.location.pageData.inherit_id;

	console.log(data);

	const answerData = await ( await 
		firebaseAdmin.firestore()
    	.doc(`courses/${id}/answers/${lesson+1}`)
    	.get()).data();
	
	console.log(`\x1b[36mReq. to courses/${id}/answers/${lesson+1}: ${answerData}`);	
	const sectionData = await answerData.answers[data.location.subLesson];
  
  	const valid = (sectionData.trim() == data.computed.data.stdout.trim());
  	return res.status(200).send({ valid, code: data.computed, expected_response: sectionData });
}