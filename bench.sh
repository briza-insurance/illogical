#!/bin/bash

# Usage: ./bench.sh
# Runs all benchmark scripts for both sample and synthetic tests
#
# Ideally you want to run this before making changes, generally on master branch
# then rename the data files so you can compare results before and after your
# changes.
#
# The report command is expecting a `-baseline` suffix on the data file name.

npm run bench:sample:oop:evaluate 
npm run bench:sample:oop:simplify 
npm run bench:sample:oop:parse 

npm run bench:synthetic:oop:evaluate 
npm run bench:synthetic:oop:simplify 
npm run bench:synthetic:oop:parse