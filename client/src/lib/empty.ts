export class SafeConnector {
  constructor() {
    throw new Error('SafeConnector is disabled in this project.')
  }
}
