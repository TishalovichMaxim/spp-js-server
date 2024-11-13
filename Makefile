main: compile
	node ./build/main.js

ws: compile
	node ./build/ws/main.js

debug: compile
	node --inspect ./build/main.js

compile:
	tsc

clean:
	rm -rf ./build/*

clean_uploads:
	rm -rf ./uploads/*

