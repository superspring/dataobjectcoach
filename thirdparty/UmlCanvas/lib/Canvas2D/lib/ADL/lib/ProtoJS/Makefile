APP         = ProtoJS
BUILD_STYLE = simple

SRCS = src/IEFixes.js \
       src/ProtoJS.js \
       src/Mixin.js \
       src/Event.js \
       src/Object.js \
       src/String.js \
       src/Number.js \
       src/Class.js \
       src/Array.js \
       src/Hash.js \
       src/Function.js \
       src/Ajax.js \
       src/Timer.js \
       src/Font.js \
       src/Test.js

CLI_SRCS = ${SRCS}

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
