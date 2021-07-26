import express from 'express';
import { uploader } from './core/uploader'
import AuthController from './controllers/AuthController'
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config({
    path: './server/.env'
})
import passport from './core/passport'
import './core/db'

const app = express()

app.use(cors())
app.use(passport.initialize())

app.post('/upload', uploader.single('avatar'), (req: express.Request, res: express.Response) => {
  const url = `avatars/${req.file.filename}`
  res.json({ url })
})

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), AuthController.githubCallback);
app.get('/auth/me', passport.authenticate('jwt', { session: false }), passport.authenticate('github'));
app.get('/auth/sms', passport.authenticate('jwt', { session: false }), AuthController.sendSMS)
app.get('/auth/activate', passport.authenticate('jwt', { session: false }), AuthController.activateCode)

app.listen(3001, () => {
    console.log('Server is working...')
})