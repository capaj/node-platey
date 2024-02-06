import { execa } from 'execa'
import Listr from 'listr'
import path from 'path'
import fs from 'fs/promises'

import { dirname } from 'path'
import { fileURLToPath } from 'url'

export const plateyDir = dirname(fileURLToPath(import.meta.url))
// export const plateyDir = __dirname

export const plateyTasks = (relativeDir: string) => {
  const projectDir = path.join(process.cwd(), relativeDir)
  return new Listr([
    {
      title: `mkdir ${relativeDir}`,
      task: () => {
        if (relativeDir === '.') {
          console.log('skipping mkdir')
          return
        }
        return execa('mkdir', [relativeDir], { cwd: process.cwd() })
      }
    },
    {
      title: `git init`,
      task: () => {
        return execa('git', ['init'], { cwd: projectDir })
      }
    },
    {
      title: 'add gitignore',
      task: async () => {
        return execa(
          'cp',
          [
            path.join(plateyDir, 'Node.gitignore'),
            path.join(projectDir, '.gitignore')
          ],
          { cwd: projectDir }
        )
      }
    },
    {
      title: 'init pnpm',
      task: () => execa('pnpm', ['init'], { cwd: projectDir })
    },
    {
      title: 'replace ISC license with MIT',
      task: async () => {
        return execa('sed', ['-i', 's/ISC/MIT/g', 'package.json'], {
          cwd: projectDir
        })
      }
    },
    {
      title: 'setup typescript in strict mode',
      task: async () => {
        await execa('pnpm', ['add', '-D', 'typescript'], { cwd: projectDir })
        await execa('cp', [path.join(plateyDir, 'tsconfig.json'), projectDir])
      }
    },
    {
      title: 'setup vitest and tsup',
      task: async () => {
        await execa('pnpm', ['add', '-D', 'vitest'], { cwd: projectDir })
        await execa('pnpm', ['add', '-D', 'tsup'], { cwd: projectDir })
        // await execa('cp', [path.join(plateyDir, 'vitest.config.ts'), projectDir])
        const packageJson = JSON.parse(
          await fs.readFile(path.join(projectDir, 'package.json'), 'utf-8')
        )

        packageJson.scripts = {
          ...packageJson.scripts,
          test: 'vitest',
          ts: 'tsc --noEmit',
          build: 'tsup src/index.ts --format cjs,esm --dts --sourcemap',
          prepublishOnly: 'npm run build'
        }

        Object.assign(packageJson, {
          main: './dist/index.js',
          module: './dist/index.mjs',
          types: './dist/index.d.ts',
          exports: {
            '.': {
              require: './dist/index.js',
              import: './dist/index.mjs',
              types: './dist/index.d.ts'
            }
          },
          files: ['dist']
        })

        await fs.writeFile(
          path.join(projectDir, 'package.json'),
          JSON.stringify(packageJson, null, 2),
          'utf-8'
        )
      }
    },
    {
      title: 'add nvmrc',
      task: async () => {
        const currentNodeVersion = process.versions.node
        await fs.writeFile(path.join(projectDir, '.nvmrc'), currentNodeVersion)
      }
    },
    {
      title: `add empty TS index file with spec file`,
      task: async () => {
        await execa('mkdir', ['-p', 'src'], { cwd: projectDir })
        await execa('touch', ['src/index.ts'], { cwd: projectDir })
        await execa('touch', ['src/index.spec.ts'], { cwd: projectDir })
      }
    },
    {
      title: 'add npmrc',
      task: async () => {
        await fs.writeFile(
          path.join(projectDir, '.npmrc'),
          'auto-install-peers=false'
        )
      }
    },
    {
      title: 'setup github action',
      task: async () => {
        await execa('mkdir', ['-p', '.github/workflows'], { cwd: projectDir })
        await execa('cp', [
          path.join(plateyDir, 'main.yml'),
          path.join(projectDir, '.github/workflows')
        ])
      }
    }
  ])
}
