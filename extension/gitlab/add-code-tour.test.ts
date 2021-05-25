import { buildSection, buildTitleRow, getParent, highlightRows } from './add-code-tour'

global.chrome = {
  // @ts-expect-error mocking the chrome API in tests
  extension: {
    getURL: (element) => `extension-url/${element}`,
  },
}

describe(buildTitleRow, () => {
  it('renders properly the code tour header', () => {
    expect(
      buildTitleRow(
        {
          description: 'code tour description',
          line: 42,
          file: '/package.json',
          nextUrl: 'the/next/url?with=params',
          previousUrl: 'the/next/url?with=params',
          tour: {
            title: 'The code tour title',
            slang: 'Thecodetourtitle',
            step: 3,
            steps: [],
            ref: 'alongcommitid',
            repository: 'doctolib/code-tours-github',
          },
        },
        1,
      ),
    ).toMatchSnapshot()
  })
})

describe(buildSection, () => {
  it('renders properly the whole section', () => {
    expect(
      buildSection(
        {
          description: 'code tour description',
          line: 42,
          file: '/package.json',
          nextUrl: 'the/next/url?with=params',
          previousUrl: 'the/next/url?with=params',
          tour: {
            title: 'The code tour title',
            slang: 'Thecodetourtitle',
            step: 3,
            steps: [],
            ref: 'alongcommitid',
            repository: 'doctolib/code-tours-github',
          },
        },
        1,
      ),
    ).toMatchSnapshot()
  })

  it('renders properly the section when the next and previous URLs are not defined', () => {
    expect(
      buildSection(
        {
          description: 'code tour description',
          line: 42,
          file: '/package.json',
          tour: {
            title: 'The code tour title',
            slang: 'Thecodetourtitle',
            step: 3,
            steps: [],
            ref: 'alongcommitid',
            repository: 'doctolib/code-tours-github',
          },
        },
        1,
      ),
    ).toMatchSnapshot()
  })
})

describe(getParent, () => {
  it('returns the line of the file for a file step', () => {
    document.body.innerHTML = `
     <div id="LC42" class="blob-code" />
    `
    expect(
      getParent({
        description: 'code tour description',
        line: 42,
        file: '/package.json',
        tour: {
          title: 'The code tour title',
          slang: 'Thecodetourtitle',
          step: 3,
          steps: [],
          ref: 'alongcommitid',
          repository: 'doctolib/code-tours-github',
        },
      }),
    ).toMatchSnapshot()
  })

  it('returns the top of the file for step with no file associated', () => {
    document.body.innerHTML = `
     <div class="repository-content"/>
    `
    expect(
      getParent({
        description: 'code tour description',
        directory: 'the directory',
        tour: {
          title: 'The code tour title',
          slang: 'Thecodetourtitle',
          step: 3,
          steps: [],
          ref: 'alongcommitid',
          repository: 'doctolib/code-tours-github',
        },
      }),
    ).toMatchSnapshot()
  })

  it('fallbacks to step selection when step line is missing', () => {
    document.body.innerHTML = `
       <div id="LC20" class="blob-code" />
      `

    expect(
      getParent({
        description: 'code tour description',
        line: undefined,
        selection: {
          start: {
            line: 10,
            character: 7,
          },
          end: { line: 20, character: 7 },
        },
        file: '/package.json',
        tour: {
          title: 'The code tour title',
          slang: 'Thecodetourtitle',
          step: 3,
          steps: [],
          ref: 'alongcommitid',
          repository: 'doctolib/code-tours-github',
        },
      }),
    ).toMatchSnapshot()
  })
})

describe(highlightRows, () => {
  it('renders multiple highlighted code rows', () => {
    document.body.innerHTML = `
       <div id="LC20" class="blob-code" />
       <div id="LC21" class="blob-code" />
       <div id="LC22" class="blob-code" />
      `

    highlightRows({
      description: 'code tour description',
      line: undefined,
      selection: {
        start: {
          line: 20,
          character: 7,
        },
        end: { line: 21, character: 7 },
      },
      file: '/package.json',
      tour: {
        title: 'The code tour title',
        slang: 'Thecodetourtitle',
        step: 3,
        steps: [],
        ref: 'alongcommitid',
        repository: 'doctolib/code-tours-github',
      },
    })

    expect(document.querySelector('#LC20')?.classList.contains('highlighted')).toBe(true)
    expect(document.querySelector('#LC21')?.classList.contains('highlighted')).toBe(true)
    expect(document.querySelector('#LC22')?.classList.contains('highlighted')).toBe(false)
  })

  it('renders one highlighted code row', () => {
    document.body.innerHTML = `
       <div id="LC20" class="blob-code" />
       <div id="LC21" class="blob-code" />
      `

    highlightRows({
      description: 'code tour description',
      line: 21,
      selection: undefined,
      file: '/package.json',
      tour: {
        title: 'The code tour title',
        slang: 'Thecodetourtitle',
        step: 3,
        steps: [],
        ref: 'alongcommitid',
        repository: 'doctolib/code-tours-github',
      },
    })

    expect(document.querySelector('#LC20')?.classList.contains('highlighted')).toBe(false)
    expect(document.querySelector('#LC21')?.classList.contains('highlighted')).toBe(true)
  })
})
