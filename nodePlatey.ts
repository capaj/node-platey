#!/usr/bin/env node

import { plateyTasks } from './plateyTasks'

await plateyTasks(process.argv[2]).run()

// console.log(process.argv)
