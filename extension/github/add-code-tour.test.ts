import { buildSection, buildTitleRow, getParent } from './add-code-tour'

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
          step: 3,
          steps: [],
          ref: 'alongcommitid',
          repository: 'doctolib/code-tours-github',
        },
      }),
    ).toMatchSnapshot()
  })
})
