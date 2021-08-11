package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/nats-io/nats.go"
)

func main() {
	wd, _ := os.Getwd()
	url_path, _ := filepath.Abs(wd + "/src/web_capture/url.txt")
	fmt.Println(url_path)
	file, err := os.Open(url_path)
	if err != nil {
		log.Fatalf("failed to open url.txt file")
	}
	defer file.Close()
	scanner := bufio.NewScanner(file)
	scanner.Split(bufio.ScanLines)
	var urls []string
	for scanner.Scan() {
		urls = append(urls, scanner.Text())
	}

	cnl := "webcapture"
	nc, _ := nats.Connect(nats.DefaultURL)

	var wg sync.WaitGroup
	start := time.Now()
	for _, url := range urls {
		wg.Add(1)
		go func(URL string) {
			msg, err := nc.Request(cnl, []byte(URL), 200*time.Second)
			if err == nil {
				fmt.Println(string(msg.Data))
			}
			wg.Done()
		}(url)
	}
	wg.Wait()
	nc.Close()
	log.Printf("capturing took %s", time.Since(start))
}
