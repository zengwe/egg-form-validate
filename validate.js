const config = require('./validate.config');
const DATE_TYPE_RE = /^\d{4}\-\d{2}\-\d{2}$/;
const DATETIME_TYPE_RE = /^\d{4}\-\d{2}\-\d{2} \d{2}:\d{2}:\d{2}$/;
const ID_RE = /^\d+$/;
const EMAIL_RE = /^[a-z0-9\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+(?:\.[a-z0-9\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+)*@(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?$/;
const PASSWORD_RE = /^[\w\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\{\}\|\;\:\'\"\,\<\.\>\/\?]+$/;
const URL_RE = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i;
const IP_RE = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
class validate {
    constructor(options) {
        this.options = Object.assign(config, options);
    }
    validate(rules, form) {
        this.rules = new Object();
        this.errors = new Array();        
        this.formatRules(rules);
        this.data = form;
        this.check();
        return this.errors.length > 0 ? false : true;
    }
    formatRules(rules) {
        for (const name in rules) {
            for (const rule in rules[name]) {
                if (rules[name][rule].args == undefined) {
                    const temp = rules[name][rule];
                    rules[name][rule] = { args: rules[name][rule], msg: this.options.defaultMsg[rule] }
                }
                if (!rules[name].hasOwnProperty('required')) {
                    rules[name]['required'] = { args: false, msg: '' };
                }
            }
        }
        this.rules = rules;
    }
    check() {
        for (const key in this.rules) {
            for (let rule in this.rules[key]) {
                try {
                    if (this[rule](key, this.rules[key][rule]) === false) {                        
                        if( rule === 'required'){
                            this.createErrors(key, this.rules[key][rule]);
                        }
                        if( rule !== 'required' && this.data[key]!==undefined){
                            this.createErrors(key, this.rules[key][rule]);
                        }
                    }
                } catch (error) {
                    throw error;
                }
            }
        }
    }
    required(key, param) {
        if (param.args == true) {
            if (!this.data.hasOwnProperty(key)) {
                return false;
            }
        }
    }
    isReg(key, param) {
        if (!param.args.test(this.data[key])) {
            return false;
        }
    }
    notReg(key, param) {
        if (param.args.test(this.data[key])) {
            return false;
        }
    }
    isEmail(key, param) {
        if (!EMAIL_RE.test(this.data[key])) {
            return false;
        }
    }
    isUrl(key, param) {
        if (!URL_RE.test(this.data[key])) {
            return false;
        }
    }
    isIP(key, param) {
        if (!IP_RE.test(this.data[key])) {
            return false;
        }
    }
    isAlpha(key, param) { //全是字母
        if (!/^[A-Za-z]+$/.test(this.data[key])) {
            return false;
        }
    }
    isAlphanumeric(key, param) { //字母和数字
        if (!/^[A-Za-z0-9]+$/.test(this.data[key])) {
            return false;
        }
    }
    isNumeric(key, param) {
        if (Object.prototype.toString.call(this.data[key]) !== '[object Number]') {
            return false;
        }
    }
    isInt(key, param) {
        if (this.isNumeric(key, param) == false || this.data[key] % 1 !== 0) {
            return false;
        }
    }
    isFloat(key, param) {
        if (this.isNumeric(key, param) == false || this.data[key] % 1 === 0) {
            return false;
        }
    }
    isLowercase(key, param) {
        if (!/^[a-z]+$/.test(this.data[key])) {
            return false;
        }
    }
    isUppercase(key, param) {
        if (!/^[A-Z]+$/.test(this.data[key])) {
            return false;
        }
    }
    notNull(key, param) {
        if (this.data[key] === null) {
            return false;
        }
    }
    isNull(key, param) {
        if (this.data[key] !== null) {
            return false;
        }
    }
    notEmpty(key, param) {
        if (this.data[key] === '') {
            return false;
        }
    }
    contains(key, param) {
        if (this.data[key].indexOf(param.args) === -1) {
            return false;
        }
    }
    notIn(key, param) {
        if(this.data[key].indexOf(param.args)!== -1){
            return false;
        }
    }
    isIn(key, param) {
        if(this.data[key].indexOf(param.args)===-1){
            return false;
        }
    }
    len(key, param) {
        if (param.args[0] > -1 && this.data[key].length < param.args[0]) {
            return false;
        }
        if (param.args[1] != undefined && param.args[1] > -1 && this.data[key].length > param.args[1]) {
            return false;
        }
    }
    max(key, param) {
        if(this.data[key]>param.args){
            return false;
        }
    }
    min(key, param) {
        if(this.data[key]<param.args){
            return false;
        }
    }
    // param{ args:function} 返回
    func(key, param) {
        let tempfunc = param.args.bind(null, this.data);
        if (!tempfunc()) {
            this.createErrors(key, param);
        }
    }
    createErrors(key, param) {
        if (this.options.formateError == null) {
            this.errors.push({ filed: key, msg: param.msg });
        } else {
            this.errors.push(this.options.formateError.bind(null, key, param)());
        }
    }
}
module.exports = validate;