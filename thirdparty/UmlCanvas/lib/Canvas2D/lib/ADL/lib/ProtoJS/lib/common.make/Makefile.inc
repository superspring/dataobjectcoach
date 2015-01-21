SRC_DIR   = src
LIB_DIR   = lib
BUILD_DIR = build
DIST_DIR  = dist

MAKE      = make
ZIP       = zip -qr

RHINO         = java -jar lib/common.make/js.jar
JSEXEC        = ${RHINO} -w -debug
COMPRESS      = java -jar lib/common.make/yuicompressor-2.4.2.jar --type js

VERSION = $(shell git describe --tags | cut -d'-' -f1,2)

DIST          = ${APP}-${VERSION}.zip
DIST_SRCS     = LICENSE README ${BASE_TARGETS} examples

DIST-SRC      = ${APP}-${VERSION}-src.zip
DIST-SRC_SRCS = LICENSE README Makefile ${SRC_DIR} ${LIB_DIR} examples \
                ${MORE_DIST-SRC_SRCS}

ifeq (${BUILD_STYLE}, simple)
	BASE_TARGETS = ${BUILD_DIR}/${APP}.min.js \
                 ${BUILD_DIR}/${APP}.cli.min.js
	EXAMPLE_TARGET = ${APP}.min.js
else
	BASE_TARGETS = ${BUILD_DIR}/${APP}.shared.min.js \
	               ${BUILD_DIR}/${APP}.standalone.min.js \
                 ${BUILD_DIR}/${APP}.cli.min.js
	EXAMPLE_TARGET = ${APP}.standalone.min.js
endif

TARGETS = ${BASE_TARGETS} ${MORE_TARGETS}

DIST_TARGETS = ${DIST_DIR}/${DIST} \
			         ${DIST_DIR}/${DIST-SRC} \
							 ${MORE_DIST_TARGETS}

STANDALONE_SRCS = ${SRCS}
SHARED_SRCS     = ${SHARED_EXTRA_SRCS} ${SRCS}

# TO CONFIGURE:

# SRCS               =       # all sources that need to be compiled
# CLI_SRCS           =       # sources the need to be compiled for cli
# SHARED_EXTRA_SRCS  =       # sources that need to be included in shared
# LIBS               =       # libs that need to be included in standalone
# CLI_LIBS           =       # libs that need to be included in cli
# UPDATE_LIBS        =       # libs that need to be rebuild/make'd
# MORE_TARGETS       =       # additional targets for all:
# MORE_DIST_TARGETS  =       # additional targets for dist:
# MORE_TEST_TARGETS  =       # additional targets for test:
# MORE_CLEAN_TARGETS  =      # additional targets for test:
# MORE_MRPROPER_TARGETS  =   # additional targets for test:
# MORE_DIST-SRCS     =       # additional sources for dist:
# MORE_DIST-SRC_SRCS =       # additional sources for dist-src:

all: prepare ${TARGETS}

dist: prepare ${DIST_TARGETS}

prepare: init check-deps update

init:
	@if [ ! -e .gitmodules ]; then \
		echo "*** initializing submodules"; \
		git submodule update --init; \
	fi

check-deps:
	@which zip  >/dev/null || ( echo "ERROR: missing : zip";  exit 1 );
	@which git  >/dev/null || ( echo "ERROR: missing : git";  exit 1 );
	@which java >/dev/null || ( echo "ERROR: missing : java"; exit 1 );

update: ${UPDATE_LIBS}
	@echo "*** updating submodules"
	@for l in ${UPDATE_LIBS}; do \
		( git submodule update $$l; cd $$l; ${MAKE} ) \
	done

${BUILD_DIR}:
	@mkdir  -p ${BUILD_DIR}

${BUILD_DIR}/${APP}.shared.js: ${BUILD_DIR} ${SHARED_SRCS}
	@echo "*** building $@"
	@cat ${SHARED_SRCS} > $@
	@echo "\n${APP}.version = \"${VERSION}\";\n" >> $@;

${BUILD_DIR}/${APP}.js: ${BUILD_DIR} ${SHARED_SRCS}
	@echo "*** building $@"
	@cat ${SHARED_SRCS} > $@
	@echo "\n${APP}.version = \"${VERSION}\";\n" >> $@;

${BUILD_DIR}/${APP}.standalone.js: ${BUILD_DIR} ${LIBS} ${STANDALONE_SRCS}
	@echo "*** building $@"
	@cat ${LIBS} ${STANDALONE_SRCS} > $@
	@echo "\n${APP}.version = \"${VERSION}\";\n" >> $@;

${BUILD_DIR}/${APP}.cli.js: prepare ${BUILD_DIR} ${CLI_LIBS} ${CLI_SRCS}
	@echo "*** building $@"
	@cat ${CLI_LIBS} ${CLI_SRCS} > $@
	@echo "\n${APP}.version = \"${VERSION}\";\n" >> $@;

${DIST_DIR}/${DIST}: ${DIST_SRCS}
	@echo "*** packaging ${APP} distribution"
	@mkdir -p ${DIST_DIR}/js/${APP}
	@cp -r ${DIST_SRCS} ${DIST_DIR}/js/${APP}/
	@( cd ${DIST_DIR}/js/${APP}/examples; \
	   for f in *.html; do \
		cat $$f \
		| sed -e 's/include\.js/${EXAMPLE_TARGET}/' \
		> $$f.new; \
		mv $$f.new $$f; \
	done )
	@(cd ${DIST_DIR}/js; ${ZIP} ../${DIST} ${APP})

${DIST_DIR}/${DIST-SRC}: ${DIST-SRC_SRCS}
	@echo "*** packaging ${APP} src distribution"
	@mkdir -p ${DIST_DIR}/src/${APP}
	@cp -r ${DIST-SRC_SRCS} ${DIST_DIR}/src/${APP}
	@(cd ${DIST_DIR}/src; ${ZIP} ../${DIST-SRC} ${APP})

%.min.js: %.js
	@echo "*** compressing $< > $@"
	@${COMPRESS} $< > $@

lint: ${SRCS}
	@echo "*** checking source correctness using JSLint"
	@for f in ${SRCS}; do \
	  ${RHINO} lib/common.make/jslint-check.js $$f; \
	done

test: prepare ${BUILD_DIR}/${APP}.cli.min.js test-js ${MORE_TEST_TARGETS}

test-js:
	@echo "*** running tests"
	@${JSEXEC} -opt -1 -f t/runAllTests.js

clean: clean-default ${MORE_CLEAN_TARGETS}

clean-default:
	@find . | grep "~$$" | xargs rm -f
	@rm -rf ${BUILD_DIR}

mrproper: mrproper-default ${MORE_MRPROPER_TARGETS}

mrproper-default: clean
	@rm -rf ${DIST_DIR}
