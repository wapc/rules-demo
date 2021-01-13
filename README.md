# Simple rules engine demo using waPC and AssemblyScript

Run the rules engine server:

```bash
go run cmd/main.go
```

This will load the waPC module from `build/rules-demo.wasm`.

Execute the rules with some input fact data:

```bash
curl -s -X POST \
  http://localhost:8000/decide \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
	"Income": 3000,
	"CreditScore": 300
}'
```

Rebuild the waPC module after making a change to the rules in `assembly/rules`

```bash
make build
```

Reload the rules:

```bash
curl -s \
  http://localhost:8000/reload \
  -H 'Content-Type: application/json'
```

Re-execute the rules to see the change in decision output.
