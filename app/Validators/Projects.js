'use strict'

class Projects {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      title: "required",
      description: "required"
    }
  }
}

module.exports = Projects
