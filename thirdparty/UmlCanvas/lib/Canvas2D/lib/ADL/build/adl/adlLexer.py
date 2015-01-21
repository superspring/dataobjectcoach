# $ANTLR 3.1 adl.g 2014-11-30 20:30:18

import sys
from antlr3 import *
from antlr3.compat import set, frozenset


# for convenience in actions
HIDDEN = BaseRecognizer.HIDDEN

# token types
INTEGER=8
INCLUDEDIRECTIVE=4
LINE_COMMENT=12
T__22=22
ANNOTATION=5
T__21=21
T__20=20
EOF=-1
T__19=19
WS=10
T__16=16
BOOLEAN=7
T__15=15
T__18=18
T__17=17
T__14=14
IDENTIFIER=6
T__13=13
COMMENT=11
STRING=9


class adlLexer(Lexer):

    grammarFileName = "adl.g"
    antlr_version = version_str_to_tuple("3.1")
    antlr_version_str = "3.1"

    def __init__(self, input=None, state=None):
        if state is None:
            state = RecognizerSharedState()
        Lexer.__init__(self, input, state)

        self.dfa12 = self.DFA12(
            self, 12,
            eot = self.DFA12_eot,
            eof = self.DFA12_eof,
            min = self.DFA12_min,
            max = self.DFA12_max,
            accept = self.DFA12_accept,
            special = self.DFA12_special,
            transition = self.DFA12_transition
            )






    # $ANTLR start "T__13"
    def mT__13(self, ):

        try:
            _type = T__13
            _channel = DEFAULT_CHANNEL

            # adl.g:7:7: ( '<' )
            # adl.g:7:9: '<'
            pass 
            self.match(60)



            self._state.type = _type
            self._state.channel = _channel

        finally:

            pass

    # $ANTLR end "T__13"



    # $ANTLR start "T__14"
    def mT__14(self, ):

        try:
            _type = T__14
            _channel = DEFAULT_CHANNEL

            # adl.g:8:7: ( '>' )
            # adl.g:8:9: '>'
            pass 
            self.match(62)



            self._state.type = _type
            self._state.channel = _channel

        finally:

            pass

    # $ANTLR end "T__14"



    # $ANTLR start "T__15"
    def mT__15(self, ):

        try:
            _type = T__15
            _channel = DEFAULT_CHANNEL

            # adl.g:9:7: ( ',' )
            # adl.g:9:9: ','
            pass 
            self.match(44)



            self._state.type = _type
            self._state.channel = _channel

        finally:

            pass

    # $ANTLR end "T__15"



    # $ANTLR start "T__16"
    def mT__16(self, ):

        try:
            _type = T__16
            _channel = DEFAULT_CHANNEL

            # adl.g:10:7: ( '+' )
            # adl.g:10:9: '+'
            pass 
            self.match(43)



            self._state.type = _type
            self._state.channel = _channel

        finally:

            pass

    # $ANTLR end "T__16"



    # $ANTLR start "T__17"
    def mT__17(self, ):

        try:
            _type = T__17
            _channel = DEFAULT_CHANNEL

            # adl.g:11:7: ( '=' )
            # adl.g:11:9: '='
            pass 
            self.match(61)



            self._state.type = _type
            self._state.channel = _channel

        finally:

            pass

    # $ANTLR end "T__17"



    # $ANTLR start "T__18"
    def mT__18(self, ):

        try:
            _type = T__18
            _channel = DEFAULT_CHANNEL

            # adl.g:12:7: ( ':' )
            # adl.g:12:9: ':'
            pass 
            self.match(58)



            self._state.type = _type
            self._state.channel = _channel

        finally:

            pass

    # $ANTLR end "T__18"



    # $ANTLR start "T__19"
    def mT__19(self, ):

        try:
            _type = T__19
            _channel = DEFAULT_CHANNEL

            # adl.g:13:7: ( '<=' )
            # adl.g:13:9: '<='
            pass 
            self.match("<=")



            self._state.type = _type
            self._state.channel = _channel

        finally:

            pass

    # $ANTLR end "T__19"



    # $ANTLR start "T__20"
    def mT__20(self, ):

        try:
            _type = T__20
            _channel = DEFAULT_CHANNEL

            # adl.g:14:7: ( '{' )
            # adl.g:14:9: '{'
            pass 
            self.match(123)



            self._state.type = _type
            self._state.channel = _channel

        finally:

            pass

    # $ANTLR end "T__20"



    # $ANTLR start "T__21"
    def mT__21(self, ):

        try:
            _type = T__21
            _channel = DEFAULT_CHANNEL

            # adl.g:15:7: ( '}' )
            # adl.g:15:9: '}'
            pass 
            self.match(125)



            self._state.type = _type
            self._state.channel = _channel

        finally:

            pass

    # $ANTLR end "T__21"



    # $ANTLR start "T__22"
    def mT__22(self, ):

        try:
            _type = T__22
            _channel = DEFAULT_CHANNEL

            # adl.g:16:7: ( ';' )
            # adl.g:16:9: ';'
            pass 
            self.match(59)



            self._state.type = _type
            self._state.channel = _channel

        finally:

            pass

    # $ANTLR end "T__22"



    # $ANTLR start "BOOLEAN"
    def mBOOLEAN(self, ):

        try:
            _type = BOOLEAN
            _channel = DEFAULT_CHANNEL

            # adl.g:127:9: ( 'true' | 'false' )
            alt1 = 2
            LA1_0 = self.input.LA(1)

            if (LA1_0 == 116) :
                alt1 = 1
            elif (LA1_0 == 102) :
                alt1 = 2
            else:
                nvae = NoViableAltException("", 1, 0, self.input)

                raise nvae

            if alt1 == 1:
                # adl.g:127:11: 'true'
                pass 
                self.match("true")


            elif alt1 == 2:
                # adl.g:128:4: 'false'
                pass 
                self.match("false")


            self._state.type = _type
            self._state.channel = _channel

        finally:

            pass

    # $ANTLR end "BOOLEAN"



    # $ANTLR start "IDENTIFIER"
    def mIDENTIFIER(self, ):

        try:
            _type = IDENTIFIER
            _channel = DEFAULT_CHANNEL

            # adl.g:131:12: ( ( 'a' .. 'z' | 'A' .. 'Z' | '_' ) ( 'a' .. 'z' | 'A' .. 'Z' | '0' .. '9' | '_' )* )
            # adl.g:131:14: ( 'a' .. 'z' | 'A' .. 'Z' | '_' ) ( 'a' .. 'z' | 'A' .. 'Z' | '0' .. '9' | '_' )*
            pass 
            if (65 <= self.input.LA(1) <= 90) or self.input.LA(1) == 95 or (97 <= self.input.LA(1) <= 122):
                self.input.consume()
            else:
                mse = MismatchedSetException(None, self.input)
                self.recover(mse)
                raise mse

            # adl.g:131:38: ( 'a' .. 'z' | 'A' .. 'Z' | '0' .. '9' | '_' )*
            while True: #loop2
                alt2 = 2
                LA2_0 = self.input.LA(1)

                if ((48 <= LA2_0 <= 57) or (65 <= LA2_0 <= 90) or LA2_0 == 95 or (97 <= LA2_0 <= 122)) :
                    alt2 = 1


                if alt2 == 1:
                    # adl.g:
                    pass 
                    if (48 <= self.input.LA(1) <= 57) or (65 <= self.input.LA(1) <= 90) or self.input.LA(1) == 95 or (97 <= self.input.LA(1) <= 122):
                        self.input.consume()
                    else:
                        mse = MismatchedSetException(None, self.input)
                        self.recover(mse)
                        raise mse



                else:
                    break #loop2





            self._state.type = _type
            self._state.channel = _channel

        finally:

            pass

    # $ANTLR end "IDENTIFIER"



    # $ANTLR start "INTEGER"
    def mINTEGER(self, ):

        try:
            _type = INTEGER
            _channel = DEFAULT_CHANNEL

            # adl.g:134:9: ( ( '+' | '-' )? ( '0' .. '9' )+ )
            # adl.g:134:11: ( '+' | '-' )? ( '0' .. '9' )+
            pass 
            # adl.g:134:11: ( '+' | '-' )?
            alt3 = 2
            LA3_0 = self.input.LA(1)

            if (LA3_0 == 43 or LA3_0 == 45) :
                alt3 = 1
            if alt3 == 1:
                # adl.g:
                pass 
                if self.input.LA(1) == 43 or self.input.LA(1) == 45:
                    self.input.consume()
                else:
                    mse = MismatchedSetException(None, self.input)
                    self.recover(mse)
                    raise mse




            # adl.g:134:21: ( '0' .. '9' )+
            cnt4 = 0
            while True: #loop4
                alt4 = 2
                LA4_0 = self.input.LA(1)

                if ((48 <= LA4_0 <= 57)) :
                    alt4 = 1


                if alt4 == 1:
                    # adl.g:134:22: '0' .. '9'
                    pass 
                    self.matchRange(48, 57)


                else:
                    if cnt4 >= 1:
                        break #loop4

                    eee = EarlyExitException(4, self.input)
                    raise eee

                cnt4 += 1





            self._state.type = _type
            self._state.channel = _channel

        finally:

            pass

    # $ANTLR end "INTEGER"



    # $ANTLR start "STRING"
    def mSTRING(self, ):

        try:
            _type = STRING
            _channel = DEFAULT_CHANNEL

            # adl.g:137:8: ( '\"' (~ ( '\"' ) )+ '\"' | '\\'' (~ ( '\\'' ) )+ '\\'' )
            alt7 = 2
            LA7_0 = self.input.LA(1)

            if (LA7_0 == 34) :
                alt7 = 1
            elif (LA7_0 == 39) :
                alt7 = 2
            else:
                nvae = NoViableAltException("", 7, 0, self.input)

                raise nvae

            if alt7 == 1:
                # adl.g:137:11: '\"' (~ ( '\"' ) )+ '\"'
                pass 
                self.match(34)
                # adl.g:137:15: (~ ( '\"' ) )+
                cnt5 = 0
                while True: #loop5
                    alt5 = 2
                    LA5_0 = self.input.LA(1)

                    if ((0 <= LA5_0 <= 33) or (35 <= LA5_0 <= 65534)) :
                        alt5 = 1


                    if alt5 == 1:
                        # adl.g:137:15: ~ ( '\"' )
                        pass 
                        if (0 <= self.input.LA(1) <= 33) or (35 <= self.input.LA(1) <= 65534):
                            self.input.consume()
                        else:
                            mse = MismatchedSetException(None, self.input)
                            self.recover(mse)
                            raise mse



                    else:
                        if cnt5 >= 1:
                            break #loop5

                        eee = EarlyExitException(5, self.input)
                        raise eee

                    cnt5 += 1


                self.match(34)


            elif alt7 == 2:
                # adl.g:138:11: '\\'' (~ ( '\\'' ) )+ '\\''
                pass 
                self.match(39)
                # adl.g:138:16: (~ ( '\\'' ) )+
                cnt6 = 0
                while True: #loop6
                    alt6 = 2
                    LA6_0 = self.input.LA(1)

                    if ((0 <= LA6_0 <= 38) or (40 <= LA6_0 <= 65534)) :
                        alt6 = 1


                    if alt6 == 1:
                        # adl.g:138:16: ~ ( '\\'' )
                        pass 
                        if (0 <= self.input.LA(1) <= 38) or (40 <= self.input.LA(1) <= 65534):
                            self.input.consume()
                        else:
                            mse = MismatchedSetException(None, self.input)
                            self.recover(mse)
                            raise mse



                    else:
                        if cnt6 >= 1:
                            break #loop6

                        eee = EarlyExitException(6, self.input)
                        raise eee

                    cnt6 += 1


                self.match(39)


            self._state.type = _type
            self._state.channel = _channel

        finally:

            pass

    # $ANTLR end "STRING"



    # $ANTLR start "ANNOTATION"
    def mANNOTATION(self, ):

        try:
            _type = ANNOTATION
            _channel = DEFAULT_CHANNEL

            # adl.g:142:12: ( '[@' ( options {greedy=false; } : . )* ']' )
            # adl.g:142:14: '[@' ( options {greedy=false; } : . )* ']'
            pass 
            self.match("[@")
            # adl.g:142:19: ( options {greedy=false; } : . )*
            while True: #loop8
                alt8 = 2
                LA8_0 = self.input.LA(1)

                if (LA8_0 == 93) :
                    alt8 = 2
                elif ((0 <= LA8_0 <= 92) or (94 <= LA8_0 <= 65534)) :
                    alt8 = 1


                if alt8 == 1:
                    # adl.g:142:47: .
                    pass 
                    self.matchAny()


                else:
                    break #loop8


            self.match(93)



            self._state.type = _type
            self._state.channel = _channel

        finally:

            pass

    # $ANTLR end "ANNOTATION"



    # $ANTLR start "INCLUDEDIRECTIVE"
    def mINCLUDEDIRECTIVE(self, ):

        try:
            _type = INCLUDEDIRECTIVE
            _channel = DEFAULT_CHANNEL

            # adl.g:145:18: ( '#include' )
            # adl.g:145:20: '#include'
            pass 
            self.match("#include")



            self._state.type = _type
            self._state.channel = _channel

        finally:

            pass

    # $ANTLR end "INCLUDEDIRECTIVE"



    # $ANTLR start "WS"
    def mWS(self, ):

        try:
            _type = WS
            _channel = DEFAULT_CHANNEL

            # adl.g:147:5: ( ( ' ' | '\\r' | '\\t' | '\\u000C' | '\\n' ) )
            # adl.g:147:8: ( ' ' | '\\r' | '\\t' | '\\u000C' | '\\n' )
            pass 
            if (9 <= self.input.LA(1) <= 10) or (12 <= self.input.LA(1) <= 13) or self.input.LA(1) == 32:
                self.input.consume()
            else:
                mse = MismatchedSetException(None, self.input)
                self.recover(mse)
                raise mse

            #action start
            _channel=HIDDEN 
            #action end



            self._state.type = _type
            self._state.channel = _channel

        finally:

            pass

    # $ANTLR end "WS"



    # $ANTLR start "COMMENT"
    def mCOMMENT(self, ):

        try:
            _type = COMMENT
            _channel = DEFAULT_CHANNEL

            # adl.g:151:5: ( '/*' ( options {greedy=false; } : . )* '*/' )
            # adl.g:151:9: '/*' ( options {greedy=false; } : . )* '*/'
            pass 
            self.match("/*")
            # adl.g:151:14: ( options {greedy=false; } : . )*
            while True: #loop9
                alt9 = 2
                LA9_0 = self.input.LA(1)

                if (LA9_0 == 42) :
                    LA9_1 = self.input.LA(2)

                    if (LA9_1 == 47) :
                        alt9 = 2
                    elif ((0 <= LA9_1 <= 46) or (48 <= LA9_1 <= 65534)) :
                        alt9 = 1


                elif ((0 <= LA9_0 <= 41) or (43 <= LA9_0 <= 65534)) :
                    alt9 = 1


                if alt9 == 1:
                    # adl.g:151:42: .
                    pass 
                    self.matchAny()


                else:
                    break #loop9


            self.match("*/")
            #action start
            _channel=HIDDEN 
            #action end



            self._state.type = _type
            self._state.channel = _channel

        finally:

            pass

    # $ANTLR end "COMMENT"



    # $ANTLR start "LINE_COMMENT"
    def mLINE_COMMENT(self, ):

        try:
            _type = LINE_COMMENT
            _channel = DEFAULT_CHANNEL

            # adl.g:155:5: ( '//' (~ ( '\\n' | '\\r' ) )* ( '\\r' )? '\\n' )
            # adl.g:155:7: '//' (~ ( '\\n' | '\\r' ) )* ( '\\r' )? '\\n'
            pass 
            self.match("//")
            # adl.g:155:12: (~ ( '\\n' | '\\r' ) )*
            while True: #loop10
                alt10 = 2
                LA10_0 = self.input.LA(1)

                if ((0 <= LA10_0 <= 9) or (11 <= LA10_0 <= 12) or (14 <= LA10_0 <= 65534)) :
                    alt10 = 1


                if alt10 == 1:
                    # adl.g:155:12: ~ ( '\\n' | '\\r' )
                    pass 
                    if (0 <= self.input.LA(1) <= 9) or (11 <= self.input.LA(1) <= 12) or (14 <= self.input.LA(1) <= 65534):
                        self.input.consume()
                    else:
                        mse = MismatchedSetException(None, self.input)
                        self.recover(mse)
                        raise mse



                else:
                    break #loop10


            # adl.g:155:26: ( '\\r' )?
            alt11 = 2
            LA11_0 = self.input.LA(1)

            if (LA11_0 == 13) :
                alt11 = 1
            if alt11 == 1:
                # adl.g:155:26: '\\r'
                pass 
                self.match(13)



            self.match(10)
            #action start
            _channel=HIDDEN 
            #action end



            self._state.type = _type
            self._state.channel = _channel

        finally:

            pass

    # $ANTLR end "LINE_COMMENT"



    def mTokens(self):
        # adl.g:1:8: ( T__13 | T__14 | T__15 | T__16 | T__17 | T__18 | T__19 | T__20 | T__21 | T__22 | BOOLEAN | IDENTIFIER | INTEGER | STRING | ANNOTATION | INCLUDEDIRECTIVE | WS | COMMENT | LINE_COMMENT )
        alt12 = 19
        alt12 = self.dfa12.predict(self.input)
        if alt12 == 1:
            # adl.g:1:10: T__13
            pass 
            self.mT__13()


        elif alt12 == 2:
            # adl.g:1:16: T__14
            pass 
            self.mT__14()


        elif alt12 == 3:
            # adl.g:1:22: T__15
            pass 
            self.mT__15()


        elif alt12 == 4:
            # adl.g:1:28: T__16
            pass 
            self.mT__16()


        elif alt12 == 5:
            # adl.g:1:34: T__17
            pass 
            self.mT__17()


        elif alt12 == 6:
            # adl.g:1:40: T__18
            pass 
            self.mT__18()


        elif alt12 == 7:
            # adl.g:1:46: T__19
            pass 
            self.mT__19()


        elif alt12 == 8:
            # adl.g:1:52: T__20
            pass 
            self.mT__20()


        elif alt12 == 9:
            # adl.g:1:58: T__21
            pass 
            self.mT__21()


        elif alt12 == 10:
            # adl.g:1:64: T__22
            pass 
            self.mT__22()


        elif alt12 == 11:
            # adl.g:1:70: BOOLEAN
            pass 
            self.mBOOLEAN()


        elif alt12 == 12:
            # adl.g:1:78: IDENTIFIER
            pass 
            self.mIDENTIFIER()


        elif alt12 == 13:
            # adl.g:1:89: INTEGER
            pass 
            self.mINTEGER()


        elif alt12 == 14:
            # adl.g:1:97: STRING
            pass 
            self.mSTRING()


        elif alt12 == 15:
            # adl.g:1:104: ANNOTATION
            pass 
            self.mANNOTATION()


        elif alt12 == 16:
            # adl.g:1:115: INCLUDEDIRECTIVE
            pass 
            self.mINCLUDEDIRECTIVE()


        elif alt12 == 17:
            # adl.g:1:132: WS
            pass 
            self.mWS()


        elif alt12 == 18:
            # adl.g:1:135: COMMENT
            pass 
            self.mCOMMENT()


        elif alt12 == 19:
            # adl.g:1:143: LINE_COMMENT
            pass 
            self.mLINE_COMMENT()







    # lookup tables for DFA #12

    DFA12_eot = DFA.unpack(
        u"\1\uffff\1\24\2\uffff\1\25\5\uffff\2\14\12\uffff\2\14\2\uffff\2"
        u"\14\1\36\1\14\1\uffff\1\36"
        )

    DFA12_eof = DFA.unpack(
        u"\40\uffff"
        )

    DFA12_min = DFA.unpack(
        u"\1\11\1\75\2\uffff\1\60\5\uffff\1\162\1\141\6\uffff\1\52\3\uffff"
        u"\1\165\1\154\2\uffff\1\145\1\163\1\60\1\145\1\uffff\1\60"
        )

    DFA12_max = DFA.unpack(
        u"\1\175\1\75\2\uffff\1\71\5\uffff\1\162\1\141\6\uffff\1\57\3\uffff"
        u"\1\165\1\154\2\uffff\1\145\1\163\1\172\1\145\1\uffff\1\172"
        )

    DFA12_accept = DFA.unpack(
        u"\2\uffff\1\2\1\3\1\uffff\1\5\1\6\1\10\1\11\1\12\2\uffff\1\14\1"
        u"\15\1\16\1\17\1\20\1\21\1\uffff\1\7\1\1\1\4\2\uffff\1\22\1\23\4"
        u"\uffff\1\13\1\uffff"
        )

    DFA12_special = DFA.unpack(
        u"\40\uffff"
        )

            
    DFA12_transition = [
        DFA.unpack(u"\2\21\1\uffff\2\21\22\uffff\1\21\1\uffff\1\16\1\20\3"
        u"\uffff\1\16\3\uffff\1\4\1\3\1\15\1\uffff\1\22\12\15\1\6\1\11\1"
        u"\1\1\5\1\2\2\uffff\32\14\1\17\3\uffff\1\14\1\uffff\5\14\1\13\15"
        u"\14\1\12\6\14\1\7\1\uffff\1\10"),
        DFA.unpack(u"\1\23"),
        DFA.unpack(u""),
        DFA.unpack(u""),
        DFA.unpack(u"\12\15"),
        DFA.unpack(u""),
        DFA.unpack(u""),
        DFA.unpack(u""),
        DFA.unpack(u""),
        DFA.unpack(u""),
        DFA.unpack(u"\1\26"),
        DFA.unpack(u"\1\27"),
        DFA.unpack(u""),
        DFA.unpack(u""),
        DFA.unpack(u""),
        DFA.unpack(u""),
        DFA.unpack(u""),
        DFA.unpack(u""),
        DFA.unpack(u"\1\30\4\uffff\1\31"),
        DFA.unpack(u""),
        DFA.unpack(u""),
        DFA.unpack(u""),
        DFA.unpack(u"\1\32"),
        DFA.unpack(u"\1\33"),
        DFA.unpack(u""),
        DFA.unpack(u""),
        DFA.unpack(u"\1\34"),
        DFA.unpack(u"\1\35"),
        DFA.unpack(u"\12\14\7\uffff\32\14\4\uffff\1\14\1\uffff\32\14"),
        DFA.unpack(u"\1\37"),
        DFA.unpack(u""),
        DFA.unpack(u"\12\14\7\uffff\32\14\4\uffff\1\14\1\uffff\32\14")
    ]

    # class definition for DFA #12

    DFA12 = DFA
 



def main(argv, stdin=sys.stdin, stdout=sys.stdout, stderr=sys.stderr):
    from antlr3.main import LexerMain
    main = LexerMain(adlLexer)
    main.stdin = stdin
    main.stdout = stdout
    main.stderr = stderr
    main.execute(argv)


if __name__ == '__main__':
    main(sys.argv)
