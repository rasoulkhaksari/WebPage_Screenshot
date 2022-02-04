# **Web Page Screenshot**
Take a screenshot of a web page using a headless web browser. This solution focuses on operation throughput, such that millions of screenshots could be taken every day.

## **Components**
- **Web application** (serve a web page using expressJS framework)
- **Screenshot capture application** (a NodeJS application wich uses headless web browser as an engine to load the web page and take a screenshot of that and save the result as an image file)
- **Headless web browser** (PhantomJS: loads and renders a given web page)
- **Message broker** (NATS: send and recieve application messages in a distributied architecture via publish/subscribe pattern)
- **API layer** (a Golang console application wich works as a client load tester, read url list and request them to Screenshot capture application via message broker, this application could be supposed to an API layer for the entire system)


## **How to run application**
1. go to project folder
```
$ cd ./WebPage_Screenshot 
 ```
2. start web application (required Nodejs)
```
$ node ./website/app.js 
```
3. start NATS message broker
```
$ ./tool/nats-server
```
4. start screenshot capture application
```
$ node ./screenshot/phantompool.js
```
5. appned list of url to ./client/url.txt file
6. run golan client application (golang app folder sould be appended to $GOPATH OS env variable)
```
$ go run ./client/main.go
```
