APP          = ADL

GRAMMAR      = src/js/${APP}.par
SRCS         = build/${APP}.parser.js
CLI_SRCS     = ${SRCS}

LIBS         = lib/ProtoJS/build/ProtoJS.js

JSCC-WEB     = ${JSEXEC} lib/jscc.js -t lib/driver_web.js_ -o
JSCC-RHINO   = ${JSEXEC} lib/jscc.js -t lib/river_rhino.js_ -o

UPDATE_LIBS  = lib/ProtoJS

MORE_TARGETS      = all-python
MORE_DIST_TARGETS = dist-python
MORE_TEST_TARGETS = test-python
MORE_CLEAN_TARGETS = clean-python
MORE_MRPROPER_TARGETS = mrproper-python

MORE_DIST-SRC_SRCS = include.js

#############################################################################
# boilerplate to kickstart common.make

have-common := $(wildcard lib/common.make/Makefile.inc)
ifeq ($(strip $(have-common)),)
all:
	@echo "*** one-time initialization of common.make"
	@git submodule -q init
	@git submodule -q update
	@$(MAKE) -s $@
endif

-include lib/common.make/Makefile.inc

#############################################################################

${SRCS}: ${GRAMMAR}
	@echo "*** generating ${APP} JS parser"
	@mkdir -p build
	@${JSCC-WEB} $@ $<

#############################################################################
# additions for python lib

ANTLR=java -cp ../../lib/antlr-3.1.jar org.antlr.Tool
PY-DIST = py-adl-${VERSION}.zip

all-python:
	@echo "*** generating ADL python parser"
	@(cd src/python; ${ANTLR} adl.g 2>/dev/null)
	@echo "*** building ADL python module"
	@rm -rf ${BUILD_DIR}/adl
	@mkdir -p ${BUILD_DIR}/adl
	@cp src/python/adl.py       ${BUILD_DIR}/adl
	@cp src/python/adlLexer.py  ${BUILD_DIR}/adl
	@cp src/python/adlParser.py ${BUILD_DIR}/adl
	@touch ${BUILD_DIR}/adl/__init__.py

dist-python: all-python
	@echo "*** packaging ADL python module"
	@${ZIP} ${DIST_DIR}/${PY-DIST} ${BUILD_DIR}/adl

test-python: all-python
	@rm -rf t/adl
	@cp -r build/adl t/
	@(cd t; python testSyntax.py 2>/dev/null)
	@rm -rf t/adl

clean-python:
	@(cd src/python; rm -f Adl.tokens AdlLexer.py AdlParser.py *.pyc)

mrproper-python:
