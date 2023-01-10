//login definition
const db = require('./db')
// import jsonwebtoken
const jwt = require('jsonwebtoken')

const login = (acno, password) => {
    //1. search acno ,password in mongodb - findOne()
    return db.User.findOne({
        acno,
        password
    }).then((result) => {
        console.log(result);
        if (result) {
            // generate token
            const token = jwt.sign({
                currentAcno: acno
            }, "secretekey12345")

            return {
                message: 'Loggin successfull',
                status: true,
                statusCode: 200,
                username: result.username,
                token,
                currentAcno: acno

            }
        }
        else {
            return {
                message: 'Invalid Account number / Password',
                status: false,
                statusCode: 404

            }
        }
    })

}
// register
const register = (acno, pswd, uname) => {
    // 1.search  acno in db if yes

    return db.User.findOne({
        acno
    }).then((result) => {

        // 2.if yes response :alredy exist
        if (result) {
            return {
                message: 'Alredy existing user',
                status: false,
                statusCode: 404
            }
        }

        // 3.new user:store all data into db
        else {
            let newUser = new db.User({
                acno,
                username: uname,
                password: pswd,
                balance: 0,
                transaction: []
            })

            newUser.save()
            return {
                message: 'Register successfull',
                status: true,
                statusCode: 200
            }
        }
    })
}
// deposit

const deposit = (req, acno, password, amt) => {

    var amount = Number(amt)
    //1. search acno ,password in mongodb - findOne()
    return db.User.findOne({
        acno,
        password
    }).then((result) => {
        if (acno != req.currentAcno) {
            return {
                message: 'Permission denied',
                status: false,
                statusCode: 404

            }
        }
        console.log(result);
        if (result) {
            result.balance += amount
            result.transaction.push({
                amt,
                type: 'CREDIT'
            })
            result.save()
            return {
                message: `${amt} deposited sucessfully and new balance is ${result.balance}`,
                status: true,
                statusCode: 200

            }
        }
        else {
            return {
                message: 'Invalid Account number / Password',
                status: false,
                statusCode: 404

            }
        }
    })

}

// withdraw

const withdraw = (req, acno, password, amt) => {
    var amount = Number(amt)
    //1. search acno ,password in mongodb - findOne()
    return db.User.findOne({
        acno,
        password
    }).then((result) => {
        if (acno != req.currentAcno) {
            return {
                message: 'Permission denied',
                status: false,
                statusCode: 404

            }
        }
        console.log(result);
        if (result) {
            // check sufficient balance
            if (result.balance > amount) {
                result.balance -= amount
                result.transaction.push({
                    amt,
                    type: 'DEBIT'
                })


                result.save()
                return {
                    message: `${amt} debited sucessfully and new balance is ${result.balance}`,
                    status: true,
                    statusCode: 200

                }
            }
            else {
                return {
                    message: 'Insufficient balance',
                    status: false,
                    statusCode: 404

                }
            }
        }
        else {
            return {
                message: 'Invalid Account number / Password',
                status: false,
                statusCode: 404

            }
        }
    })

}
// transaction
const transaction = (acno) => {
    return db.User.findOne({
        acno
    }).then(result => {
        if (result) {
            return {
                status: true,
                statusCode: 200,
                transaction: result.transaction

            }
        }
        else {
            return {
                message: 'Invalid Account number',
                status: false,
                statusCode: 404

            }
        }
    })
}

// to delete an acno from db
const deleteAcno = (acno) => {
    return db.User.deleteOne({
        acno
    })
    .then(result => {
            if (result) {
                return {
                    status: true,
                    statusCode: 200,
                    message: `Account ${acno} Deleted Successfully.....`
                }
            }
            else {
                return {
                    message: 'Invalid Account number',
                    status: false,
                    statusCode: 404

                }
            }
        })
}

module.exports = {
    login,
    register,
    deposit,
    withdraw,
    transaction,
 deleteAcno
}