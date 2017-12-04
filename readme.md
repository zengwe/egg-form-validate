# egg form 表单验证
共三个文件 </br>
### 1.validate.config.js 主要是配置 formateError: 是定制错误时返回的结构， default设置对应的错误代码
```JavaScript
module.exports = {
    formateError: null,
    defaultMsg: {
        required: 'missing filed',
        isReg: 'not match',
        notReg: 'match',
        isEmail: 'not email',
        isUrl: 'not url',
        isIP: 'not IP',
        isAlpha: 'not all letter',
        isAlphanumeric: ' not letter or number',
        isNumeric: 'not a number',
        isInt: 'not int number',
        isFloat: 'not float number',
        isLowercase: 'letters are not small letter',
        isUppercase: 'letters are not big letter',
        notNull: 'not allow null',
        isNull: 'must be null',
        notEmpty: 'string not allow empty',
        contains: 'not contain require letters',
        notIn: 'is in required array',
        isIn: 'not in required array',
        len: 'the length is out of bounds',
        max: 'the number bigger than max value',
        min: 'the number samller than min value',        
    }   
}
```
### 2.validate.js 验证的对象，所有的验证方法都在里面，可以自行扩充
### 3.测试文件 validate.test.js
示例
```JavaScript
const validate = require('./validate.js');
const assert = require('assert');
require('should');
function getInstance(){
    return new validate({
            // formateError:function(err){
            //     return err;
            // }
    });
}
function check(rule,key,ruleName,data,ResultBoolean){
    if(ResultBoolean===true){
        let instance = getInstance();
        let result = instance.validate(rule,data);
        assert.equal(result, true);
        assert.equal(instance.errors.length,0);        
    }else{
        let instanceFalse = getInstance();
        let resultFalse = instanceFalse.validate(rule,data);
        assert.equal(resultFalse, false);
        assert.equal(instanceFalse.errors.length,1);
        instanceFalse.errors[0].should.have.property('msg',rule[key][ruleName].msg);
        instanceFalse.errors[0].should.have.property('filed').equal(key);        
    }

    // validate false

    // instance.should.have.propertyByPath('errors',0,'filed').equal('name');    
}
it('required',function(){
    let rule =  { name: { required:{args:true,msg:'required'}} };
    let myCheck= check.bind(null,rule,'name','required');
    myCheck({name:'ac'},true);
    myCheck({names:'ac2'},false);  
});
```
运行测试
自行安装相应的包
```bash
# mocha validate.test.js
```
### 在egg中的使用方法
在app/middelware下创建 form-validate.js
```javascript
module.exports = app => {
    return async function formValidate(rule,ctx,next) {     
        const validate = new ctx.app.validate();
        const requireFiled = Object.getOwnPropertyNames(rule);
        let form = {};
        if(ctx.method=='POST'){
            let queryFiled = Object.getOwnPropertyNames(ctx.request.body);
            for(let queryKey of queryFiled){
                if(requireFiled.indexOf(queryKey)==-1){
                    delete ctx.request.body[queryKey];
                }
            }
            form = ctx.request.body;
        }else{
            let queryFiled = Object.getOwnPropertyNames(ctx.request.query);
            for(let queryKey of queryFiled){
                if(requireFiled.indexOf(queryKey)==-1){
                    delete ctx.request.query[queryKey];
                }
            }            
            form = ctx.request.query;
        }
        if(validate.validate(rule,form) === false){
            return ctx.setReturn(app.code.formError,validate.errors);
        }
        await next();
    }
}
```
validate.validate(rule,form)遮就是验证表单，前面只是区分get和post，和去除掉多余的表单项
rule这个变量就是从路由中传过来的
### 路由的写法
```JavaScript
module.exports = app => {
  const { router } = app;
  let formValidate = app.middlewares.formValidate(app);
  let { testFormRule,loginForm } = require('./form/form-rule')(app);
  router.get('/', formValidate.bind(null,testFormRule), 'home.index');
  
  router.post('/api/login',formValidate.bind(null,loginForm),'login.login');
};
```
loginForm
```javascript
module.exports = app => {
    const loginForm = {
        username: {
            required: {
                args: true,
                msg: app.code.usernameNotNull
            },
            notEmpty: {
                args: true,
                msg: app.code.usernameNotNull
            }
        },
        password: {
            required: {
                args: true,
                msg: app.code.passwordNotAllowNull
            },
            notEmpty: {
                args: true,
                msg: app.code.passwordNotAllowNull
            }
        }
    };
    return loginForm;
}
```
当错误是返回的错误结构是[{filed:'username',msg:501}]
[具体代码位置](http://github.com/zengwe)
