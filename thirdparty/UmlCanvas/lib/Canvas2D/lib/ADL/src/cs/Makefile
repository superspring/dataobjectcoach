all: ADLSharp.dll

test: text.exe
	mono test.exe

text.exe: test.cs ADLSharp.dll
	gmcs -r:ADLSharp.dll test.cs

ADLSharp.dll: Construct.cs Modifier.cs
	gmcs -target:library -out:$@ Modifier.cs Construct.cs

clean:
	@rm -f *.dll *.exe
