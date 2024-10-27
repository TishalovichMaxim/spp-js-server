main: compile
	node ./build/main.js

ws: compile
	node ./build/ws/main.js

debug-ws: compile
	node --inspect ./build/ws/main.js

compile:
	tsc

clean:
	rm -rf ./build/*

clean_uploads:
	rm -rf ./uploads/*

