# $ANTLR 3.1 adl.g 2014-11-30 20:30:18

import sys
from antlr3 import *
from antlr3.compat import set, frozenset
         
from adl import *



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
T__13=13
IDENTIFIER=6
COMMENT=11
STRING=9

# token names
tokenNames = [
    "<invalid>", "<EOR>", "<DOWN>", "<UP>", 
    "INCLUDEDIRECTIVE", "ANNOTATION", "IDENTIFIER", "BOOLEAN", "INTEGER", 
    "STRING", "WS", "COMMENT", "LINE_COMMENT", "'<'", "'>'", "','", "'+'", 
    "'='", "':'", "'<='", "'{'", "'}'", "';'"
]




class adlParser(Parser):
    grammarFileName = "adl.g"
    antlr_version = version_str_to_tuple("3.1")
    antlr_version_str = "3.1"
    tokenNames = tokenNames

    def __init__(self, input, state=None):
        if state is None:
            state = RecognizerSharedState()

        Parser.__init__(self, input, state)







                


        



    # $ANTLR start "compilationUnit"
    # adl.g:12:1: compilationUnit returns [list] : ( statements )? ;
    def compilationUnit(self, ):

        list = None

        statements1 = None


        list = [] 
        try:
            try:
                # adl.g:13:17: ( ( statements )? )
                # adl.g:13:19: ( statements )?
                pass 
                # adl.g:13:19: ( statements )?
                alt1 = 2
                LA1_0 = self.input.LA(1)

                if ((INCLUDEDIRECTIVE <= LA1_0 <= IDENTIFIER) or LA1_0 == 16) :
                    alt1 = 1
                if alt1 == 1:
                    # adl.g:0:0: statements
                    pass 
                    self._state.following.append(self.FOLLOW_statements_in_compilationUnit64)
                    statements1 = self.statements()

                    self._state.following.pop()



                if self._state.backtracking == 0:
                    list = statements1 





            except RecognitionException, re:
                self.reportError(re)
                self.recover(self.input, re)
        finally:

            pass

        return list

    # $ANTLR end "compilationUnit"


    # $ANTLR start "statements"
    # adl.g:16:1: statements returns [list] : ( statement )+ ;
    def statements(self, ):

        list = None

        statement2 = None


        list = [] 
        try:
            try:
                # adl.g:17:12: ( ( statement )+ )
                # adl.g:17:14: ( statement )+
                pass 
                # adl.g:17:14: ( statement )+
                cnt2 = 0
                while True: #loop2
                    alt2 = 2
                    LA2_0 = self.input.LA(1)

                    if ((INCLUDEDIRECTIVE <= LA2_0 <= IDENTIFIER) or LA2_0 == 16) :
                        alt2 = 1


                    if alt2 == 1:
                        # adl.g:17:15: statement
                        pass 
                        self._state.following.append(self.FOLLOW_statement_in_statements113)
                        statement2 = self.statement()

                        self._state.following.pop()
                        if self._state.backtracking == 0:
                            list.append(statement2) 



                    else:
                        if cnt2 >= 1:
                            break #loop2

                        if self._state.backtracking > 0:
                            raise BacktrackingFailed

                        eee = EarlyExitException(2, self.input)
                        raise eee

                    cnt2 += 1






            except RecognitionException, re:
                self.reportError(re)
                self.recover(self.input, re)
        finally:

            pass

        return list

    # $ANTLR end "statements"


    # $ANTLR start "statement"
    # adl.g:20:1: statement returns [instance] : ( directive | construct );
    def statement(self, ):

        instance = None

        directive3 = None

        construct4 = None


        try:
            try:
                # adl.g:21:11: ( directive | construct )
                alt3 = 2
                LA3_0 = self.input.LA(1)

                if (LA3_0 == INCLUDEDIRECTIVE) :
                    alt3 = 1
                elif ((ANNOTATION <= LA3_0 <= IDENTIFIER) or LA3_0 == 16) :
                    alt3 = 2
                else:
                    if self._state.backtracking > 0:
                        raise BacktrackingFailed

                    nvae = NoViableAltException("", 3, 0, self.input)

                    raise nvae

                if alt3 == 1:
                    # adl.g:21:13: directive
                    pass 
                    self._state.following.append(self.FOLLOW_directive_in_statement151)
                    directive3 = self.directive()

                    self._state.following.pop()
                    if self._state.backtracking == 0:
                        instance = directive3 



                elif alt3 == 2:
                    # adl.g:22:13: construct
                    pass 
                    self._state.following.append(self.FOLLOW_construct_in_statement167)
                    construct4 = self.construct()

                    self._state.following.pop()
                    if self._state.backtracking == 0:
                        instance = construct4 




            except RecognitionException, re:
                self.reportError(re)
                self.recover(self.input, re)
        finally:

            pass

        return instance

    # $ANTLR end "statement"


    # $ANTLR start "directive"
    # adl.g:25:1: directive returns [instance] : INCLUDEDIRECTIVE stringliteral ;
    def directive(self, ):

        instance = None

        stringliteral5 = None


        try:
            try:
                # adl.g:26:11: ( INCLUDEDIRECTIVE stringliteral )
                # adl.g:26:14: INCLUDEDIRECTIVE stringliteral
                pass 
                self.match(self.input, INCLUDEDIRECTIVE, self.FOLLOW_INCLUDEDIRECTIVE_in_directive203)
                self._state.following.append(self.FOLLOW_stringliteral_in_directive205)
                stringliteral5 = self.stringliteral()

                self._state.following.pop()
                if self._state.backtracking == 0:
                    instance = Directive( "include", [stringliteral5] ) 





            except RecognitionException, re:
                self.reportError(re)
                self.recover(self.input, re)
        finally:

            pass

        return instance

    # $ANTLR end "directive"


    # $ANTLR start "construct"
    # adl.g:30:1: construct returns [instance] : ( annotations )? (prefix_modifiers= modifiers )? type ( name )? ( supers )? (suffix_modifiers= modifiers )? ( value )? children ;
    def construct(self, ):

        instance = None

        prefix_modifiers = None

        suffix_modifiers = None

        type6 = None

        name7 = None

        annotations8 = None

        supers9 = None

        value10 = None

        children11 = None


        try:
            try:
                # adl.g:31:11: ( ( annotations )? (prefix_modifiers= modifiers )? type ( name )? ( supers )? (suffix_modifiers= modifiers )? ( value )? children )
                # adl.g:31:13: ( annotations )? (prefix_modifiers= modifiers )? type ( name )? ( supers )? (suffix_modifiers= modifiers )? ( value )? children
                pass 
                # adl.g:31:13: ( annotations )?
                alt4 = 2
                LA4_0 = self.input.LA(1)

                if (LA4_0 == ANNOTATION) :
                    alt4 = 1
                if alt4 == 1:
                    # adl.g:0:0: annotations
                    pass 
                    self._state.following.append(self.FOLLOW_annotations_in_construct253)
                    annotations8 = self.annotations()

                    self._state.following.pop()



                # adl.g:31:42: (prefix_modifiers= modifiers )?
                alt5 = 2
                LA5_0 = self.input.LA(1)

                if (LA5_0 == 16) :
                    alt5 = 1
                if alt5 == 1:
                    # adl.g:0:0: prefix_modifiers= modifiers
                    pass 
                    self._state.following.append(self.FOLLOW_modifiers_in_construct258)
                    prefix_modifiers = self.modifiers()

                    self._state.following.pop()



                self._state.following.append(self.FOLLOW_type_in_construct274)
                type6 = self.type()

                self._state.following.pop()
                # adl.g:32:18: ( name )?
                alt6 = 2
                LA6_0 = self.input.LA(1)

                if (LA6_0 == IDENTIFIER) :
                    alt6 = 1
                if alt6 == 1:
                    # adl.g:0:0: name
                    pass 
                    self._state.following.append(self.FOLLOW_name_in_construct276)
                    name7 = self.name()

                    self._state.following.pop()



                # adl.g:32:24: ( supers )?
                alt7 = 2
                LA7_0 = self.input.LA(1)

                if (LA7_0 == 18) :
                    alt7 = 1
                if alt7 == 1:
                    # adl.g:0:0: supers
                    pass 
                    self._state.following.append(self.FOLLOW_supers_in_construct279)
                    supers9 = self.supers()

                    self._state.following.pop()



                # adl.g:32:48: (suffix_modifiers= modifiers )?
                alt8 = 2
                LA8_0 = self.input.LA(1)

                if (LA8_0 == 16) :
                    alt8 = 1
                if alt8 == 1:
                    # adl.g:0:0: suffix_modifiers= modifiers
                    pass 
                    self._state.following.append(self.FOLLOW_modifiers_in_construct284)
                    suffix_modifiers = self.modifiers()

                    self._state.following.pop()



                # adl.g:32:60: ( value )?
                alt9 = 2
                LA9_0 = self.input.LA(1)

                if (LA9_0 == 19) :
                    alt9 = 1
                if alt9 == 1:
                    # adl.g:0:0: value
                    pass 
                    self._state.following.append(self.FOLLOW_value_in_construct287)
                    value10 = self.value()

                    self._state.following.pop()



                self._state.following.append(self.FOLLOW_children_in_construct290)
                children11 = self.children()

                self._state.following.pop()
                if self._state.backtracking == 0:
                     
                    instance = Construct( type        = type6, 
                                          name        = name7, 
                                          annotations = annotations8,
                                          supers      = supers9,
                                          value       = value10,
                                          children    = children11 )
                    if prefix_modifiers != None: instance.modifiers.extend(prefix_modifiers);
                    if suffix_modifiers != None: instance.modifiers.extend(suffix_modifiers);






            except RecognitionException, re:
                self.reportError(re)
                self.recover(self.input, re)
        finally:

            pass

        return instance

    # $ANTLR end "construct"


    # $ANTLR start "annotations"
    # adl.g:44:1: annotations returns [list] : ( ANNOTATION )+ ;
    def annotations(self, ):

        list = None

        ANNOTATION12 = None

        list = [] 
        try:
            try:
                # adl.g:45:13: ( ( ANNOTATION )+ )
                # adl.g:45:15: ( ANNOTATION )+
                pass 
                # adl.g:45:15: ( ANNOTATION )+
                cnt10 = 0
                while True: #loop10
                    alt10 = 2
                    LA10_0 = self.input.LA(1)

                    if (LA10_0 == ANNOTATION) :
                        alt10 = 1


                    if alt10 == 1:
                        # adl.g:45:17: ANNOTATION
                        pass 
                        ANNOTATION12=self.match(self.input, ANNOTATION, self.FOLLOW_ANNOTATION_in_annotations324)
                        if self._state.backtracking == 0:
                            list.append( Annotation(ANNOTATION12.getText()[2:-1])) 



                    else:
                        if cnt10 >= 1:
                            break #loop10

                        if self._state.backtracking > 0:
                            raise BacktrackingFailed

                        eee = EarlyExitException(10, self.input)
                        raise eee

                    cnt10 += 1






            except RecognitionException, re:
                self.reportError(re)
                self.recover(self.input, re)
        finally:

            pass

        return list

    # $ANTLR end "annotations"


    # $ANTLR start "type"
    # adl.g:50:1: type returns [value] : IDENTIFIER ( generic )? ;
    def type(self, ):

        value = None

        IDENTIFIER13 = None
        generic14 = None


        try:
            try:
                # adl.g:51:6: ( IDENTIFIER ( generic )? )
                # adl.g:51:8: IDENTIFIER ( generic )?
                pass 
                IDENTIFIER13=self.match(self.input, IDENTIFIER, self.FOLLOW_IDENTIFIER_in_type389)
                # adl.g:51:19: ( generic )?
                alt11 = 2
                LA11_0 = self.input.LA(1)

                if (LA11_0 == 13) :
                    alt11 = 1
                if alt11 == 1:
                    # adl.g:0:0: generic
                    pass 
                    self._state.following.append(self.FOLLOW_generic_in_type391)
                    generic14 = self.generic()

                    self._state.following.pop()



                if self._state.backtracking == 0:
                     
                    value = IDENTIFIER13.getText()
                    if generic14 != None: value += generic14






            except RecognitionException, re:
                self.reportError(re)
                self.recover(self.input, re)
        finally:

            pass

        return value

    # $ANTLR end "type"


    # $ANTLR start "generic"
    # adl.g:58:1: generic returns [value] : '<' identifiers '>' ;
    def generic(self, ):

        value = None

        identifiers15 = None


        try:
            try:
                # adl.g:59:9: ( '<' identifiers '>' )
                # adl.g:59:11: '<' identifiers '>'
                pass 
                self.match(self.input, 13, self.FOLLOW_13_in_generic420)
                self._state.following.append(self.FOLLOW_identifiers_in_generic422)
                identifiers15 = self.identifiers()

                self._state.following.pop()
                self.match(self.input, 14, self.FOLLOW_14_in_generic424)
                if self._state.backtracking == 0:
                    value = "<" + ",".join(identifiers15) + ">" 





            except RecognitionException, re:
                self.reportError(re)
                self.recover(self.input, re)
        finally:

            pass

        return value

    # $ANTLR end "generic"


    # $ANTLR start "identifiers"
    # adl.g:62:1: identifiers returns [list] : first= IDENTIFIER ( ',' more= IDENTIFIER )* ;
    def identifiers(self, ):

        list = None

        first = None
        more = None

        try:
            try:
                # adl.g:63:13: (first= IDENTIFIER ( ',' more= IDENTIFIER )* )
                # adl.g:63:15: first= IDENTIFIER ( ',' more= IDENTIFIER )*
                pass 
                first=self.match(self.input, IDENTIFIER, self.FOLLOW_IDENTIFIER_in_identifiers461)
                if self._state.backtracking == 0:
                    list = [ first.getText() ] 

                # adl.g:64:15: ( ',' more= IDENTIFIER )*
                while True: #loop12
                    alt12 = 2
                    LA12_0 = self.input.LA(1)

                    if (LA12_0 == 15) :
                        alt12 = 1


                    if alt12 == 1:
                        # adl.g:64:17: ',' more= IDENTIFIER
                        pass 
                        self.match(self.input, 15, self.FOLLOW_15_in_identifiers481)
                        more=self.match(self.input, IDENTIFIER, self.FOLLOW_IDENTIFIER_in_identifiers485)


                    else:
                        break #loop12


                if self._state.backtracking == 0:
                    if more != None: list.append( more.getText() ) 





            except RecognitionException, re:
                self.reportError(re)
                self.recover(self.input, re)
        finally:

            pass

        return list

    # $ANTLR end "identifiers"


    # $ANTLR start "name"
    # adl.g:67:1: name returns [value] : IDENTIFIER ( generic )? ;
    def name(self, ):

        value = None

        IDENTIFIER16 = None
        generic17 = None


        try:
            try:
                # adl.g:68:6: ( IDENTIFIER ( generic )? )
                # adl.g:68:8: IDENTIFIER ( generic )?
                pass 
                IDENTIFIER16=self.match(self.input, IDENTIFIER, self.FOLLOW_IDENTIFIER_in_name520)
                # adl.g:68:19: ( generic )?
                alt13 = 2
                LA13_0 = self.input.LA(1)

                if (LA13_0 == 13) :
                    alt13 = 1
                if alt13 == 1:
                    # adl.g:0:0: generic
                    pass 
                    self._state.following.append(self.FOLLOW_generic_in_name522)
                    generic17 = self.generic()

                    self._state.following.pop()



                if self._state.backtracking == 0:
                     
                    value = IDENTIFIER16.getText() 
                    if generic17 != None: value += generic17






            except RecognitionException, re:
                self.reportError(re)
                self.recover(self.input, re)
        finally:

            pass

        return value

    # $ANTLR end "name"


    # $ANTLR start "modifiers"
    # adl.g:75:1: modifiers returns [list] : ( modifier )+ ;
    def modifiers(self, ):

        list = None

        modifier18 = None


        list = [] 
        try:
            try:
                # adl.g:76:13: ( ( modifier )+ )
                # adl.g:76:15: ( modifier )+
                pass 
                # adl.g:76:15: ( modifier )+
                cnt14 = 0
                while True: #loop14
                    alt14 = 2
                    LA14_0 = self.input.LA(1)

                    if (LA14_0 == 16) :
                        alt14 = 1


                    if alt14 == 1:
                        # adl.g:76:17: modifier
                        pass 
                        self._state.following.append(self.FOLLOW_modifier_in_modifiers563)
                        modifier18 = self.modifier()

                        self._state.following.pop()
                        if self._state.backtracking == 0:
                            list.append(modifier18) 



                    else:
                        if cnt14 >= 1:
                            break #loop14

                        if self._state.backtracking > 0:
                            raise BacktrackingFailed

                        eee = EarlyExitException(14, self.input)
                        raise eee

                    cnt14 += 1






            except RecognitionException, re:
                self.reportError(re)
                self.recover(self.input, re)
        finally:

            pass

        return list

    # $ANTLR end "modifiers"


    # $ANTLR start "modifier"
    # adl.g:79:1: modifier returns [instance] : ( '+' IDENTIFIER | '+' IDENTIFIER '=' literal );
    def modifier(self, ):

        instance = None

        IDENTIFIER19 = None
        IDENTIFIER20 = None
        literal21 = None


        try:
            try:
                # adl.g:80:10: ( '+' IDENTIFIER | '+' IDENTIFIER '=' literal )
                alt15 = 2
                LA15_0 = self.input.LA(1)

                if (LA15_0 == 16) :
                    LA15_1 = self.input.LA(2)

                    if (LA15_1 == IDENTIFIER) :
                        LA15_2 = self.input.LA(3)

                        if (LA15_2 == 17) :
                            alt15 = 2
                        elif (LA15_2 == EOF or LA15_2 == IDENTIFIER or LA15_2 == 16 or (19 <= LA15_2 <= 20) or LA15_2 == 22) :
                            alt15 = 1
                        else:
                            if self._state.backtracking > 0:
                                raise BacktrackingFailed

                            nvae = NoViableAltException("", 15, 2, self.input)

                            raise nvae

                    else:
                        if self._state.backtracking > 0:
                            raise BacktrackingFailed

                        nvae = NoViableAltException("", 15, 1, self.input)

                        raise nvae

                else:
                    if self._state.backtracking > 0:
                        raise BacktrackingFailed

                    nvae = NoViableAltException("", 15, 0, self.input)

                    raise nvae

                if alt15 == 1:
                    # adl.g:80:12: '+' IDENTIFIER
                    pass 
                    self.match(self.input, 16, self.FOLLOW_16_in_modifier600)
                    IDENTIFIER19=self.match(self.input, IDENTIFIER, self.FOLLOW_IDENTIFIER_in_modifier602)
                    if self._state.backtracking == 0:
                        instance = Modifier( name=IDENTIFIER19.getText()) 



                elif alt15 == 2:
                    # adl.g:81:12: '+' IDENTIFIER '=' literal
                    pass 
                    self.match(self.input, 16, self.FOLLOW_16_in_modifier617)
                    IDENTIFIER20=self.match(self.input, IDENTIFIER, self.FOLLOW_IDENTIFIER_in_modifier619)
                    self.match(self.input, 17, self.FOLLOW_17_in_modifier621)
                    self._state.following.append(self.FOLLOW_literal_in_modifier623)
                    literal21 = self.literal()

                    self._state.following.pop()
                    if self._state.backtracking == 0:
                          
                        instance = Modifier( name=IDENTIFIER20.getText(), value = literal21 ) 





            except RecognitionException, re:
                self.reportError(re)
                self.recover(self.input, re)
        finally:

            pass

        return instance

    # $ANTLR end "modifier"


    # $ANTLR start "supers"
    # adl.g:87:1: supers returns [list] : ( super )+ ;
    def supers(self, ):

        list = None

        super22 = None


        list = [] 
        try:
            try:
                # adl.g:88:8: ( ( super )+ )
                # adl.g:88:10: ( super )+
                pass 
                # adl.g:88:10: ( super )+
                cnt16 = 0
                while True: #loop16
                    alt16 = 2
                    LA16_0 = self.input.LA(1)

                    if (LA16_0 == 18) :
                        alt16 = 1


                    if alt16 == 1:
                        # adl.g:88:12: super
                        pass 
                        self._state.following.append(self.FOLLOW_super_in_supers662)
                        super22 = self.super()

                        self._state.following.pop()
                        if self._state.backtracking == 0:
                            list.append(super22) 



                    else:
                        if cnt16 >= 1:
                            break #loop16

                        if self._state.backtracking > 0:
                            raise BacktrackingFailed

                        eee = EarlyExitException(16, self.input)
                        raise eee

                    cnt16 += 1






            except RecognitionException, re:
                self.reportError(re)
                self.recover(self.input, re)
        finally:

            pass

        return list

    # $ANTLR end "supers"


    # $ANTLR start "super"
    # adl.g:91:1: super returns [instance] : ':' type ;
    def super(self, ):

        instance = None

        type23 = None


        try:
            try:
                # adl.g:92:7: ( ':' type )
                # adl.g:92:9: ':' type
                pass 
                self.match(self.input, 18, self.FOLLOW_18_in_super693)
                self._state.following.append(self.FOLLOW_type_in_super695)
                type23 = self.type()

                self._state.following.pop()
                if self._state.backtracking == 0:
                    instance = Reference(type23) 





            except RecognitionException, re:
                self.reportError(re)
                self.recover(self.input, re)
        finally:

            pass

        return instance

    # $ANTLR end "super"


    # $ANTLR start "value"
    # adl.g:95:1: value returns [instance] : '<=' literal ;
    def value(self, ):

        instance = None

        literal24 = None


        try:
            try:
                # adl.g:96:7: ( '<=' literal )
                # adl.g:96:9: '<=' literal
                pass 
                self.match(self.input, 19, self.FOLLOW_19_in_value723)
                self._state.following.append(self.FOLLOW_literal_in_value725)
                literal24 = self.literal()

                self._state.following.pop()
                if self._state.backtracking == 0:
                    instance = Value(literal24) 





            except RecognitionException, re:
                self.reportError(re)
                self.recover(self.input, re)
        finally:

            pass

        return instance

    # $ANTLR end "value"


    # $ANTLR start "literal"
    # adl.g:99:1: literal returns [ instance ] : ( booleanliteral | integerliteral | stringliteral );
    def literal(self, ):

        instance = None

        booleanliteral25 = None

        integerliteral26 = None

        stringliteral27 = None


        try:
            try:
                # adl.g:100:9: ( booleanliteral | integerliteral | stringliteral )
                alt17 = 3
                LA17 = self.input.LA(1)
                if LA17 == BOOLEAN:
                    alt17 = 1
                elif LA17 == INTEGER:
                    alt17 = 2
                elif LA17 == STRING:
                    alt17 = 3
                else:
                    if self._state.backtracking > 0:
                        raise BacktrackingFailed

                    nvae = NoViableAltException("", 17, 0, self.input)

                    raise nvae

                if alt17 == 1:
                    # adl.g:100:11: booleanliteral
                    pass 
                    self._state.following.append(self.FOLLOW_booleanliteral_in_literal754)
                    booleanliteral25 = self.booleanliteral()

                    self._state.following.pop()
                    if self._state.backtracking == 0:
                        instance = booleanliteral25 



                elif alt17 == 2:
                    # adl.g:101:11: integerliteral
                    pass 
                    self._state.following.append(self.FOLLOW_integerliteral_in_literal768)
                    integerliteral26 = self.integerliteral()

                    self._state.following.pop()
                    if self._state.backtracking == 0:
                        instance = integerliteral26 



                elif alt17 == 3:
                    # adl.g:102:9: stringliteral
                    pass 
                    self._state.following.append(self.FOLLOW_stringliteral_in_literal780)
                    stringliteral27 = self.stringliteral()

                    self._state.following.pop()
                    if self._state.backtracking == 0:
                        instance = stringliteral27  




            except RecognitionException, re:
                self.reportError(re)
                self.recover(self.input, re)
        finally:

            pass

        return instance

    # $ANTLR end "literal"


    # $ANTLR start "booleanliteral"
    # adl.g:105:1: booleanliteral returns [instance] : BOOLEAN ;
    def booleanliteral(self, ):

        instance = None

        BOOLEAN28 = None

        try:
            try:
                # adl.g:106:16: ( BOOLEAN )
                # adl.g:106:18: BOOLEAN
                pass 
                BOOLEAN28=self.match(self.input, BOOLEAN, self.FOLLOW_BOOLEAN_in_booleanliteral818)
                if self._state.backtracking == 0:
                                        
                    value = True if BOOLEAN28.getText() == "true" else False
                    instance = Boolean(value)
                                     





            except RecognitionException, re:
                self.reportError(re)
                self.recover(self.input, re)
        finally:

            pass

        return instance

    # $ANTLR end "booleanliteral"


    # $ANTLR start "integerliteral"
    # adl.g:113:1: integerliteral returns [instance] : INTEGER ;
    def integerliteral(self, ):

        instance = None

        INTEGER29 = None

        try:
            try:
                # adl.g:114:16: ( INTEGER )
                # adl.g:114:18: INTEGER
                pass 
                INTEGER29=self.match(self.input, INTEGER, self.FOLLOW_INTEGER_in_integerliteral881)
                if self._state.backtracking == 0:
                    instance = Integer(int(INTEGER29.getText())) 





            except RecognitionException, re:
                self.reportError(re)
                self.recover(self.input, re)
        finally:

            pass

        return instance

    # $ANTLR end "integerliteral"


    # $ANTLR start "stringliteral"
    # adl.g:117:1: stringliteral returns [instance] : STRING ;
    def stringliteral(self, ):

        instance = None

        STRING30 = None

        try:
            try:
                # adl.g:118:15: ( STRING )
                # adl.g:118:17: STRING
                pass 
                STRING30=self.match(self.input, STRING, self.FOLLOW_STRING_in_stringliteral925)
                if self._state.backtracking == 0:
                    instance = String(STRING30.getText()[1:-1]) 





            except RecognitionException, re:
                self.reportError(re)
                self.recover(self.input, re)
        finally:

            pass

        return instance

    # $ANTLR end "stringliteral"


    # $ANTLR start "children"
    # adl.g:121:1: children returns [list] : ( '{' statements '}' | ';' );
    def children(self, ):

        list = None

        statements31 = None


        try:
            try:
                # adl.g:122:4: ( '{' statements '}' | ';' )
                alt18 = 2
                LA18_0 = self.input.LA(1)

                if (LA18_0 == 20) :
                    alt18 = 1
                elif (LA18_0 == 22) :
                    alt18 = 2
                else:
                    if self._state.backtracking > 0:
                        raise BacktrackingFailed

                    nvae = NoViableAltException("", 18, 0, self.input)

                    raise nvae

                if alt18 == 1:
                    # adl.g:122:6: '{' statements '}'
                    pass 
                    self.match(self.input, 20, self.FOLLOW_20_in_children958)
                    self._state.following.append(self.FOLLOW_statements_in_children960)
                    statements31 = self.statements()

                    self._state.following.pop()
                    self.match(self.input, 21, self.FOLLOW_21_in_children962)
                    if self._state.backtracking == 0:
                        list = statements31 



                elif alt18 == 2:
                    # adl.g:123:5: ';'
                    pass 
                    self.match(self.input, 22, self.FOLLOW_22_in_children970)
                    if self._state.backtracking == 0:
                        list = [] 




            except RecognitionException, re:
                self.reportError(re)
                self.recover(self.input, re)
        finally:

            pass

        return list

    # $ANTLR end "children"


    # Delegated rules


 

    FOLLOW_statements_in_compilationUnit64 = frozenset([1])
    FOLLOW_statement_in_statements113 = frozenset([1, 4, 5, 6, 16])
    FOLLOW_directive_in_statement151 = frozenset([1])
    FOLLOW_construct_in_statement167 = frozenset([1])
    FOLLOW_INCLUDEDIRECTIVE_in_directive203 = frozenset([9])
    FOLLOW_stringliteral_in_directive205 = frozenset([1])
    FOLLOW_annotations_in_construct253 = frozenset([4, 5, 6, 16, 18, 19, 20, 22])
    FOLLOW_modifiers_in_construct258 = frozenset([4, 5, 6, 16, 18, 19, 20, 22])
    FOLLOW_type_in_construct274 = frozenset([4, 5, 6, 16, 18, 19, 20, 22])
    FOLLOW_name_in_construct276 = frozenset([4, 5, 6, 16, 18, 19, 20, 22])
    FOLLOW_supers_in_construct279 = frozenset([4, 5, 6, 16, 18, 19, 20, 22])
    FOLLOW_modifiers_in_construct284 = frozenset([4, 5, 6, 16, 18, 19, 20, 22])
    FOLLOW_value_in_construct287 = frozenset([4, 5, 6, 16, 18, 19, 20, 22])
    FOLLOW_children_in_construct290 = frozenset([1])
    FOLLOW_ANNOTATION_in_annotations324 = frozenset([1, 5])
    FOLLOW_IDENTIFIER_in_type389 = frozenset([1, 13])
    FOLLOW_generic_in_type391 = frozenset([1])
    FOLLOW_13_in_generic420 = frozenset([6])
    FOLLOW_identifiers_in_generic422 = frozenset([14])
    FOLLOW_14_in_generic424 = frozenset([1])
    FOLLOW_IDENTIFIER_in_identifiers461 = frozenset([1, 15])
    FOLLOW_15_in_identifiers481 = frozenset([6])
    FOLLOW_IDENTIFIER_in_identifiers485 = frozenset([1, 15])
    FOLLOW_IDENTIFIER_in_name520 = frozenset([1, 13])
    FOLLOW_generic_in_name522 = frozenset([1])
    FOLLOW_modifier_in_modifiers563 = frozenset([1, 16])
    FOLLOW_16_in_modifier600 = frozenset([6])
    FOLLOW_IDENTIFIER_in_modifier602 = frozenset([1])
    FOLLOW_16_in_modifier617 = frozenset([6])
    FOLLOW_IDENTIFIER_in_modifier619 = frozenset([17])
    FOLLOW_17_in_modifier621 = frozenset([7, 8, 9])
    FOLLOW_literal_in_modifier623 = frozenset([1])
    FOLLOW_super_in_supers662 = frozenset([1, 18])
    FOLLOW_18_in_super693 = frozenset([4, 5, 6, 16])
    FOLLOW_type_in_super695 = frozenset([1])
    FOLLOW_19_in_value723 = frozenset([7, 8, 9])
    FOLLOW_literal_in_value725 = frozenset([1])
    FOLLOW_booleanliteral_in_literal754 = frozenset([1])
    FOLLOW_integerliteral_in_literal768 = frozenset([1])
    FOLLOW_stringliteral_in_literal780 = frozenset([1])
    FOLLOW_BOOLEAN_in_booleanliteral818 = frozenset([1])
    FOLLOW_INTEGER_in_integerliteral881 = frozenset([1])
    FOLLOW_STRING_in_stringliteral925 = frozenset([1])
    FOLLOW_20_in_children958 = frozenset([4, 5, 6, 16])
    FOLLOW_statements_in_children960 = frozenset([21])
    FOLLOW_21_in_children962 = frozenset([1])
    FOLLOW_22_in_children970 = frozenset([1])



def main(argv, stdin=sys.stdin, stdout=sys.stdout, stderr=sys.stderr):
    from antlr3.main import ParserMain
    main = ParserMain("adlLexer", adlParser)
    main.stdin = stdin
    main.stdout = stdout
    main.stderr = stderr
    main.execute(argv)


if __name__ == '__main__':
    main(sys.argv)
