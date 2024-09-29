main: compile
	node ./build/main.js

compile:
	tsc

clean:
	rm -rf ./build/*

clean_uploads:
	rm -rf ./uploads/*


