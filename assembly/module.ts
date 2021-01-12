import { register, hostCall } from "@wapc/as-guest";
import {
  Decoder,
  Writer,
  Encoder,
  Sizer,
  Codec,
  Value,
} from "@wapc/as-msgpack";

export class Host {
  binding: string;

  constructor(binding: string) {
    this.binding = binding;
  }

  decide(facts: Facts): Array<Decision> {
    const inputArgs = new DecideArgs();
    inputArgs.facts = facts;
    const payload = hostCall(
      this.binding,
      "rules",
      "decide",
      inputArgs.toBuffer()
    );
    const decoder = new Decoder(payload);
    const ret = decoder.readArray(
      (decoder: Decoder): Decision => {
        return Decision.decode(decoder);
      }
    );
    return ret;
  }
}

export class Handlers {
  static registerDecide(handler: (facts: Facts) => Array<Decision>): void {
    decideHandler = handler;
    register("decide", decideWrapper);
  }
}

var decideHandler: (facts: Facts) => Array<Decision>;
function decideWrapper(payload: ArrayBuffer): ArrayBuffer {
  const decoder = new Decoder(payload);
  const inputArgs = new DecideArgs();
  inputArgs.decode(decoder);
  const response = decideHandler(inputArgs.facts);
  const sizer = new Sizer();
  sizer.writeArray(response, (sizer: Writer, item: Decision): void => {
    item.encode(sizer);
  });
  const ua = new ArrayBuffer(sizer.length);
  const encoder = new Encoder(ua);
  encoder.writeArray(response, (encoder: Writer, item: Decision): void => {
    item.encode(encoder);
  });
  return ua;
}

export class DecideArgs implements Codec {
  facts: Facts = new Facts();

  static decodeNullable(decoder: Decoder): DecideArgs | null {
    if (decoder.isNextNil()) return null;
    return DecideArgs.decode(decoder);
  }

  // decode
  static decode(decoder: Decoder): DecideArgs {
    const o = new DecideArgs();
    o.decode(decoder);
    return o;
  }

  decode(decoder: Decoder): void {
    var numFields = decoder.readMapSize();

    while (numFields > 0) {
      numFields--;
      const field = decoder.readString();

      if (field == "facts") {
        this.facts = Facts.decode(decoder);
      } else {
        decoder.skip();
      }
    }
  }

  encode(encoder: Writer): void {
    encoder.writeMapSize(1);
    encoder.writeString("facts");
    this.facts.encode(encoder);
  }

  toBuffer(): ArrayBuffer {
    let sizer = new Sizer();
    this.encode(sizer);
    let buffer = new ArrayBuffer(sizer.length);
    let encoder = new Encoder(buffer);
    this.encode(encoder);
    return buffer;
  }
}

export class Facts implements Codec {
  income: u64 = 0;
  creditScore: u16 = 0;

  static decodeNullable(decoder: Decoder): Facts | null {
    if (decoder.isNextNil()) return null;
    return Facts.decode(decoder);
  }

  // decode
  static decode(decoder: Decoder): Facts {
    const o = new Facts();
    o.decode(decoder);
    return o;
  }

  decode(decoder: Decoder): void {
    var numFields = decoder.readMapSize();

    while (numFields > 0) {
      numFields--;
      const field = decoder.readString();

      if (field == "income") {
        this.income = decoder.readUInt64();
      } else if (field == "creditScore") {
        this.creditScore = decoder.readUInt16();
      } else {
        decoder.skip();
      }
    }
  }

  encode(encoder: Writer): void {
    encoder.writeMapSize(2);
    encoder.writeString("income");
    encoder.writeUInt64(this.income);
    encoder.writeString("creditScore");
    encoder.writeUInt16(this.creditScore);
  }

  toBuffer(): ArrayBuffer {
    let sizer = new Sizer();
    this.encode(sizer);
    let buffer = new ArrayBuffer(sizer.length);
    let encoder = new Encoder(buffer);
    this.encode(encoder);
    return buffer;
  }

  static newBuilder(): FactsBuilder {
    return new FactsBuilder();
  }
}

export class FactsBuilder {
  instance: Facts = new Facts();

  withIncome(income: u64): FactsBuilder {
    this.instance.income = income;
    return this;
  }

  withCreditScore(creditScore: u16): FactsBuilder {
    this.instance.creditScore = creditScore;
    return this;
  }

  build(): Facts {
    return this.instance;
  }
}

export class Decision implements Codec {
  code: string = "";
  message: string = "";

  static decodeNullable(decoder: Decoder): Decision | null {
    if (decoder.isNextNil()) return null;
    return Decision.decode(decoder);
  }

  // decode
  static decode(decoder: Decoder): Decision {
    const o = new Decision();
    o.decode(decoder);
    return o;
  }

  decode(decoder: Decoder): void {
    var numFields = decoder.readMapSize();

    while (numFields > 0) {
      numFields--;
      const field = decoder.readString();

      if (field == "code") {
        this.code = decoder.readString();
      } else if (field == "message") {
        this.message = decoder.readString();
      } else {
        decoder.skip();
      }
    }
  }

  encode(encoder: Writer): void {
    encoder.writeMapSize(2);
    encoder.writeString("code");
    encoder.writeString(this.code);
    encoder.writeString("message");
    encoder.writeString(this.message);
  }

  toBuffer(): ArrayBuffer {
    let sizer = new Sizer();
    this.encode(sizer);
    let buffer = new ArrayBuffer(sizer.length);
    let encoder = new Encoder(buffer);
    this.encode(encoder);
    return buffer;
  }

  static newBuilder(): DecisionBuilder {
    return new DecisionBuilder();
  }
}

export class DecisionBuilder {
  instance: Decision = new Decision();

  withCode(code: string): DecisionBuilder {
    this.instance.code = code;
    return this;
  }

  withMessage(message: string): DecisionBuilder {
    this.instance.message = message;
    return this;
  }

  build(): Decision {
    return this.instance;
  }
}
