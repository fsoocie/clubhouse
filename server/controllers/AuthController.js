import { Code, User } from "../../models";

class AuthController {
  async sendSMS(req, res) {
    const phone = req.query.phone;
    console.log(phone);
    // const code = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const code = 1234;
    try {
      await Code.create({ code, user_id: req.user.data.id });
      res.status(201).send();
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async activateCode(req, res) {
    const userId = req.user.data.id;
    const smsCode = req.query.code;

    if (!smsCode) {
      return res.status(400).json({ message: "Введите код активации" });
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
          message: "Код не найден",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Ошибка при активации аккаунта",
      });
    }
  }

  githubCallback(req, res) {
    const user = JSON.stringify(req.user);
    res.send(
      `<script>
        window.opener.postMessage(${user}, "*");
        window.close();
      </script>`
    );
  }
}

export default new AuthController();
