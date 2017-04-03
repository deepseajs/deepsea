const userInfoService = require('./../services/user-info');
const userCode = require('./../codes/user');

module.exports = {

  
  /**
   * @param  {} ctx
   */
  async signIn( ctx ) {
    let formData = ctx.request.body;
    let result = {
      success: false,
      message: '',
      data: null
    };

    let userResult = await userInfoService.signIn( formData );

    if ( formData.userName === userResult.name ) {
      result.success = true;
    } else {
      result.message = userCode.FAIL_USER_NAME_OR_PASSWORD_ERROR;
    }

    if ( formData.source === 'form' && result.success === true ) {
      let session = ctx.session;
      session.isLogin = true;
      session.userName = userResult.name;
      session.userId = userResult.id;

      ctx.redirect('/dashboard');
    } else {
      ctx.body = result;
    }
  },

  
  /**
   * @param  {} ctx
   */
  async signUp( ctx ) {
    let formData = ctx.request.body;
    let result = {
      success: false,
      message: '',
      data: null
    };

    let validateResult = userInfoService.validatorSignUp( formData );

    if ( validateResult.success === false ) {
      result = validateResult;
      ctx.body = result;
      return;
    }

    let existOne  = await userInfoService.getExistOne(formData);
    // console.log( existOne );

    if ( existOne  ) {
      if ( existOne.name === formData.userName ) {
        result.message = userCode.FAIL_USER_NAME_IS_EXIST;
        ctx.body = result;
        return;
      }
      if ( existOne .email === formData.email ) {
        result.message = userCode.FAIL_EMAIL_IS_EXIST;
        ctx.body = result;
        return;
      }
    }


    let userResult = await userInfoService.create({
      email: formData.email,
      password: formData.password,
      name: formData.userName,
      createTime: new Date().getTime(),
      level: 1,
    });

    console.log( userResult );

    if ( userResult && userResult.name === formData.userName) {
      result.success = true;
    } else {
      result.message = userCode.ERROR_SYS;
    }

    ctx.body = result;
  },

  async isExist( ctx ) {
    let queryData = ctx.request.body;
    ctx.body = queryData;
  },

  async getLoginUserInfo( ctx ) {
    let session = ctx.session;
    let isLogin = session.isLogin;
    let userName = session.userName;

    // console.log( 'session=', session );

    let result = {
      success: false,
      message: '',
      data: null,
    };
    if ( isLogin === true && userName ) {
      let userInfo = await userInfoService.getUserInfoByUserName( userName );
      if ( userInfo ) {
        result.data = userInfo;
        result.success = true;
      } else {
        result.message = userCode.FAIL_USER_NO_LOGIN;
      }
    } else {

    }

    ctx.body = result;
  },

  validateLogin( ctx ) {
    let result = {
      success: false,
      message: userCode.FAIL_USER_NO_LOGIN,
      data: null,
      code: 'FAIL_USER_NO_LOGIN',
    }; 
    let session = ctx.session;
    if( session && session.isLogin === true  ) {
      result.success = true;
      result.message = '';
      result.code = '';
    }
    return result;
  },


  // TODO
  /**
   * @param  {} ctx
   */
  getUserListByPage( ctx ) {
    
  }


};
