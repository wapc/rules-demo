package module

import (
	"context"

	"github.com/vmihailenco/msgpack/v4"
	"github.com/wapc/wapc-go"
)

type Module struct {
	instance *wapc.Instance
}

func New(instance *wapc.Instance) *Module {
	return &Module{
		instance: instance,
	}
}

func (m *Module) Decide(ctx context.Context, facts Facts) ([]Decision, error) {
	var ret []Decision
	inputArgs := DecideArgs{
		Facts: facts,
	}
	inputPayload, err := msgpack.Marshal(&inputArgs)
	if err != nil {
		return ret, err
	}
	payload, err := m.instance.Invoke(
		ctx,
		"decide",
		inputPayload,
	)
	if err != nil {
		return ret, err
	}
	err = msgpack.Unmarshal(payload, &ret)
	return ret, err
}

type DecideArgs struct {
	Facts Facts `msgpack:"facts"`
}

type Facts struct {
	Income      uint64 `msgpack:"income"`
	CreditScore uint16 `msgpack:"creditScore"`
}

type Decision struct {
	Code    string `msgpack:"code"`
	Message string `msgpack:"message"`
}
