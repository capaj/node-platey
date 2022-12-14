import { execa } from 'execa'
import { afterAll, beforeAll } from 'vitest'
import { describe, it } from 'vitest'
import { plateyTasks } from './plateyTasks'

describe('plateyTasks', () => {
  beforeAll(async () => {
    await execa('rm', ['-rf', 'test/foo/'])
  })
  it('should create a project', async () => {
    await plateyTasks('test/foo').run()
  }, 15000)

  afterAll(async () => {
    await execa('rm', ['-rf', 'test/foo/'])
  })
})
