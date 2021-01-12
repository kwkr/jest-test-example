export class QueueDependency {
  constructor() {
    throw new Error(
      "I need db access so I cannot be instantiated during unit tests!"
    );
  }

  public async doHeavyStuff() {}
}
