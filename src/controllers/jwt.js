const secret = 'feserver';
const pagemaker = require('../common/pagemaker.js');
const responese = require('../common/responese');

const Jwt = require('jsonwebtoken');

// jwt controller
class JwtController {
  // generate jwt
  static async generate(ctx) {
    let token = Jwt.sign({ name: 'shensiqi' }, secret);
    await responese(ctx, {
        code: 200,
        message: 'success',
        data: {
          token: token
        }
      });
      return;
  }

  // verify jwt
  static async verify(ctx) {
    const { token } = ctx.request.query;
    // invalid token - synchronous
    try {
      var decoded = Jwt.verify(token, secret);
      if (decoded.name == 'shensiqi') {
        await responese(ctx, {
          code: 200,
          message: 'success',
          data: {}
        });
        return;
      } else {
        await responese(ctx, {
          code: 403,
          message: 'failed',
          data: {}
        });
        return;
      }
    } catch(err) {
      // err
      await responese(ctx, {
          code: 400,
          message: err,
          data: {}
      });
      return;
    }
  }
}

module.exports = JwtController;
