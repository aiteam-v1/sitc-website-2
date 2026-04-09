import { Pages } from '../Pages'
import { Media } from '../Media'

describe('Pages Collection', () => {
  it('should have the correct slug', () => {
    expect(Pages.slug).toBe('pages')
  })

  it('should limit guest reads to published docs', () => {
    expect(Pages.access?.read?.({ req: {} } as any)).toEqual({
      _status: {
        equals: 'published',
      },
    })
  })

  it('should allow editors to read drafts', () => {
    expect(
      Pages.access?.read?.({ req: { user: { role: 'content_editor' } } } as any),
    ).toBe(true)
  })
})

describe('Media Collection', () => {
  it('should keep the correct slug', () => {
    expect(Media.slug).toBe('media')
  })

  it('should allow public read access', () => {
    expect(Media.access?.read?.()).toBe(true)
  })
})
