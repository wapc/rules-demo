import { Facts, Decision } from "../module";
import { Rule } from "../rules-engine";

export class IncomeRule implements Rule<Facts, Decision> {
  name(): string {
    return "income";
  }

  evaluate(facts: Facts): Decision | null {
    if (facts.income < 4000) {
      return Decision.newBuilder()
        .withCode("incomeTooLow")
        .withMessage("not enough income")
        .build();
    }

    return null;
  }
}
