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
it('isReg',function(){
    let rule =  { name: { isReg:{args:/^[a-c]+$/,msg:'isreg'}} };
    let myCheck= check.bind(null,rule,'name','isReg');
    myCheck({name:'ac'},true);
    myCheck({name:'ac2'},false);  
});
it('notReg',function(){
    let rule =  { name: { notReg:{args:/^[a-c]+$/,msg:'isreg'}} };
    let myCheck= check.bind(null,rule,'name','notReg');
    myCheck({name:'ac2'},true);
    myCheck({name:'ac'},false); 
});
it('isEmail',function(){
    let rule = { name:{isEmail:{args:true,msg:'email'}}};
    let myCheck= check.bind(null,rule,'name','isEmail');
    myCheck({name:'12323@qq.com'},true);
    myCheck({name:'1233.com'},false); 
    myCheck({},true);
});
it('isUrl',function(){
    let rule = { name:{isUrl:{args:true,msg:'this is url'}}};
    let myCheck= check.bind(null,rule,'name','isUrl');
    myCheck({ name:'http://www.baidu.com'},true);
    myCheck({ name: 'dfadsfas.dfasd.fads'},false); 
});
it('isIP',function(){
    let rule = { name:{isIP:{args:true,msg:'this is IP'}}};
    let myCheck= check.bind(null,rule,'name','isIP');
    myCheck({ name: '192.168.1.1'},true);
    myCheck({ name:'31.543.32.42'},false); 
});
it('isAlpha',function(){
    let rule = { name: { isAlpha:{args:true,msg:'this is a isAlpha'}}};
    let myCheck= check.bind(null,rule,'name','isAlpha');
    myCheck({ name: 'sssdfadfadfQ'},true);
    myCheck({ name: 'fadsfa324'},false); 
});
it('isAlphanumeric',function(){
    let rule = { name: { isAlphanumeric: { args: true,msg:'this is a is Alphanumeric'}}};
    let myCheck= check.bind(null,rule,'name','isAlphanumeric');
    myCheck({name:'fadfDda12'},true);
    myCheck({name: 'dfads3421dsaf@'},false); 
});
it('isNumeric',function(){
    let rule = { name: { isNumeric:{ args: true,msg:'this is a numeric'}}};
    let myCheck= check.bind(null,rule,'name','isNumeric');
    myCheck({ name : 123},true);
    myCheck({ name: '123' },false); 
});
it('isInt',function(){
    let rule = { name: { isInt:{args: true,msg: 'isInt'}}};
    let myCheck= check.bind(null,rule,'name','isInt');
    let data = { name: 123};
    let data2 = { name: 123.1 };
    myCheck({ name: 123},true);
    myCheck({ name: 123.1 },false); 
});
it('isFloat',function(){
    let rule = { name: { isFloat:{args: true,msg: 'isFloat'}}};
    let myCheck= check.bind(null,rule,'name','isFloat');
    let data = { name: 123.1};
    let data2 = { name: 123 };
    myCheck({ name: 123.1},true);
    myCheck({ name: 123 },false); 
});
it('isLowercase',function(){
    let rule = { name: { isLowercase: { args: true, msg: 'islowercase'}}};
    let myCheck= check.bind(null,rule,'name','isLowercase');
    myCheck({ name: 'dddddfadsa'},true);
    myCheck({ name: 'Das'},false); 
});
it('isUppercase',function(){
    let rule = { name: { isUppercase: { args: true, msg: 'isUppercase true'}}};
    let myCheck= check.bind(null,rule,'name','isUppercase');
    myCheck({ name: 'DKKFF'},true);
    myCheck({ name:'sss23'},false); 
});
it('notNull',function(){
    let rule = { name: {notNull: { args: true,msg: 'need not null'}}};
    let myCheck= check.bind(null,rule,'name','notNull');
    myCheck({ name: 'fadsfa'},true);
    myCheck({ name: null},false); 
});
it('isNull',function() {
    let rule = { name: { isNull: {args: true, msg: 'isNull functions'}}};
    let myCheck= check.bind(null,rule,'name','isNull');
    myCheck({ name: null},true);
    myCheck({ name:'fadsf'},false); 
});
it('notEmpty',function(){
    let rule = { name: { notEmpty: {args: true,msg: 'not empty'}}};
    let myCheck= check.bind(null,rule,'name','notEmpty');
    myCheck({ name: 'ss'},true);
    myCheck({ name: ''},false); 
});
it('contains',function(){
    let rule = { name: {contains: {args: 'zengwe',msg:'is contains'}}};
    let myCheck= check.bind(null,rule,'name','contains');
    myCheck({ name: 'fadszengwedfadsf'},true);
    myCheck({ name: 'dafdsafsd'},false); 
});
it('notIn',function(){
    let rule = { name: {notIn: { args: 'zengwe',msg: 'is not in'}}};
    let myCheck= check.bind(null,rule,'name','notIn');
    myCheck({ name: ['fdsaf','zeng','we']},true);
    myCheck({ name: ['sss','zengwe'] },false); 
});
it('isIn',function(){
    let rule = { name: { isIn: {args: 'zengwe',msg: 'is in the array'}}};
    let myCheck= check.bind(null,rule,'name','isIn');
    myCheck({ name: ['sss','zengwe'] },true);
    myCheck({ name: ['fdsaf','zeng','we']},false); 
});
it('len',function(){
    let rule = { name: { len:{ args:[2,6],msg:'not in bounds'}}};
    let myCheck= check.bind(null,rule,'name','len');
    myCheck({ name: 'dfads'},true);
    myCheck({ name: 'd'},false); 
});
it('max',function(){
    let rule = { name: { max: { args:100,msg: 'bigger than value'}}};
    let myCheck= check.bind(null,rule,'name','max');
    myCheck({ name: 50},true);
    myCheck({ name: 101},false); 
});
it('min',function(){
    let rule = { name: {min: { args: 4,msg: 'is min'}}};
    let myCheck= check.bind(null,rule,'name','min');
    let data = { name: 5};
    let data2 ={ name: 2};
    myCheck({ name: 5},true);
    myCheck({ name: 2},false); 
});