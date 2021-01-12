package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/wapc/wapc-go"

	module "github.com/wapc/rules-demo/pkg/rules"
)

var mod *wapc.Module
var instance *wapc.Instance
var rulesEngine *module.Module

func main() {
	err := reload()
	if err != nil {
		panic(err)
	}

	r := mux.NewRouter()
	r.HandleFunc("/decide", DecideHandler).Methods("POST")
	r.HandleFunc("/reload", ReloadHandler).Methods("GET")

	srv := &http.Server{
		Handler: r,
		Addr:    "127.0.0.1:8000",
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}

func DecideHandler(w http.ResponseWriter, r *http.Request) {
	var facts module.Facts
	if err := json.NewDecoder(r.Body).Decode(&facts); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	decisions, err := rulesEngine.Decide(r.Context(), facts)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	jsonBytes, err := json.Marshal(decisions)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonBytes)
}

func ReloadHandler(w http.ResponseWriter, r *http.Request) {
	if err := reload(); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}

func reload() error {
	code, err := ioutil.ReadFile("build/rules-demo.wasm")
	if err != nil {
		return err
	}

	mod, err = wapc.New(code, wapc.NoOpHostCallHandler)
	if err != nil {
		return err
	}
	mod.SetLogger(wapc.Println) // Send __console_log calls to stardard out
	mod.SetWriter(wapc.Print)   // Send WASI fd_write calls to stardard out

	instance, err = mod.Instantiate()
	if err != nil {
		return err
	}

	rulesEngine = module.New(instance)

	return nil
}

func printJSON(value interface{}) {
	jsonBytes, err := json.MarshalIndent(value, "", "  ")
	if err != nil {
		return
	}
	fmt.Println(string(jsonBytes))
}
