import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  console.log(req.headers);
  res.status(200).json({ name: 'John Doe' })
}