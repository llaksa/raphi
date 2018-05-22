'use strict'

const debug          = require('debug')('raphi:db:setup')
const myConfigs      = require('../common/config')(debug)
const inquirer       = require('inquirer')
const chalk          = require('chalk')
const handleError    = require('../common/error')(chalk)
const databaseModule = require('./')
const prompt         = inquirer.createPromptModule()

async function setup () {
  const answer = await prompt([
    {
      type: 'confirm',
      name: 'setup',
      message: 'This will destroy your database, are you sure?'
    }
  ])

  if (!answer.setup) {
    return console.log('Nothing happened :)')
  }

  const { db } = myConfigs

  db.setup = true

  await databaseModule(db).catch(handleError.fatal)

  console.log('Success!')
  process.exit(0)
}

setup()
