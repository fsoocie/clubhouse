import express from 'express';
import { uploader } from './core/uploader'
import { Code, User } from '../models'
import cors from 'cors'
import fs from 'fs'
import dotenv from 'dotenv';
dotenv.config({
    path: './server/.env'
})
import passport from './core/passport'
import './core/db'

const app = express()

app.use(cors())
app.use(passport.initialize())

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback',
passport.authenticate('github', { failureRedirect: '/login' }),
function(req, res) {
  const user = JSON.stringify(req.user)
  res.send(
    `<script>
      window.opener.postMessage(${user}, "*");
      window.close();
    </script>`
  );
});

app.get('/auth/me',
  passport.authenticate('jwt', { session: false }),
  passport.authenticate('github')
);


app.post('/upload', uploader.single('avatar'), (req: express.Request, res: express.Response) => {
  const url = `avatars/${req.file.filename}`
  res.json({ url })
})

app.get('/auth/sms',
  passport.authenticate('jwt', { session: false }),
  async (req: express.Request, res: express.Response) => {
    const phone = req.query.phone
    console.log(phone)
    const code =  Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
    await Code.create({code, user_id: req.user.data.id})
    res.status(201).send()
  }
)

app.get('/auth/activate',
  passport.authenticate('jwt', { session: false }),
  async (req: express.Request, res: express.Response) => {
    const userId = req.user.data.id;
    const smsCode = req.query.code;

    if (!smsCode) {
      return res.status(400).json({ message: 'Введите код активации' });
    }

    const whereQuery = { code: smsCode, user_id: userId.toString() };
    console.log(whereQuery);

    try {
      const findCode = await Code.findOne({
        where: whereQuery,
      });

      if (findCode) {
        await Code.destroy({
          where: whereQuery,
        });
        await User.update({ isActive: 1 }, { where: { id: userId } });
        return res.send();
      } else {
        res.status(400).json({
          message: 'Код не найден',
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'Ошибка при активации аккаунта',
      });
    }

  }
)

app.listen(3001, () => {
    console.log('Server is working...')
})