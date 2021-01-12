import { handleCall, handleAbort } from "@wapc/as-guest";
import { Facts, Decision, Handlers } from "./module";
import { Engine } from "./rules-engine";

// Rules
import { IncomeRule } from "./rules/income";
import { CreditScoreRule } from "./rules/credit-score";

var engine: Engine<Facts, Decision>;

export function wapc_init(): void {
  Handlers.registerDecide(decide);

  engine = new Engine<Facts, Decision>();

  const income = new IncomeRule();
  engine.addRule(income);
  const creditScore = new CreditScoreRule();
  engine.addRule(creditScore);
}

function decide(facts: Facts): Array<Decision> {
  return engine.evaluate(facts);
}

// Boilerplate code for waPC.  Do not remove.

export function __guest_call(operation_size: usize, payload_size: usize): bool {
  return handleCall(operation_size, payload_size);
}

// Abort function
function abort(
  message: string | null,
  fileName: string | null,
  lineNumber: u32,
  columnNumber: u32
): void {
  handleAbort(message, fileName, lineNumber, columnNumber);
}
