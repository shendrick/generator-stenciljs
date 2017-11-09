const {
  Loggable
} = require('../../../logger')

function byConvention(ctx, convention) {
  return new NameConvention(ctx, convention).decideNames()
}

class NameConvention extends Loggable {
  constructor(ctx, convention, opts) {
    super(opts)
    this.ctx = ctx
    this.props = ctx.props
    this.model = ctx.model
    this.convention = convention || 'name'
    this
      .setModel(ctx.model)
  }

  setModel(model) {
    this.model = this.validatedModel(model)
    return this
  }

  // TODO: move to model?
  validatedModel(model) {
    if (typeof model !== 'object') {
      this.handleError('missing model', {
        model
      })
    }

    if (typeof model.component !== 'object') {
      this.handleError('model missing component object', {
        model
      })
    }

    if (typeof model.component.tag !== 'object') {
      this.handleError('model missing tag object', {
        model
      })
    }
    return model
  }


  filePath(model) {
    return [model.fileName, model.ext].join('.')
  }

  decideNames() {
    let method = `_by${this.convention.capitalize()}`
    let model = this[method]()
    let {
      styleFileExt,
      testFileExt,
      testLib
    } = this.props
    model.style.ext = styleFileExt
    model.style.filePath = this.filePath(model.style)
    model.test.ext = testFileExt
    model.test.filePath = this.filePath(model.test)
    model.test.lib = testLib
    return model
  }

  _byName() {
    const name = this.model.component.tag.name
    const nameMap = {
      component: {
        name,
        fileName: name
      },
      dts: {
        fileName: name,
      },
      interface: {
        fileName: name
      },
      style: {
        fileName: name
      },
      test: {
        fileName: name
      }
    }
    return nameMap
  }

  _byType() {
    const name = this.tagName
    const nameMap = {
      component: {
        name: name,
        fileName: 'component',
      },
      dts: {
        fileName: 'definitions',
      },
      interface: {
        fileName: 'interface'
      },
      style: {
        fileName: 'styles'
      },
      test: {
        fileName: 'unit'
      }
    }
    return nameMap
  }
}

module.exports = {
  NameConvention,
  byConvention
}