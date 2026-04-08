import { Pages } from '../Pages'
import { Media } from '../Media'

describe('Pages Collection', () => {
  it('should have the correct slug', () => {
    expect(Pages.slug).toBe('pages')
  })

  it('should allow public read access', () => {
    expect(Pages.access?.read?.()).toBe(true)
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
