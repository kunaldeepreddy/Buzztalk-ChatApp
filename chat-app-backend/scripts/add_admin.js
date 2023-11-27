require('./init_db')
const Inquirer = require('inquirer')
const User = require("../models/userModel");
const AuthUtil = require("../utils/AuthUtil");

const questions = [
    { type: 'input', name: 'name', message: 'Name:' },
    { type: 'input', name: 'email', message: 'Email address:' },
    { type: 'input', name: 'pwd', message: 'Password:' },
]

execute()

async function execute() {
    let data = await Inquirer.prompt(questions)
    if (!data.email || !data.name || !data.pwd) {
        console.log("Required params are missing")
        return
    }
    const user = new User({
        name: data.name,
        email: data.email,
        password: AuthUtil.getHashedPassword(data.pwd),
        isAdmin: true,
        isActive: true
    })
    await user.save()
    console.log("admin account created successfully")
}