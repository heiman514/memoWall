import { Router, Request, Response } from 'express' // need to import when setup a router
import { client } from '../db';
import socketIO from 'socket.io'

export let memoRoutes = (io: socketIO.Server) => {
    let memoRoutes = Router()

    // add memo
    memoRoutes.post('/memo', async (req: Request, res: Response) => {
        try {
            let { content } = req.body
            if (!content) {
                res.status(400)
                res.end('Missing Content!')
                return
            }
            if (typeof content !== 'string') {
                res.status(400)
                res.end('Invalid content!')
                return
            }

            await client.query(`insert into memo (content) values ('${content}')`)
            res.status(202)
            res.end('Add memo successfully!')
            io.emit('new-memo', {content})
        } catch (err) {
            res.status(500)
            res.end(String(err))
        }
    })

    // get all memos
    memoRoutes.get('/memos', async (req: Request, res: Response) => {
        try {
            let memos = await client.query(`select * from memo;`)

            if (!memos) {
                res.status(404)
                res.end('Memo not found!')
            }

            res.status(202)
            res.json(memos.rows);
        } catch (err) {
            res.status(500)
            res.end(String(err))
        }
    })

    memoRoutes.put('/memo', async (req: Request, res: Response) => {
        try {
            console.log(req.body);
            let { id, content } = req.body

            if (!id) {
                res.status(400)
                res.end('Missing memo id!')
                return
            }

            if (!content) {
                res.status(400)
                res.end('Missing content!')
                return
            }

            await client.query(`update memo set content = '${content}' where id = ${id};`)
            res.status(202)
            res.end('Update memo successfully!')
            io.emit('update-memo')
        } catch(err) {
            res.status(500)
            res.end(String(err))
        }
    })

    memoRoutes.delete('/memo', async (req: Request, res: Response) => {
        try {
            let { id } = req.body

            if (!id) {
                res.status(400)
                res.end('Missing memo id!')
                return
            }

            await client.query(`delete from memo where id = ${id};`)

            res.status(202)
            res.end('Memo delete successfully!')
            io.emit('update-memo')
        } catch (err) {
            res.status(500)
            res.end(String(err))
        }
    })

    return memoRoutes
}







