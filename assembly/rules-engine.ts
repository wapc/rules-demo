export interface Rule<F, D> {
  name(): string;
  evaluate(facts: F): D | null;
}

export class Engine<F, D> {
  rules: Array<Rule<F, D>>;

  constructor() {
    this.rules = new Array<Rule<F, D>>(0);
  }

  addRule(rule: Rule<F, D>): void {
    this.rules.push(rule);
  }

  evaluate(facts: F): Array<D> {
    var results = new Array<D>(0);

    for (var i = 0; i < this.rules.length; i++) {
      const rule = this.rules[i];
      const result = rule.evaluate(facts);

      if (result != null) {
        results.push(result);
      }
    }

    return results;
  }
}
