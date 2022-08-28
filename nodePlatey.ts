import { plateyTasks } from './plateyTasks'

const today =
  new Date().getFullYear() +
  '-' +
  (new Date().getMonth() + 1) +
  '-' +
  new Date().getDate()

plateyTasks(process.argv[2] ?? `node-platey-${today}`).run()
