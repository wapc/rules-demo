import { Facts, Decision } from "../module";
import { Rule } from "../rules-engine";

export class CreditScoreRule implements Rule<Facts, Decision> {
  name(): string {
    return "creditScore";
  }

  evaluate(facts: Facts): Decision | null {
    if (facts.creditScore < 400) {
      return Decision.newBuilder()
        .withCode("creditScoreTooLow")
        .withMessage("credit score is too risky")
        .build();
    }

    return null;
  }
}
